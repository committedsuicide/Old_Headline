import React, {useEffect, useState} from "react";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import {Button, Panel, Text} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import Constants from "../Constants";
import axios from "axios";

export const PushPanel = ({id}) => {
    const [push_params, setParams] = useState([]);
    useEffect(()=> {
        async function getPushSettings() {
            const data = await axios.get(Constants.SERVER + 'push-params');
            await setParams(data.data[0])
            return data[0];
        };
            getPushSettings()
    }, [])

    return (
        <Panel id={id}>
            <div>
                <img height={'200px'} width={'100%'} src={push_params?.image_url}/>
                <Div className={'d-flex flex-column justify-content-center align-items-center'}
                     style={{marginTop: '10%'}}>
                    <Text weight={'semibold'}>{push_params?.title}</Text>
                    <Button style={{marginTop: '30px'}}
                            href={push_params?.button_url} target={'_blank'}>
                        {push_params?.button_text}
                    </Button>
                </Div>
            </div>
        </Panel>

    )
}