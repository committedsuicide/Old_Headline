import React from 'react'
import {Button, Div, Link, Panel, PanelHeader, Text} from "@vkontakte/vkui";
export const Lessons = ({id}) => (
    <Panel id={id}>
        <PanelHeader
        >
            Бесплатные уроки
        </PanelHeader>
        <Div style={{textAlign: 'center', marginTop: '30px' }}>
            <Text weight={'semibold'}>Наша школа проводит
                бесплатные онлайн-уроки по корейскому языку для всех желающих,
                чтобы записаться на занятие жми на кнопку!
            </Text>
            <Button style={{marginTop: '30px'}}
                href='https://vk.com/app5898182_-186069391#s=1151638' target={'_blank'}>
                    Бесплатные уроки
            </Button>
        </Div>
        <Div style={{textAlign: 'center', marginTop: '30px' }}>
            <Text weight={'semibold'}>Хотите смотреть дорамы в оригинале и слушать любимых k-pop исполнителей?
                Записывайтесь на наш онлайн-курс по корейскому языку!
            </Text>
            <Button style={{marginTop: '30px'}}
                    href='https://vk.com/app5898182_-172886598#s=1298469' target={'_blank'}>
                Узнать подробнее
            </Button>
        </Div>
    </Panel>
)