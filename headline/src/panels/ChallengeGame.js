import Div from "@vkontakte/vkui/dist/components/Div/Div";
import {Button, IOS, Panel, PanelHeader, platform, PopoutWrapper, Text} from "@vkontakte/vkui";
import logo from '../img/hl.png'
import PanelHeaderButton from "@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Constants from "../Constants";
import ScreenSpinner from "@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner";
import Phrases from "./Phrases";
import Icon28VolumeOutline from '@vkontakte/icons/dist/28/volume_outline';
import bridge from "@vkontakte/vk-bridge";

const osName = platform();
export const ChallengeGame = ({id, userId, onBackIconClick, category, showGamePopout, showGameDonePopout}) => {
    const [currentPhrase, setCurrentPhrase] = useState(null);
    const [phrases, setPhrases] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [guessCount, setCount] = useState(0);
    const [gameType, setGameType] = useState(0);
    useEffect(() => {
        async function fetchData() {
            const token = await bridge.send('VKWebAppCallAPIMethod', {method: 'storage.get', params: {
                    'key': 'jwtToken',
                    'access_token': Constants.SERVICE_TOKEN,
                    'user_id': userId,
                    'v': '5.126'
                }})
            await axios.get(Constants.SERVER + 'phrase/categoryphrases' + category.id,{headers:{
                    'Authorization': 'Bearer ' + token.response[0].value
                }}).then(response => {
                const shuffledPhrases = shuffle(response.data);
                setPhrases(shuffledPhrases);
                setCurrentPhrase(shuffledPhrases[0]);
                setLoaded(true);
            }).catch((error) => {
                console.log(error);
            })
        };
        fetchData();
    }, [category]);
    useEffect(() => {
        function getAnswers() {
            if (currentPhrase) {
                const answers = [];
                answers.push(currentPhrase);
                for (let j = 0; j < 3; j++) {
                    let randomAnswer = currentPhrase;
                    let flag = true;
                    do {
                        let i = Math.floor(Math.random() * (phrases.length - 1));
                        randomAnswer = phrases[i];
                        if (!answers.includes(randomAnswer)) {
                            flag = false;
                        }
                    } while (flag);
                    answers.push(randomAnswer)
                }
                setAnswers(shuffle(answers));
            }
        }

        getAnswers();
    }, [currentPhrase]);

    function checkAnswer(answer) {
        if ((phrases.indexOf(currentPhrase) + 1) === phrases.length) {
            showGameDonePopout(guessCount, phrases.length);
            return;
        }
        if (answer === currentPhrase) {
            showGamePopout(currentPhrase, true, gameType);
            setCount(guessCount + 1);
            setCurrentPhrase(phrases[phrases.indexOf(currentPhrase) + 1]);
        } else {
            showGamePopout(currentPhrase, false, gameType);
            setCurrentPhrase(phrases[phrases.indexOf(currentPhrase) + 1]);
        }
    };
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
    if (isLoaded) {
        switch (gameType) {
            case 0: {
                return(
                <Panel id={id} centered={true}>
                    <PanelHeader
                        left={<PanelHeaderButton
                            onClick={onBackIconClick}
                            data-to={'challenges'}
                        >
                            {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                        </PanelHeaderButton>}
                    >
                        {category.categoryName}
                    </PanelHeader>
                    <Div>
                        <div style={{marginBottom: '25px'}}>
                            <Button
                                style={{width: '100%'}}
                                onClick={() => {setGameType(1)}}>Перевод корейских слов</Button>
                        </div>
                        <div>
                            <Button
                                style={{width: '100%'}}
                                onClick={() => {setGameType(2)}}>Перевод русских слов</Button>
                        </div>
                    </Div>
                </Panel>
                )
            }
            case 1: {
                return (
                    <Panel id={id} centered>
                        <PanelHeader
                            left={<PanelHeaderButton
                                onClick={onBackIconClick}
                                data-to={'challenges'}
                            >
                                {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                            </PanelHeaderButton>}
                        >
                            {category.categoryName}
                        </PanelHeader>
                        <Div style={{textAlign: 'center'}}>
                            <div>
                                <Text>{currentPhrase?.phrase}</Text>
                                <div className={'d-flex justify-content-center align-items-center'}>
                                    <Text>{currentPhrase?.transcription} </Text>
                                    <Icon28VolumeOutline
                                        onClick={() => {
                                            const fileUrl = Constants.SERVER + 'phrase/getPhraseSound' + currentPhrase.id;
                                            const audio = new Audio(fileUrl);
                                            audio.play();
                                        }}
                                        style={{marginLeft: '5px'}}
                                    />

                                </div>
                                <Button style={{
                                    float: 'none',
                                    marginRight: 'auto',
                                    marginTop: "15px",
                                    width: '80%'
                                }}
                                        onClick={() => checkAnswer(answers[0])}>{answers[0]?.translation}</Button>
                                <Button style={{
                                    float: 'none',
                                    marginRight: 'auto',
                                    marginTop: "15px",
                                    width: '80%'
                                }} onClick={() => checkAnswer(answers[1])}>{answers[1].translation}</Button>
                                <Button style={{
                                    float: 'none',
                                    marginRight: 'auto',
                                    marginTop: "15px",
                                    width: '80%'
                                }} onClick={() => checkAnswer(answers[2])}>{answers[2].translation}</Button>
                                <Button style={{
                                    float: 'none',
                                    marginRight: 'auto',
                                    marginTop: "15px",
                                    width: '80%'
                                }} onClick={() => checkAnswer(answers[3])}>{answers[3].translation}</Button>
                            </div>
                        </Div>
                        <img src={logo} style={{marginTop: '10px'}}/>
                    </Panel>
                )
            }
            case 2: {
                return (
                    <Panel id={id} centered>
                        <PanelHeader
                            left={<PanelHeaderButton
                                onClick={onBackIconClick}
                                data-to={'challenges'}
                            >
                                {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                            </PanelHeaderButton>}
                        >
                            {category.categoryName}
                        </PanelHeader>
                        <Div style={{textAlign: 'center'}}>
                            <div>
                                <Text>{currentPhrase?.translation}</Text>
                                {/*<div className={'d-flex justify-content-center align-items-center'}>
                                    <Text>{currentPhrase?.transcription} </Text>
                                    <Icon28VolumeOutline
                                        onClick={() => {
                                            const fileUrl = Constants.SERVER + 'phrase/getPhraseSound' + currentPhrase.id;
                                            const audio = new Audio(fileUrl);
                                            audio.play();
                                        }}
                                        style={{marginLeft: '5px'}}
                                    />

                                </div>*/}
                                <Button style={{
                                    float: 'none',
                                    marginRight: 'auto',
                                    marginTop: "15px",
                                    width: '80%'
                                }}
                                        onClick={() => checkAnswer(answers[0])}>{answers[0]?.phrase}</Button>
                                <Button style={{
                                    float: 'none',
                                    marginRight: 'auto',
                                    marginTop: "15px",
                                    width: '80%'
                                }} onClick={() => checkAnswer(answers[1])}>{answers[1]?.phrase}</Button>
                                <Button style={{
                                    float: 'none',
                                    marginRight: 'auto',
                                    marginTop: "15px",
                                    width: '80%'
                                }} onClick={() => checkAnswer(answers[2])}>{answers[2]?.phrase}</Button>
                                <Button style={{
                                    float: 'none',
                                    marginRight: 'auto',
                                    marginTop: "15px",
                                    width: '80%'
                                }} onClick={() => checkAnswer(answers[3])}>{answers[3]?.phrase}</Button>
                            </div>
                        </Div>
                        <img src={logo} style={{marginTop: '10px'}}/>
                    </Panel>
                )
            }
        }
    } else {
        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderButton
                        onClick={onBackIconClick}
                        data-to={'challenges'}
                    >
                        {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                    </PanelHeaderButton>}
                >
                    {category.categoryName}
                </PanelHeader>
            </Panel>
        )
    }
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
