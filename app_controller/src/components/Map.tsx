import React from 'react';
import { Sprite, Container } from '@inlet/react-pixi';
import MapImg from '../images/simple.png';
import Robot from '../images/freight100.png';

type mapProps = {
    robotX:number, 
    robotY:number,
    rotation:number,
    dir: string
}

class Map extends React.Component<mapProps>{
    robotProps = {
        width:28,
        height: 25
    }

    render(){
        return(
            <>
            <Sprite image={MapImg} x={0} y={0}/>

                <Sprite 
                {...this.robotProps}
                anchor={[.5,.5]}
                image={Robot}
                 x={this.props.robotX}
                 y={this.props.robotY}
                 rotation={this.props.rotation}
                />
            </>
        )
    }
}

export default Map;