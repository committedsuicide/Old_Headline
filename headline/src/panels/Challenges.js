import {Panel, PanelHeader, Text} from "@vkontakte/vkui";
import React, { useEffect, useState} from "react";
import {ChallengeCard} from "../components/ChallengeCard";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import Order from "../Order";

export const Challenges = ({id, categories, availableCategories, onCardButtonClick}) => {
    const [isLoaded, setLoaded] = useState(true);
    if (isLoaded) {return (
        <Panel id={id}>
            <PanelHeader
            >
                Тестирование
            </PanelHeader>
            {
                categories

                    .sort((a,b) => {
                    let firstEl = availableCategories.find((availableCategory) => availableCategory.id == a.id);
                    let secondEl = availableCategories.find((availableCategory) => availableCategory.id == b.id);
                    if (firstEl && secondEl) return 0;
                    if (firstEl) return -1;
                    return 1;
                }).map((category) => {
                    return (
                        <ChallengeCard  id={category.id}
                                        name={category.categoryName}
                                        phraseCount={category.count}
                                        onClick={onCardButtonClick}
                                        isOpened={availableCategories.find((availableCategory) => availableCategory.id == category.id)}
                                        key={category.id}
                        />
                    )
                })}
        </Panel>
    )}
    else {
        return (
            <Panel id={id} centered>
                <PanelHeader
                >
                   Испытания
                </PanelHeader>
                <Div style={{textAlign: 'center'}}>
                    <Text weight={'semibold'}>Ой! Кажется, сервер недоступен =(</Text>
                </Div>
            </Panel>
        )
    }
};
function checkOrder(firstCat, secCat){
    let firstEl = Order.find((el) => el.name === firstCat.categoryName);
    let secondEl = Order.find((el) => el.name === secCat.categoryName);
    if (firstEl?.priority > secondEl?.priority){
        return -1;
    }
    return 1;
}