import React from 'react';
import {CellButton, Div, Group, Text, Title} from "@vkontakte/vkui";
import "../styles/GamePopout.css"
import Button from "@vkontakte/vkui/dist/components/Button/Button";

export const RightAnswerPopout = ({phrase, close}) => {
    return (
        <Div className={'PopCard'}>
            <Group mode={'plain'}>
                <Title weight={'bold'} className={'PopText'}> Правильно! </Title>
            </Group>
            <Group >
                <Button mode={'tertiary'} onClick={close}>
                    <Text style={{color: '#71aaeb'}}>Продолжить</Text>
                </Button>
            </Group>
        </Div>
    )
};