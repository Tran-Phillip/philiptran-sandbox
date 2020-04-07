var chunk_loader = /** @class */ (function () {
    function chunk_loader() {
        this.idx = 0;
        this.chunks = [];
    }
    chunk_loader.prototype.add_chunks = function (chunks) {
        this.chunks = chunks;
    };
    chunk_loader.prototype.next_chunk = function () {
        return (this.chunks[this.idx++]);
    };
    chunk_loader.prototype.get_idx = function () {
        return (this.idx);
    };
    chunk_loader.prototype.hasNext = function () {
        return (this.idx < this.chunks.length);
    };
    chunk_loader.prototype.write_chunk = function (to_write) {
        var _this = this;
        return (characteristic.writeValue(to_write))
            .catch(function (error) { return _this.write_chunk(to_write); });
    };
    return chunk_loader;
}());
var loader = new chunk_loader();
var characteristic = null;
function setup() {
    var bluetooth_connect_btn = document.createElement("BUTTON");
    bluetooth_connect_btn.innerHTML = "CONNECT";
    bluetooth_connect_btn.onclick = connect_to_device;
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(bluetooth_connect_btn);
    var form = document.createElement("FORM");
    form.onsubmit = function () { return false; };
    document.body.appendChild(form);
    var file_input = document.createElement("input");
    file_input.type = "file";
    file_input.id = "fileinput";
    var load_file_button = document.createElement("BUTTON");
    load_file_button.id = "btnLoad";
    load_file_button.innerHTML = "UPLOAD";
    load_file_button.onclick = load_file;
    form.appendChild(file_input);
    form.appendChild(load_file_button);
}
function connect_to_device() {
    var UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    var navigator = window.navigator;
    navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: [UUID] })
        .then(function (device) {
        console.log('Connecting to GATT Server...');
        return device.gatt.connect();
    })
        .then(function (server) {
        console.log("getting service");
        return (server.getPrimaryService(UUID));
    })
        .then(function (service) {
        console.log("Getting characteristics");
        return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
    })
        .then(function (_characteristic) {
        console.log("getting characteristic");
        characteristic = _characteristic;
        characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', send_next_bytes);
        console.log(characteristic);
    });
}
function send_next_bytes(event) {
    var enc = new TextEncoder();
    if (!loader.hasNext()) {
        console.log("all done!");
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        console.log(datetime);
        loader.write_chunk(enc.encode("done"));
        return;
    }
    console.log("sending next: ");
    var to_write = loader.next_chunk();
    console.log(to_write);
    loader.write_chunk(to_write);
}
function load_file() {
    var input, file, fr;
    input = document.getElementById('fileinput');
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsArrayBuffer(file);
    function receivedText() {
        var result = fr.result;
        console.log("sending first chunk");
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        console.log(datetime);
        loader.add_chunks(listify(result));
        characteristic.writeValue(loader.next_chunk());
    }
}
function listify(result) {
    //split into 512 byte sized chunks
    var l = [];
    var enc = new TextEncoder();
    while (result.byteLength > 0) {
        var chunk = result.slice(0, 511);
        l.push(_appendBuffer(chunk, enc.encode('|')));
        // l.push(chunk);
        // l.push(enc.encode("|"))
        result = result.slice(511);
    }
    l.unshift(enc.encode(l[l.length - 1].byteLength));
    return l;
}
function _appendBuffer(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
}
;
setup();
