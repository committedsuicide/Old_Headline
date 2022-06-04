import {Button, Panel, PanelHeader, Text} from "@vkontakte/vkui";
import React, {useState} from "react";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import logo from '../img/hl.png'
import bridge from '@vkontakte/vk-bridge';
import axios from "axios";
import Constants from "../Constants";

export const RecieveCollection = ({id, user, onCategoryAdd, availableCategories}) => {
    return (
        <Panel id={id}>
            <PanelHeader>
                Получить наборы
            </PanelHeader>
            <Div className={'d-flex flex-row justify-content-between align-items-center'}>
                <div style={{paddingRight: '10px'}}>
                    <Text>Получить набор "Профессии" за подписку на группу</Text>
                </div>
                <Button onClick={() => {
                    subscribeToGroup(user.vkId).then((result) => {
                        onCategoryAdd(result)
                    })
                }}
                        disabled={availableCategories.some((cat) => {return cat.categoryName === 'Профессии'})}
                >Получить</Button>
            </Div>
            {/*<Div className={'d-flex flex-row justify-content-between align-items-center'}>*/}
            {/*    <div style={{paddingRight: '10px'}}>*/}
            {/*        <Text>Получить набор "Профессии" за репост записи</Text>*/}
            {/*    </div>*/}
            {/*    <Button onClick={() => {*/}
            {/*        repost(user.vkId).then((result) => {*/}
            {/*            onCategoryAdd(result)*/}
            {/*        })*/}
            {/*    }}>Получить</Button>*/}
            {/*</Div>*/}
            <Div className={'d-flex flex-row justify-content-between align-items-center'}>
                <div style={{paddingRight: '10px'}}>
                    <Text>Получить набор "Части тела" за репост истории</Text>
                </div>
                <Button onClick={() => {
                    storyPost(user.vkId).then((result) => {
                        onCategoryAdd(result)
                    })
                }}
                disabled={availableCategories.some((cat) => {return cat.categoryName === 'Части тела'})}>Получить</Button>
            </Div>
            <Div className={'d-flex flex-row justify-content-between align-items-center'}>
                <div style={{paddingRight: '10px'}}>
                    <Text>Получить набор "Транспорт" за подписку на Push-уведомления</Text>
                </div>
                <Button onClick={() => {
                    notificationSubscribe(user.vkId).then((result) => {
                        onCategoryAdd(result)
                    })
                }}
                        disabled={availableCategories.some((cat) => {return cat.categoryName === 'Транспорт'})}
                >Получить</Button>
            </Div>
            <Div style={{textAlign: 'center'}}>
                <img src={logo}/>
            </Div>
        </Panel>
    )}

;

async function subscribeToGroup(userId) {
    let categories;
    const token = await bridge.send('VKWebAppCallAPIMethod', {method: 'storage.get', params: {
            'key': 'jwtToken',
            'access_token': Constants.SERVICE_TOKEN,
            'user_id': userId,
            'v': '5.126'
        }});
    await bridge.send("VKWebAppJoinGroup", {"group_id": 172886598})
        .then(() => {
            axios.post(Constants.SERVER + 'user/giveCategory', {id: userId, categoryName: 'Профессии'},{headers:{
                    'Authorization': 'Bearer ' + token.response[0].value
                }}).then((res) => {
                    categories = res.data;
            })
        })
        .catch((error) => {
            console.log(error);
        })
    return categories
}

async function repost(userId) {
    const auth_token = await bridge.send("VKWebAppGetAuthToken", {"app_id": Constants.APP_ID, "scope": "wall"});
    console.log(auth_token)
    let categories;
    const token = await bridge.send('VKWebAppCallAPIMethod', {method: 'storage.get', params: {
            'key': 'jwtToken',
            'access_token': Constants.SERVICE_TOKEN,
            'user_id': userId,
            'v': '5.126'
        }});
    await bridge.send("VKWebAppCallAPIMethod",
        {
            "method": "wall.post",
            "request_id": "test1",
            "params": {
                "v": "5.126", "access_token": auth_token.access_token,
                "attachments": 'photo138487687_457269603',
                "message": ''
            }
        })
        .then(async (response) => {
            await axios.post(Constants.SERVER + 'user/giveCategory', {
                id: userId,
                categoryName: 'Погода'
            },{headers:{
                    'Authorization': 'Bearer ' + token.response[0].value
                }}).then((response => {
                categories = response.data;
            }))
        })
        .catch((error) => {
            console.log(error);
        });
    return categories
}

async function storyPost(userId) {
    let categories;
    const token = await bridge.send('VKWebAppCallAPIMethod', {method: 'storage.get', params: {
            'key': 'jwtToken',
            'access_token': Constants.SERVICE_TOKEN,
            'user_id': userId,
            'v': '5.126'
        }});
    await bridge.send(
        "VKWebAppShowStoryBox",
        {
            "background_type": "image",
            "url": Constants.SERVER + "getPicstories_banner.png",
            "attachment": {
                text: "go_to",
                type: 'url',
                url: 'https://vk.com/app7612467'
            },
            locked: true
        })
        .then(async (response) => {
            await axios.post(Constants.SERVER + 'user/giveCategory', {
                id: userId,
                categoryName: 'Части тела'
            },{headers:{
                    'Authorization': 'Bearer ' + token.response[0].value
                }}).then((response => {
                categories = response.data;
            }))
        })
        .catch((error) => {
            console.log(error);
        });
    return categories
}

async function notificationSubscribe(userId) {
    let categories;
    const token = await bridge.send('VKWebAppCallAPIMethod', {method: 'storage.get', params: {
            'key': 'jwtToken',
            'access_token': Constants.SERVICE_TOKEN,
            'user_id': userId,
            'v': '5.126'
        }});
    await bridge.send("VKWebAppAllowNotifications")
        .then(async (response) => {
            await axios.post(Constants.SERVER + 'user/giveCategory', {
                id: userId,
                categoryName: 'Транспорт'
            },{headers:{
                    'Authorization': 'Bearer ' + token.response[0].value
                }}).then((response => {
                categories = response.data;
            }))
        })
        .catch((error) => {
            console.log(error);
        });
    return categories

}