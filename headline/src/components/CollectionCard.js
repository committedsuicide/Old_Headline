import React from 'react';
import {Button, Div, Text} from "@vkontakte/vkui";
import '../styles/Card.css'
import Icon28LockOutline from '@vkontakte/icons/dist/28/lock_outline';

export const CollectionCard = ({id, name, phraseCount, onClick, isOpened}) => {

    return (
        <Div>
            <div className={"Card d-flex flex-row align-items-center"}>
                <div className={"ImgBox"}>
                    <img id={id} src={'/categories/' + name + '.png'}/>
                </div>
                <div className={'TextBox'}>
                    <Text weight={'semibold'}>{name}</Text>
                    <Text weight={'regular'}>Слов: {phraseCount}</Text>
                </div>
                <div className={'ButtonBox'}>
                    {isOpened ?
                        <Button size={'m'}
                                onClick={onClick}
                                data-category-id={id}
                                data-category-name={name}
                                data-to={'phrases'}
                        >Учить</Button>
                        :
                        <Icon28LockOutline/>
                    }
                </div>
            </div>
        </Div>
    )
};
function loadImg(img) {
    console.log(img)
    if(img){
        img.src = '/dni_nedeli.png';
    }

}