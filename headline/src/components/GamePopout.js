import React from 'react';
import {CellButton, Div, Group, Text, Title} from "@vkontakte/vkui";
import "../styles/GamePopout.css"
import Button from "@vkontakte/vkui/dist/components/Button/Button";

export const GamePopout = ({phrase, close, type}) => {
    switch (type) {
        case 1: {
            return (
                <Div className={'PopCard'}>
                    <Group mode={'plain'}>
                        <Title weight={'bold'} className={'PopText'}> Неправильно! </Title>
                        <Text className={'PopText'} weight={'semibold'}>{phrase.phrase}</Text>
                        <Text className={'PopText'} weight={'semibold'}>Это означает "{phrase.translation}"</Text>
                    </Group>
                    <Group>
                        <Button mode={'tertiary'} onClick={close}>
                            <Text style={{color: '#71aaeb'}}>Продолжить</Text>
                        </Button>
                    </Group>
                </Div>
            )
            break;
        }
        case 2: {
            return (
                <Div className={'PopCard'}>
                    <Group mode={'plain'}>
                        <Title weight={'bold'} className={'PopText'}> Неправильно! </Title>
                        <Text className={'PopText'} weight={'semibold'}>{phrase.translation}</Text>
                        <Text className={'PopText'} weight={'semibold'}>По-корейски будет "{phrase.phrase}"</Text>
                    </Group>
                    <Group>
                        <Button mode={'tertiary'} onClick={close}>
                            <Text style={{color: '#71aaeb'}}>Продолжить</Text>
                        </Button>
                    </Group>
                </Div>
            )
            break;
        }
    }

};