import React from 'react';
import {CellButton, Div, Group, Text, Title} from "@vkontakte/vkui";
import "../styles/GamePopout.css"
import Button from "@vkontakte/vkui/dist/components/Button/Button";

export const GameDonePopout = ({guessCount, totalCount, close}) => {
    return (
        <Div className={'PopCard'}>
            <Group mode={'plain'}>
                <Title weight={'semibold'} className={'PopText'}> Тестирование завершено! </Title>
                <Text className={'PopText'} weight={'semibold'}>Вы ответили правильно на {guessCount} из {totalCount} заданий</Text>
            </Group>
            <Group>
                <Button mode={'tertiary'} onClick={close}>
                    <Text style={{color: '#71aaeb'}}>Продолжить</Text>
                </Button>
            </Group>
        </Div>
    )
};