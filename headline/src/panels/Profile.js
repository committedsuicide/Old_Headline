import {Button, IOS, Link, Panel, PanelHeader, Text} from "@vkontakte/vkui";
import React, {useEffect, useState} from "react";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import logo from '../img/hl.png'
import bridge from '@vkontakte/vk-bridge';
import Constants from "../Constants";
import axios from "axios";

const Profile = ({id, user}) => {
    const [push_params, setParams] = useState([]);
    useEffect(() => {
        async function getPushSettings() {
            const token = await bridge.send('VKWebAppCallAPIMethod', {
                method: 'storage.get', params: {
                    'key': 'jwtToken',
                    'access_token': Constants.SERVICE_TOKEN,
                    'user_id': user.vkId,
                    'v': '5.126'
                }
            });
            let sql = "SELECT * FROM app_entity ORDER BY id DESC limit 1";
            const data = await axios.post(Constants.SERVER + 'exec-sql', {sql: sql}, {
                headers: {
                    'Authorization': 'Bearer ' + token.response[0].value
                }
            });
            await setParams(data.data[0])
            return data[0];
        };
        if (user.role === 'admin') {
            getPushSettings()
        }
    }, [])

    async function sendIds(file) {
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = async function () {
                const screenIds = reader.result.split('\n');
                let strIds = '';
                screenIds.forEach((item) => {
                    strIds = strIds + item + ','
                });
                strIds = strIds.slice(0, -1);

                const vkIds = [];
                await bridge.send("VKWebAppCallAPIMethod",
                    {
                        "method": "users.get",
                        "request_id": "setPro",
                        "params": {"user_ids": strIds, "v": "5.126", "access_token": Constants.SERVICE_TOKEN}
                    })
                    .then((response) => {
                        response.response.forEach((item) => {
                            vkIds.push(item.id);
                        })
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                const token = await bridge.send('VKWebAppCallAPIMethod', {
                    method: 'storage.get', params: {
                        'key': 'jwtToken',
                        'access_token': Constants.SERVICE_TOKEN,
                        'user_id': user.vkId,
                        'v': '5.126'
                    }
                });
                await axios.post(Constants.SERVER + 'user/givePro', {ids: vkIds}, {
                    headers: {
                        'Authorization': 'Bearer ' + token.response[0].value
                    }
                })
            };

            reader.onerror = function () {
                console.log(reader.error);
            };
        }
    }

    return (<Panel id={id}>
        <PanelHeader>
            Профиль
        </PanelHeader>
        <Div className={'d-flex flex-row justify-content-between align-items-center'} style={{marginTop: '10%'}}>
            <div>
                <Text>Мой тариф: </Text><Text weight={'semibold'}>{user?.tariff ? user.tariff : 'undefined'}</Text>
            </div>
            {
                user?.tariff === 'Pro' ? <Text weight={'semibold'}>Pro активирован!</Text>
                    :
                    <Link href={'https://vk.com/app5898182_-186372708#s=1151639'}
                          target={'_blank'}

                    >
                        Получить Pro</Link>
            }
        </Div>
        <Div className={'d-flex flex-column justify-content-center align-items-center'}>
            <Link href={'https://headlineschool.ru/'}
                  target={'_blank'}
            >
                <img src={logo}/>
            </Link>
        </Div>
        {
            user?.role === 'admin' ?
                <div>
                    <Div>
                        <Text>Админка</Text>
                        <input id={'ids'} type={'file'}/>
                        <button onClick={() => {
                            sendIds(document.getElementById('ids')?.files[0])
                        }}
                        >
                            Отправить
                        </button>
                    </Div>
                    <Div>
                        <div className={'d-flex flex-column justify-content-center'}>
                            <Text>Ссылка на картинку</Text>
                            <input id={'image_url'} defaultValue={push_params?.image_url}/>
                        </div>
                        <div className={'d-flex flex-column justify-content-center'}>
                            <Text>Заголовок</Text>
                            <input id={'title'} defaultValue={push_params?.title}/>
                        </div>
                        <div className={'d-flex flex-column justify-content-center'}>
                            <Text>Текст кнопки</Text>
                            <input id={'button_text'} defaultValue={push_params?.button_text}/>
                        </div>
                        <div className={'d-flex flex-column justify-content-center'}>
                            <Text>Ссылка на кнопке</Text>
                            <input id={'button_url'} defaultValue={push_params?.button_url}/>
                        </div>
                        <div className={'d-flex flex-column justify-content-center'}>
                            <Text>Текст уведомления</Text>
                            <input id={'push_text'}/>
                        </div>
                        <div className={'d-flex justify-content-between'} style={{marginTop: '10px'}}>
                            <button onClick={() => {
                                saveSettings()
                            }}>Сохранить настройки Push
                            </button>
                            <button onClick={() => {
                                Push();
                            }}>Отправить Push
                            </button>
                        </div>
                    </Div>
                </div>
                : <div/>
        }
    </Panel>)

    async function Push() {
        const token = await bridge.send('VKWebAppCallAPIMethod', {
            method: 'storage.get', params: {
                'key': 'jwtToken',
                'access_token': Constants.SERVICE_TOKEN,
                'user_id': user.vkId,
                'v': '5.126'
            }
        });
        let sql = 'SELECT COUNT(*) FROM "user_entity"'
        const count = await axios.post(Constants.SERVER + 'exec-sql', {sql: sql}, {
            headers: {
                'Authorization': 'Bearer ' + token.response[0].value
            }
        })

        let users = [];
        let data;
        for (let i = 0; i < count.data[0].count / 100; i++) {
            sql = `SELECT * FROM "user_entity" LIMIT 100 OFFSET ${i * 100}`;
            data = await axios.post(Constants.SERVER + 'exec-sql', {sql: sql}, {
                headers: {
                    'Authorization': 'Bearer ' + token.response[0].value
                }
            })
            users.push(data.data)
        }
        const push_text = document.getElementById('push_text').value;
        for (const user of users) {
            let ids = '';
            user.forEach((item) => {
                ids = ids + item['vkId'] + ','
            });
            ids = ids.slice(0, -1);
            bridge.send('VKWebAppCallAPIMethod', {
                "method": 'notifications.sendMessage',
                "params": {
                    'user_ids': ids,
                    'access_token': Constants.SERVICE_TOKEN,
                    'message': push_text,
                    'v': '5.131'
                }
            }).then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error)
            })
        }

    }

    async function saveSettings() {
        const token = await bridge.send('VKWebAppCallAPIMethod', {
            method: 'storage.get', params: {
                'key': 'jwtToken',
                'access_token': Constants.SERVICE_TOKEN,
                'user_id': user.vkId,
                'v': '5.126'
            }
        });
        const image_url = document.getElementById('image_url').value;
        const title = document.getElementById('title').value;
        const button_text = document.getElementById('button_text').value;
        const button_url = document.getElementById('button_url').value;

        let sql = `UPDATE app_entity
         SET image_url = '${image_url}',button_text = '${button_text}',button_url = '${button_url}',title = '${title}'`;
        const data = await axios.post(Constants.SERVER + 'exec-sql', {sql: sql}, {
            headers: {
                'Authorization': 'Bearer ' + token.response[0].value
            }
        });
    }

}

export default Profile;