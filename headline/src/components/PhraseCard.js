import React from 'react';
import Text from "@vkontakte/vkui/dist/components/Typography/Text/Text";
import Icon28VolumeOutline from '@vkontakte/icons/dist/28/volume_outline';
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import axios from "axios";
import Constants from "../Constants";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import bridge from "@vkontakte/vk-bridge";
import '../styles/Card.css'
import Group from "@vkontakte/vkui/dist/components/Group/Group";

export class PhraseCard extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            notPlaying: true
        }
    }


    render() {
        return (
            <Group>

                <div className={'d-flex flex-row justify-content-between '}>
                    <div className={'d-flex flex-column'}>
                        <Text weight={'semibold'}>{this.props.translation}</Text>
                        <Text weight={'semibold'} style={{color: 'DeepSkyBlue'}}>{this.props.phrase}</Text>
                        <Text weight={'regular'}>{this.props.transcription}</Text>
                    </div>
                    <div className={'d-flex align-items-center'}>

                        <Icon28VolumeOutline
                            style={{marginRight: '15px'}}
                            onClick={() => {
                                if (this.state.notPlaying) {
                                    this.setState({notPlaying: false});
                                    const fileUrl = Constants.SERVER + 'phrase/getPhraseSound' + this.props.id
                                    const audio = new Audio(fileUrl);
                                    audio.addEventListener('ended', ev => {
                                        this.setState({notPlaying: true});
                                    })
                                    audio.play().catch(()=> {
                                        this.setState({notPlaying: true});
                                    });
                                    }
                            }}/>


                    </div>
                </div>

            </Group>
        )
    }
}

