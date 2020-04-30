import React from 'react';
import { Stage } from '@inlet/react-pixi'
import Controller from './Controller';
import Map from './Map';

type PIXIAppProps={
    writeBLE:Function ,
    setCharacteristic: Function,
    height: number,
    width: number
}

type MapAppState = {
    robotX:number,
    robotY:number,
    rotation: number,
    dir: string,
}

class PIXIApp extends React.Component<PIXIAppProps, MapAppState>{

    constructor(props:any) {
        super(props);
        this.state = {
            robotX:50,
            robotY:50,
            rotation:0,
            dir: "STOP",
        }
    }

    setRobotPos(newX:number, newY:number){
        this.setState({
            robotX: newX,
            robotY: newY
        })
    }

    setDir(newDir:string){
        console.log("Updating");
        let newRobotX = this.state.robotX;
        let newRobotY = this.state.robotY;
        let newRotation = this.state.rotation;
        if(newDir === "UP")
        {
            let distance = 1;
            newRobotX = this.state.robotX + distance * Math.cos(this.state.rotation);
            newRobotY = this.state.robotY + distance * Math.sin(this.state.rotation);
        }
        else if(newDir == "RIGHT"){
            newRotation += .1;
        }
        else if(newDir == "LEFT"){
            newRotation -=.1;
        }
        else if(newDir == "DOWN"){
            let distance = -1;
            newRobotX = (this.state.robotX + distance * Math.cos(this.state.rotation));
            newRobotY = (this.state.robotY + distance * Math.sin(this.state.rotation));
        }

        newRobotX = newRobotX < 411 && newRobotX > 0 ? newRobotX : this.state.robotX
        newRobotY = newRobotY < 564 && newRobotY > 0 ? newRobotY : this.state.robotY
        console.log(newRobotX + " " + newRobotY + " " +newRotation)
        this.setState({
            robotX: newRobotX,
            robotY: newRobotY,
            rotation: newRotation,
            dir:newDir
        })
       

    }

    render(){
        let options = {
            backgroundColor: 0x232324
        }
        const _width = 1082;
        const _height = 500;

        return(
            <>
            <Stage width={_width} height={_height} options={options}> 
                <Controller stageWidth={_width} stageHeight={_height} writeBLE={this.props.writeBLE} setCharacteristic={this.props.setCharacteristic} setDir={this.setDir.bind(this)}/>
            </Stage>
            <Stage width={411} height={564}>
                <Map robotX={this.state.robotX} robotY={this.state.robotY} dir={this.state.dir} rotation={this.state.rotation}/>
            </Stage>
            </>
        )
    }
}

export default PIXIApp;