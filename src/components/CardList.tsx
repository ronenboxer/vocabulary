import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
    Alert,
} from 'react-native';

import { useAppSelector, useAppDispatch } from '../hooks/hooks';

import { Phrase } from "../interfaces/vocabulary"
import { CardPreview } from './CardPreview';
import { PhrasePreview } from "./PhrasePreview"
import { updateGroupVisits, getStudyGroup } from '../redux/game/actions'
import { RouterProps } from '../interfaces/router';
import { CardListItem } from '../interfaces/games';

export const CardList = ({ navigation, route }: RouterProps) => {

    const dispatch = useAppDispatch()
    const matchingColors = ['#be4571', '#a445be', '#4550be', '#45a2be', '#45be8d', '#77be45', '#bebe45', '#be8245', '#be5645']

    const currGroup = useAppSelector(state => state.gameModule.currGroup) as Phrase[]
    const cardList = useAppSelector(state => state.gameModule.cardList) as CardListItem[]

    const [colorPerId, setColorPerId] = useState({} as { [key: string]: string, })
    const [flippedCardsIds, setFlippedCardsIds] = useState([] as string[])
    const [matchedPairIds, setMatchedPairIds] = useState([] as string[])
    const [isProcessing, setIsProcessing] = useState(false)

    const onFlipCard = (id: string) => {
        const phraseId = id.split('_')[0]
        if (isProcessing || flippedCardsIds.includes(id) || matchedPairIds.includes(phraseId)) return
        if (!flippedCardsIds.length) {
            setFlippedCardsIds([id])
            return
        }
        if (flippedCardsIds[0].split('_')[0] === phraseId) {
            if (matchedPairIds.length === cardList.length / 2 - 1) onGameOver()
            setMatchedPairIds(prevIds => [...prevIds, phraseId])
            setFlippedCardsIds([])
        } else {
            setFlippedCardsIds(prevIds => [...prevIds, id])
            setIsProcessing(true)
            setTimeout(() => {
                setFlippedCardsIds([])
                setIsProcessing(false)
            }, 1200)
        }

    }

    const onGameOver = () =>
        Alert.alert('כל הכבוד!', 'מצאת את כל הזוגות', [
            {
                text: 'דף הבית',
                onPress: () => {
                    navigation.navigate('HomePage')
                    dispatch(updateGroupVisits())
                    dispatch(getStudyGroup())
                },
                style: 'cancel',
            },
            { text: 'משחק חדש', onPress: () => {
                dispatch(updateGroupVisits())
                dispatch(getStudyGroup())
            } },
        ]);

    useEffect(() => {
        setColorPerId({})
        currGroup.forEach((phrase, idx) => {
            setColorPerId(prevColorPerId => ({ ...prevColorPerId, [phrase.id!]: matchingColors[idx] }))
        })
        setFlippedCardsIds([])
        setMatchedPairIds([])
        setIsProcessing(false)
    }, [cardList])
    return (
        <View style={styles.list}>
            <FlatList
                data={cardList}
                renderItem={({ item }) => (<CardPreview card={item}
                    isFlipped={flippedCardsIds.includes(item.id)}
                    isMatched={matchedPairIds.includes(item.phrase.id!)}
                    color={colorPerId[item.phrase.id!]}
                    flipCard={onFlipCard} />)}
                keyExtractor={item => item.id!}
                numColumns={3}
            >

            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        boxSizing: 'border-box',
        paddingHorizontal: 10
    }
})