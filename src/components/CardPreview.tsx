import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Phrase } from "../interfaces/vocabulary";


interface CardProps {
    card: {
        phrase: Phrase;
        id: string;
    },
    isMatched: boolean;
    isFlipped: boolean;
    color: string;
    flipCard: (id: string) => void
}

export const CardPreview = ({ card, isFlipped, isMatched, color, flipCard }: CardProps) => {
    const [id, type] = card.id.split('_')


    return (
        <TouchableOpacity style={{ ...styles.card, borderWidth: (isMatched ? 4 : 0), borderColor: color }} onPress={() => flipCard(card.id)}>
            {isFlipped || isMatched
                ? <>{type === 'phrase'
                    ? <Text style={styles.alignRight}>{card.phrase.txt}</Text>
                    : <FlatList
                        data={card.phrase.meaning}
                        renderItem={({ item }) => <Text style={styles.alignRight}>{item}</Text>}
                    />}</>
                : <Image style={styles.img} source={require('../../assets/imgs/card2.jpeg')} />}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        margin: '1.66%',
        overflow: 'hidden',
        borderRadius: 12,
        borderStyle: 'solid',
        borderWidth: 0

    },
    alignRight: {
        textAlign: 'right'
    },
    img: {
        width: '100%',
        height: '100%',
    }
})