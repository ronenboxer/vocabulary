import { StyleSheet } from "react-native"
import { Button, FlatList, TextInput, TouchableHighlight, View } from "react-native"
import Svg, { Path } from "react-native-svg"
import { utilService } from "../services/util.service"

interface PhraseMeaningProps {
    meaning: string[],
    onDeleteMeaning: (idx: number) => void,
    updateMeaning: (txt: string | null, idx: number) => void,
    setEditedIdx: Function,
    editedIdx: number,
    editedText: React.MutableRefObject<string | null>
    addMeaning: () => void,
    inputRef: React.MutableRefObject<string>
}

export const PhraseMeaning = ({ meaning, onDeleteMeaning, updateMeaning, setEditedIdx, editedIdx, editedText, addMeaning, inputRef }: PhraseMeaningProps) => {
    return (
        <>
            <FlatList
                data={meaning}
                renderItem={({ item, index }) =>
                    <View style={styles.meaningLine} >
                        <Button
                            title='-'
                            onPress={() => onDeleteMeaning(index)}
                        />
                        <TextInput
                            onFocus={() => setEditedIdx(index)}
                            autoFocus={index === editedIdx}
                            onChangeText={txt => editedText.current = (txt)}
                            style={styles.meaning}
                            defaultValue={item} />
                        {editedIdx === index ?
                            <TouchableHighlight key={utilService.makeId(5, 5)} onPress={() => updateMeaning(editedText.current, index)}>
                                <Svg width="24" height="24" viewBox="0 0 24 24"><Path fill="currentColor" d="m10 16.4l-4-4L7.4 11l2.6 2.6L16.6 7L18 8.4l-8 8Z" /></Svg>
                            </TouchableHighlight>
                            : null}

                    </View>
                }
                keyExtractor={item => item}
            />
            <View style={styles.meaningLine}>
                <Button
                    title="+"
                    onPress={addMeaning}
                />
                <TextInput
                    style={styles.newMeaning}
                    defaultValue="פירוש נוסף"
                    onChangeText={txt => inputRef.current = txt} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
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
});