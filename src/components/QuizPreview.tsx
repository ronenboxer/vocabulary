import { useEffect, useRef, useState } from "react"
import { Alert, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { View, Text } from "react-native"
import { useAppDispatch, useAppSelector } from "../hooks/hooks"
import { QuizAnswer } from "../interfaces/games"
import { RouterProps } from "../interfaces/router"
import { Phrase } from "../interfaces/vocabulary"
import { updateGroupVisits, getStudyGroup } from "../redux/game/actions"
import { incrementGuesses } from "../redux/game/actions"
import { utilService } from "../services/util.service"

const NUM_OF_ANSWERS = 4

export const QuizPreview = ({ navigation, route }: RouterProps) => {
    const dispatch = useAppDispatch()

    const phrasesToIncrement = useRef([] as Phrase[])
    const currGroup = useAppSelector(state => state.gameModule.currGroup) as Phrase[]
    const quizAnswers = useAppSelector(state => state.gameModule.quizAnswers) as { [id: string]: QuizAnswer }
    const [quizIdx, setQuizIdx] = useState(0)
    const [visitedAnswers, setVisitedAnswers] = useState(Array(NUM_OF_ANSWERS).fill(false))
    const [isNextQuestion, setIsNextQuestion] = useState(false)

    let correctAnswerIdx = -1

    const checkAnswer = (index: number) => {
        if (visitedAnswers[correctAnswerIdx]) return
        if (index === correctAnswerIdx) {
            if (!visitedAnswers.includes(true)) phrasesToIncrement.current.push(currGroup[quizIdx])
            if (quizIdx < currGroup.length - 1) setIsNextQuestion(true)
            else onGameOver()
        }
        setVisitedAnswers(prevVisitedAnswers => {
            prevVisitedAnswers.splice(index, 1, true)
            return [...prevVisitedAnswers]
        })
    }

    const nextQuestion = (idx?: number) => {
        setQuizIdx(prevIdx => (idx ? idx : ++prevIdx + currGroup.length) % currGroup.length)
        setVisitedAnswers(Array(NUM_OF_ANSWERS).fill(false))
        setIsNextQuestion(false)
    }

    const onGameOver = () =>
        Alert.alert('כל הכבוד!', 'לאן עכשיו?', [
            {
                text: 'דף הבית',
                onPress: () => {
                    navigation.navigate('HomePage')
                    dispatch(updateGroupVisits())
                    dispatch(getStudyGroup())
                    nextQuestion(0)
                    dispatch(incrementGuesses([...phrasesToIncrement.current]))
                },
                style: 'cancel',
            },
            {
                text: 'יחידה הבאה', onPress: () => {
                    dispatch(updateGroupVisits())
                    dispatch(getStudyGroup())
                    nextQuestion(0)
                    dispatch(incrementGuesses([...phrasesToIncrement.current]))
                    phrasesToIncrement.current = []
                }
            },
            {
                text: 'נסיון נוסף', onPress: () => {
                    // dispatch(updateGroupVisits())
                    // dispatch(incrementGuesses([...phrasesToIncrement.current]))
                    nextQuestion(0)
                    phrasesToIncrement.current = []
                }
            },
        ]);

        useEffect(()=>{

        },[quizIdx])

    const renderAnswers = ({ item: meanings, index }: { item: string[], index: number }) => {
        correctAnswerIdx = quizAnswers[currGroup[quizIdx].id as string].correctAnswerIdx
        return (
            <TouchableOpacity style={styles.answerContainer} onPress={() => checkAnswer(index)}>
                <FlatList
                    key={utilService.makeId(5, 5)}

                    data={meanings}
                    renderItem={({ item }) => {
                        return (
                            <Text style={{
                                ...styles.answerText,
                                color: (visitedAnswers[index] ? (index === correctAnswerIdx ? 'green' : 'red') : '#000')
                            }}>{item}</Text>
                        )
                    }}
                />
            </TouchableOpacity>
        )
    }

    return (
        <View>
            {currGroup?.length && quizAnswers
                ? [
                    <Text style={styles.header} key={utilService.makeId(5, 5)}>{currGroup[quizIdx].txt}</Text>,
                    <FlatList
                        key={utilService.makeId(5, 5)}
                        data={quizAnswers[currGroup[quizIdx].id as string].meanings}
                        renderItem={renderAnswers}
                    />
                ]
                : null
            }
            {isNextQuestion ? <Button title="מונח הבא" onPress={() => nextQuestion()} /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        textAlign: 'right',
        fontSize: 20,
    },
    answerText: {
        textAlign: 'right',
    },
    answerContainer: {
        paddingVertical: 10,
    }
})