import React from 'react';
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    SectionList,
    TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { RouterProps } from '../interfaces/router';
import { setFilter, setFilteredVocabulary } from '../redux/vocabulary/actions';

import { Filter, Sort } from '../interfaces/vocabulary';
import { utilService } from '../services/util.service';
import { Phrase } from "../interfaces/vocabulary"
import { PhrasePreview } from "./PhrasePreview"

const MAX_RATE = 4

export const PhraseList = ({ navigation, route }: RouterProps) => {
    const vocabularySections = useAppSelector(state => state.vocabularyModule.sections) as { title: string, data: Phrase[] }[]
    const { filter, sort }: { filter: Filter, sort: Sort } = useAppSelector(state => state.vocabularyModule)
    const dispatch = useAppDispatch()

    const renderPhrase = ({ item }: { item: Phrase }) => {
        return (
            <PhrasePreview phrase={item} routerProps={{ navigation, route }} />
        )
    }
    return (
        <View style={styles.list}>

            <View>
                <TextInput defaultValue={filter.txt || 'חיפוש'}
                    onChangeText={txt => {
                        dispatch(setFilter({ ...filter, txt }))
                        utilService.debounce(() => dispatch(setFilteredVocabulary()), 400)()
                    }}
                />
                <TextInput inputMode='numeric'
                    defaultValue={filter.rate + ''}
                    onChangeText={rate => {
                        let formattedRate = isNaN(parseInt(rate))
                            ? MAX_RATE
                            : parseInt(rate)
                        if (formattedRate < 1) formattedRate = 1
                        if (formattedRate > MAX_RATE + 1) formattedRate = MAX_RATE + 1
                        dispatch(setFilter({ ...filter, rate: formattedRate - 1 }))
                        utilService.debounce(() => dispatch(setFilteredVocabulary()), 400)()
                    }}
                />
            </View>
            <SectionList
                sections={vocabularySections}
                renderItem={renderPhrase}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
                keyExtractor={item => item.id!}
                getItemLayout={(data, index) => ({
                    length: 30,
                    offset: 30 * index,
                    index,
                })}
                windowSize={10}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        flex: 1,
        boxSizing: 'border-box',
    },
    phrase: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    sectionHeader: {
        textAlign: 'right',
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#ccc',
    },
})