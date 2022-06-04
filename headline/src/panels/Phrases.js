import {Panel, PanelHeader, Div, IOS, platform, PanelHeaderBack} from "@vkontakte/vkui";
import React, {useState, useEffect} from 'react';
import {PhraseCard} from "../components/PhraseCard";
import PanelHeaderButton from "@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import axios from "axios";
import Constants from "../Constants";
import bridge from "@vkontakte/vk-bridge";
import {CollectionCard} from "../components/CollectionCard";

const osName = platform();
const Phrases = ({id, userId, onBackIconClick, category}) => {
    const [phrases, setPhrases] = useState([]);
    useEffect(() => {
        async function getData(){
            const token = await bridge.send('VKWebAppCallAPIMethod', {method: 'storage.get', params: {
                    'key': 'jwtToken',
                    'access_token': Constants.SERVICE_TOKEN,
                    'user_id': userId,
                    'v': '5.126'
                }});
            axios.get(Constants.SERVER + 'phrase/categoryphrases' + category.id, {headers:{
                    'Authorization': 'Bearer ' + token.response[0].value
                }}).then(response => {
                setPhrases(response.data);
            }).catch((error) => {
                console.log(error);
            })
        }
        getData();
    }, []);
    async function getSound(phraseId) {
        const token = await bridge.send('VKWebAppCallAPIMethod', {method: 'storage.get', params: {
                'key': 'jwtToken',
                'access_token': Constants.SERVICE_TOKEN,
                'user_id': userId,
                'v': '5.126'
            }})
        return await axios.get(Constants.SERVER + 'phrase/getPhraseSound' + phraseId, {responseType: "arraybuffer", headers:{
                'Authorization': 'Bearer ' + token.response[0].value
            }});
    }
    return (
        <Panel id={id} >
                <PanelHeader
                    left={<PanelHeaderButton
                        onClick={onBackIconClick}
                        data-to={'collections'}
                        >
                        {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                        </PanelHeaderButton>}
                >
                    {category.categoryName}
                </PanelHeader>
            <Div>
                {
                    phrases.map((phrase) => {
                        return (
                            <PhraseCard phrase={phrase.phrase}
                                        transcription={phrase.transcription}
                                        translation={phrase.translation}
                                        id={phrase.id}
                                        getSound={getSound}
                                        key={phrase.id}
                            />
                        )
                    })
                }
            </Div>
        </Panel>
    )
};

export default Phrases;