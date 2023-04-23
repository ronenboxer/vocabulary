import type { NativeStackScreenProps } from '@react-navigation/native-stack'

type RootStackParamList = {
    HomePage: undefined;
    MemoryGame: undefined;
    QuizPage: undefined;
    PhraseDetails: {
        phraseId: string
    }
}

export type RouterProps = NativeStackScreenProps<RootStackParamList, 'PhraseDetails'>