import React from 'react';
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
} from 'react-native';
import { CardList } from '../components/CardList';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { RouterProps } from '../interfaces/router';

import { Phrase } from "../interfaces/vocabulary"
import { getStudyGroup, setPageIdx } from '../redux/game/actions';

export const MemoryGame = ({navigation,route}:RouterProps) => {
    const dispatch = useAppDispatch()
    dispatch(setPageIdx(0))
    dispatch(getStudyGroup())
    return (
        <CardList navigation={navigation} route={route} />
    )
}

const styles = StyleSheet.create({
    list: {
        // direction: 'rtl'
    }
})