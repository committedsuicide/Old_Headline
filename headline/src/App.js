import React, {useEffect, useState} from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Phrases from './panels/Phrases'
import {ConfigProvider, Epic, PopoutWrapper} from "@vkontakte/vkui";
import Tabbar from "@vkontakte/vkui/dist/components/Tabbar/Tabbar";
import TabbarItem from "@vkontakte/vkui/dist/components/TabbarItem/TabbarItem";
import Icon28UserCircleOutline from '@vkontakte/icons/dist/28/user_circle_outline';
import Icon28ListPlayOutline from '@vkontakte/icons/dist/28/list_play_outline';
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';
import Icon28GameOutline from '@vkontakte/icons/dist/28/game_outline';
import Icon24Education from "@vkontakte/icons/dist/24/education";
import Collections from "./panels/Collections";
import {Challenges} from "./panels/Challenges";
import {RecieveCollection} from "./panels/RecieveCollection";
import Profile from "./panels/Profile";
import {ChallengeGame} from "./panels/ChallengeGame";
import {Lessons} from "./panels/Lessons";
import axios from "axios";
import Constants from "./Constants";
import {GamePopout} from "./components/GamePopout";
import {GameDonePopout} from "./components/GameDonePopout";
import {RightAnswerPopout} from "./components/RightAnswerPopout";
import {PushPanel} from "./panels/PushPanel";

