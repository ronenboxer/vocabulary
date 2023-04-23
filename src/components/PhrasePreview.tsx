import { StyleSheet, Text, TouchableHighlight, View } from "react-native"
import { Phrase } from "../interfaces/vocabulary"
import { Rate } from "./Rate"

import { utilService } from '../services/util.service'
import { RouterProps } from "../interfaces/router"

export const PhrasePreview = ({ phrase, routerProps: { navigation, route } }: { phrase: Phrase, routerProps: RouterProps }) => {

    const rate = Array(5).fill(false).map((_, idx) => ((idx <= (phrase.rate || 0)) || false))
    return (
        <TouchableHighlight style={{ width: '100%' }} onPress={() => navigation.navigate('PhraseDetails', { phraseId: phrase.id! })}>
            <View style={styles.phrase}>
                <Text style={styles.text}>
                    {phrase.txt}

                </Text>
                <View style={styles.rate}>
                    {rate.map((star, idx) => (
                        <Rate isFilled={star} idx={idx} key={utilService.makeId()} />
                    ))}
                </View>
            </View>
        </TouchableHighlight>
    )
}
const styles = StyleSheet.create({
    phrase: {
        textAlign: 'right',
        width: '100%',
        height: 30,
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        paddingHorizontal: 10
    },
    rate: {
        flexDirection: 'row'
    },
    text: {
        overflow: 'scroll'
    }
})