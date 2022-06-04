import React from 'react';
import {Button, Div, Text} from "@vkontakte/vkui";
import '../styles/Card.css'
import Icon28LockOutline from "@vkontakte/icons/dist/28/lock_outline";

export const ChallengeCard = ({id, name, phraseCount, onClick, isOpened}) => (
    <Div>
        <div className={"Card d-flex flex-row align-items-center"}>
            <div className={"ImgBox"}>
                <img src={'/categories/' + name + '.png'}/>
            </div>
            <div className={'TextBox'}>
                <Text weight={'semibold'}>{name}</Text>
                <Text weight={'regular'}>Заданий: {phraseCount}</Text>
            </div>

            <div className={'ButtonBox'}>
                {isOpened ?
                    <Button size={'m'}
                            onClick={onClick}
                            data-category-id={id}
                            data-category-name={name}
                            data-to={'challengeGame'}
                    >Испытание</Button>
                    :
                    <Icon28LockOutline/>
                }
            </div>
        </div>
    </Div>
);