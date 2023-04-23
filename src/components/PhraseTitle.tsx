import { useRef } from "react"
import { StyleSheet, TextInput, TouchableHighlight, View } from "react-native"
import { Path, Svg } from "react-native-svg"
import { utilService } from "../services/util.service"
import { Rate } from "./Rate"

interface PhraseTitleProps {
    isOnEdit: boolean,
    setEditedIdx: Function,
    updateTitle: (txt: string | null) => void,
    title: string,
    rate: boolean[],
    savePhrase: (key: string, value: unknown) => void
}

export const PhraseTitle = ({ title, rate, isOnEdit, setEditedIdx, updateTitle, savePhrase }: PhraseTitleProps) => {

    const editedText = useRef<null | string>(null)
    return (
        <View>
            <View style={styles.header}>
                <TextInput
                    style={styles.title}
                    defaultValue={title}
                    onFocus={() => setEditedIdx(-1)}
                    autoFocus={isOnEdit}
                    onChangeText={txt => editedText.current = (txt)}
                />
                {isOnEdit ?
                    <TouchableHighlight onPress={() => updateTitle(editedText.current)}>
                        <Svg width="24" height="24" viewBox="0 0 24 24"><Path fill="currentColor" d="m10 16.4l-4-4L7.4 11l2.6 2.6L16.6 7L18 8.4l-8 8Z" /></Svg>
                    </TouchableHighlight>
                    : null}
            </View>

            <View>
                <View style={styles.rate}>
                    {rate.map((star, idx) => (
                        <Rate isFilled={star} idx={idx} key={utilService.makeId()} savePhrase={savePhrase} />
                    ))}
                </View>
            </View>
        </View>)
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 10
    },
    rate: {
        flexDirection: 'row',
        justifyContent:'center'
    },
})