const App = () => {
    const [activePanel, setActivePanel] = useState('collections');
    const [activeStory, setActiveStory] = useState('collections');
    const [fetchedUser, setUser] = useState(null);
    const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);
    const [gamePopout, setGamePopout] = useState(null);
    const [selectedCategory, selectCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [vkRef, setRef] = useState('');

    useEffect(() => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                const schemeAttribute = document.createAttribute('scheme');
                schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
                document.body.attributes.setNamedItem(schemeAttribute);
            }
        });

        async function fetchData() {
            const queryParams = parseQueryString(window.location.search);
            console.log(queryParams)
            if (queryParams['vk_ref'] == 'notifications'){
                setRef('notifications')
            }
            if (queryParams?.vk_are_notifications_enabled !== "1"){
                setTimeout(bridge.send,300000, ("VKWebAppAllowNotifications"))
            }
            let jwt;
            let user;
            await axios.post(Constants.SERVER + 'auth', {queryParams}).then(response => {
                jwt = response.data.jwt;
                user = response.data.user;

            }).catch((error) => {
                console.log(error);
            });
            await axios.get(Constants.SERVER + 'user/userCategories' + user.vkId, {headers:{
                'Authorization': 'Bearer ' + jwt
            }}).then(response => {
                setAvailableCategories(response.data);
            }).catch((error) => {
                console.log(error);
            });
            axios.get(Constants.SERVER + 'phrase/categories', {
                headers: {
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(response => {
                setCategories(response.data);
            }).catch((error) => {
                console.log(error);
            })
            await bridge.send('VKWebAppCallAPIMethod', {
                method: 'storage.set', params: {
                    'key': 'jwtToken',
                    'value': jwt,
                    'access_token': Constants.SERVICE_TOKEN,
                    'user_id': user.vkId,
                    'v': '5.126'
                }
            }).catch((res) => {
                console.log(res)
            });
            setUser(user);
        }
        fetchData();
        setPopout(null);
    }, []);

    const onStoryChange = e => {
        if (activeStory == e.currentTarget.dataset.story) {
            return;
        }
        setActiveStory(e.currentTarget.dataset.story);
        setActivePanel(e.currentTarget.dataset.story);
    };


    const onPanelChange = e => {
        setActivePanel(e.currentTarget.dataset.to)
    };
    const onCardButtonClick = e => {
        selectCategory({
            id: e.currentTarget.dataset.categoryId,
            categoryName: e.currentTarget.dataset.categoryName
        });
        setActivePanel(e.currentTarget.dataset.to);
    };
    const showGamePopout = (phrase, correct, type) => {
        if (!correct) {
            setGamePopout(
                <PopoutWrapper>
                    <GamePopout phrase={phrase}
                                close={() => setGamePopout(null)}
                                type={type}
                    />
                </PopoutWrapper>
            )
        }else {
            setGamePopout(
                <PopoutWrapper>
                    <RightAnswerPopout phrase={phrase}
                                close={() => setGamePopout(null)}
                    />
                </PopoutWrapper>
            )
        }
    };
    const showGameDonePopout = (guessCount, totalCount) => {
        setGamePopout(
            <PopoutWrapper>
                <GameDonePopout guessCount={guessCount}
                                totalCount={totalCount}
                                close={() => setGamePopout(null)}
                />
            </PopoutWrapper>
        );
        setActivePanel('challenges');
    };
    const addAvailableCategory = (categories) => {
        if (categories) {
            setAvailableCategories(categories);
        }
    }
    if (vkRef !== 'notifications') {
        return (
            <ConfigProvider>
                <Epic activeStory={activeStory} tabbar={
                    <Tabbar itemsLayout={'vertical'}>
                        <TabbarItem
                            text="Моя подборка"
                            data-story={'collections'}
                            selected={activeStory === 'collections'}
                            onClick={onStoryChange}
                        ><Icon28ListPlayOutline/></TabbarItem>
                        <TabbarItem
                            text="Тестирование"
                            data-story={'challenges'}
                            selected={activeStory === 'challenges'}
                            onClick={onStoryChange}
                        ><Icon28GameOutline/></TabbarItem>
                        <TabbarItem
                            text="Дополнительно"
                            data-story={'recieveCollection'}
                            selected={activeStory === 'recieveCollection'}
                            onClick={onStoryChange}
                        ><Icon28ListAddOutline/></TabbarItem>
                        <TabbarItem
                            text="Уроки"
                            data-story={'freeLessons'}
                            selected={activeStory === 'freeLessons'}
                            onClick={onStoryChange}
                        ><Icon24Education height={28} width={28}/></TabbarItem>
                        <TabbarItem
                            text="Профиль"
                            data-story={'profile'}
                            selected={activeStory === 'profile'}
                            onClick={onStoryChange}
                        ><Icon28UserCircleOutline/></TabbarItem>
                    </Tabbar>
                }>
                    <View id={'collections'} activePanel={activePanel} popout={popout}>
                        <Collections id='collections'
                                     categories={categories}
                                     availableCategories={availableCategories}
                                     onCardButtonClick={onCardButtonClick}/>
                        <Phrases id={'phrases'}
                                 userId={fetchedUser?.vkId}
                                 category={selectedCategory}
                                 onBackIconClick={onPanelChange}/>
                    </View>
                    <View id={'challenges'} activePanel={activePanel} popout={gamePopout}>
                        <Challenges id='challenges'
                                    categories={categories}
                                    onCardButtonClick={onCardButtonClick}
                                    availableCategories={availableCategories}
                        />
                        <ChallengeGame id={'challengeGame'}
                                       userId={fetchedUser?.vkId}
                                       category={selectedCategory}
                                       showGamePopout={showGamePopout}
                                       showGameDonePopout={showGameDonePopout}
                                       onBackIconClick={onPanelChange}/>
                    </View>
                    <View id={'recieveCollection'} activePanel={activePanel}>
                        <RecieveCollection id={'recieveCollection'}
                                           user={fetchedUser}
                                           onCategoryAdd={addAvailableCategory}
                                           availableCategories={availableCategories}

                        />
                    </View>
                    <View id={'freeLessons'} activePanel={activePanel}>
                        <Lessons id={'freeLessons'}/>
                    </View>
                    <View id={'profile'}
                          activePanel={activePanel}
                    >
                        <Profile id={'profile'}
                                 user={fetchedUser}/>
                    </View>
                </Epic>
            </ConfigProvider>

        );
    } else return (
        <PushPanel/>
    )
};
const parseQueryString = (string) => {
    return string.slice(1).split('&')
        .map((queryParam) => {
            const kvp = queryParam.split('=')
            return {key: kvp[0], value: kvp[1]}
        })
        .reduce((query, kvp) => {
            query[kvp.key] = kvp.value
            return query
        }, {})
}
export default App;

