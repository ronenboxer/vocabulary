import { useEffect, useRef, useState } from "react"
import { View, Text, FlatList, Button, StyleSheet, TextInput, Alert, TouchableHighlight } from "react-native"
import { Path, Svg } from "react-native-svg"
import { PhraseMeaning } from "../components/PhraseMeaning"
import { PhraseTitle } from "../components/PhraseTitle"
import { Rate } from "../components/Rate"
import { useAppSelector, useAppDispatch } from "../hooks/hooks"
import { RouterProps } from "../interfaces/router"
import { Phrase } from "../interfaces/vocabulary"
import { savePhrase } from "../redux/vocabulary/actions"
import { utilService } from "../services/util.service"

export const PhraseDetails = ({ navigation, route }: RouterProps) => {
    const dispatch = useAppDispatch()

    const editedText = useRef<null | string>(null)
    const inputRef = useRef('פירוש נוסף')
    const [editedIdx, setEditedIdx] = useState(-2)
    const vocabulary = (useAppSelector(state => state.vocabularyModule.vocabulary) || []) as Phrase[]
    const [phraseIdx, setPhraseIdx] = useState(vocabulary.findIndex(phrase => phrase.id === route.params.phraseId))
    const [phrase, setPhrase] = useState(phraseIdx !== -1
        ? { ...vocabulary[phraseIdx] }
        : null)
    let rate = Array(5).fill(false).map((_, idx) => ((idx <= (phrase?.rate || 0)) || false))

    const goTo = (step: number) => {
        const nextIdx = (phraseIdx + step + vocabulary.length) % vocabulary.length
        setPhraseIdx(nextIdx)
        setPhrase(vocabulary[nextIdx])
        setEditedIdx(-2)
        inputRef.current = 'פירוש נוסף'
        navigation.setParams({ phraseId: vocabulary[nextIdx].id! })
    }

    const addMeaning = () => {
        const txt = inputRef.current.trim()
        if (!txt || phrase!.meaning.includes(txt)) return
        const meaning = [...phrase!.meaning, txt]
        onSavePhrase('meaning', meaning)
    }

    const updateTitle = (txt: string | null) => {
        if (txt === null || txt.trim() === phrase!.txt.trim()) return
        if (txt) onSavePhrase('txt', txt)
        setEditedIdx(-2)
        editedText.current = null
    }

    const updateMeaning = (txt: string | null, idx: number) => {
        if (txt === null) return
        const meaning = [...phrase!.meaning]
        if (txt) {
            if (txt.trim() !== meaning[idx].trim()) meaning[idx] = txt
            else {
                setEditedIdx(-2)
                editedText.current = null
                return
            }
        } else meaning.splice(idx, 1)
        phrase!.meaning = meaning
        onSavePhrase('meaning', meaning)
        setEditedIdx(-2)
        editedText.current = null
    }

    const deleteMeaning = (index: number) => {
        const meaning = phrase!.meaning.filter((_, idx) => idx !== index)
        onSavePhrase('meaning', meaning)
    }

    const onDeleteMeaning = (idx: number) => Alert.alert('למחוק את הפירוש?', phrase!.meaning[idx], [
        {
            text: 'ביטול',
            style: 'cancel',
        },
        {
            text: 'אישור',
            onPress: () => {
                deleteMeaning(idx)
            }
        },
    ])

    const onSavePhrase = (key: string, value: unknown) => {
        phrase![key as keyof typeof phrase] = value
        setPhrase({ ...phrase! })
        dispatch(savePhrase({ ...phrase! }), phraseIdx)
    }

    return (
        <View>
            {phrase
                ? [<View style={styles.buttonsContainer} key={utilService.makeId(5, 5)}>
                    <Button title={'הקודם'} onPress={() => goTo(-1)} />
                    <Button title={'הבא'} onPress={() => goTo(1)} />
                </View>,
                <PhraseTitle
                    key={utilService.makeId(5, 5)}
                    title={phrase.txt}
                    rate={rate}
                    isOnEdit={!!editedIdx && editedIdx === -1}
                    setEditedIdx={setEditedIdx}
                    savePhrase={onSavePhrase}
                    updateTitle={updateTitle}
                />,
                // <View style={styles.header}>
                //     <TextInput
                //         key={utilService.makeId(5, 5)}
                //         defaultValue={phrase.txt}
                //         onFocus={() => setEditedIdx(-1)}
                //         autoFocus={editedIdx === -1}
                //         onChangeText={txt => editedText.current = (txt)}
                //     />
                //     {editedIdx === -1 ?
                //         <TouchableHighlight key={utilService.makeId(5, 5)} onPress={() => updateTitle(editedText.current)}>
                //             <Svg width="24" height="24" viewBox="0 0 24 24"><Path fill="currentColor" d="m10 16.4l-4-4L7.4 11l2.6 2.6L16.6 7L18 8.4l-8 8Z" /></Svg>
                //         </TouchableHighlight>
                //         : null}
                // </View>,
                // <View key={utilService.makeId(5, 5)}>
                //     <View style={styles.rate}>
                //         {rate.map((star, idx) => (
                //             <Rate isFilled={star} idx={idx} key={utilService.makeId()} savePhrase={onSavePhrase} />
                //         ))}
                //     </View>
                // </View>,
                <PhraseMeaning
                    key={utilService.makeId(5, 5)}
                    meaning={phrase.meaning}
                    onDeleteMeaning={onDeleteMeaning}
                    updateMeaning={updateMeaning}
                    setEditedIdx={setEditedIdx}
                    editedIdx={editedIdx}
                    editedText={editedText}
                    addMeaning={addMeaning}
                    inputRef={inputRef} />
                    // <FlatList
                    //     data={phrase.meaning}
                    //     key={utilService.makeId(5, 5)}
                    //     renderItem={({ item, index }) =>
                    //         <View style={styles.meaningLine} >
                    //             <Button
                    //                 title='-'
                    //                 onPress={() => onDeleteMeaning(index)}
                    //             />
                    //             <TextInput
                    //                 onFocus={() => setEditedIdx(index)}
                    //                 autoFocus={index === editedIdx}
                    //                 onChangeText={txt => editedText.current = (txt)}
                    //                 style={styles.meaning}
                    //                 defaultValue={item} />
                    //             {editedIdx === index ?
                    //                 <TouchableHighlight key={utilService.makeId(5, 5)} onPress={() => updateMeaning(editedText.current, index)}>
                    //                     <Svg width="24" height="24" viewBox="0 0 24 24"><Path fill="currentColor" d="m10 16.4l-4-4L7.4 11l2.6 2.6L16.6 7L18 8.4l-8 8Z" /></Svg>
                    //                 </TouchableHighlight>
                    //                 : null}

                    //         </View>
                    //     }
                    //     keyExtractor={item => item}
                    // />,
                    // <View style={styles.meaningLine} key={utilService.makeId(5, 5)}>
                    //     <Button
                    //         title="+"
                    //         onPress={addMeaning}
                    //     />
                    //     <TextInput
                    //         style={styles.newMeaning}
                    //         defaultValue="פירוש נוסף"
                    //         onChangeText={txt => inputRef.current = txt} />
                    // </View>
                ]
                : <Text>Phrase not found</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    header: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 10
    },
    meaning: {
        marginVertical: 10,
        marginStart: 20,
        textAlign: 'right',
        flex: 1,
    },
    meaningLine: {
        flexDirection: 'row-reverse',
        marginEnd: 10
    },
    newMeaning: {
        textAlign: 'right',
        backgroundColor: '#fff',
        flex: 1,
    },
    rate: {
        flexDirection: 'row'
    },
});