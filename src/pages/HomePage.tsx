import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { PhraseList } from '../components/PhraseList';
import { setFilteredVocabulary } from '../redux/vocabulary/actions';
import { RouterProps } from '../interfaces/router';


export const HomePage = ({ navigation, route }: RouterProps) => {
    const dispatch = useAppDispatch()
    dispatch(setFilteredVocabulary())


    return (
        <View style={styles.container}>
            <Button title="משחק זכרון" onPress={()=>navigation.navigate('MemoryGame')}/>
            <Button title="שאלות אמריקאיות" onPress={()=>navigation.navigate('QuizPage')}/>
            <PhraseList navigation={navigation} route={route} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        width: '100%'
    },
});