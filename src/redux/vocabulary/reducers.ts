import { Filter, Phrase, Sort } from "../../interfaces/vocabulary"

const MAX_RATE = 4

const initialState = {
    vocabulary: [] as Phrase[],
    formattedVocabulary: [] as Phrase[][],
    titles: [] as string[],
    sections: [] as { title: string, data: Phrase[] }[],
    sort: { primaryKey: 'txt', primaryOrderMultiplier: 1, secondaryKey: 'rate', secondaryOrderMultiplier: 1 } as Sort,
    filter: { txt: '', rate: MAX_RATE } as Filter
}

interface Action {
    type: string,
    vocabulary: Phrase[],
    sort: Sort,
    filter: Filter
}

const vocabulary = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'SET_VOCABULARY':
            const sections = [] as { title: string, data: Phrase[] }[]
            const vocabulary = action.vocabulary
            for (let i = 0; i < vocabulary.length; i++) {
                const title = state.sort.primaryKey === 'txt'
                    ? vocabulary[i].txt.charAt(0)
                    : ((vocabulary[i].rate || 0) + 1).toString()

                const j = vocabulary.findLastIndex(phrase => (state.sort.primaryKey === 'txt'
                    ? phrase.txt.charAt(0) === vocabulary[i].txt.charAt(0)
                    : (phrase.rate || 0) === (vocabulary[i].rate || 0)))

                const data = vocabulary.slice(i, j + 1)

                sections.push({ title, data })
                i = j
            }
            return { ...state, vocabulary, sections }
        case 'SET_FILTER':
            return { ...state, filter: action.filter }
        case 'SET_SORT':
            return { ...state, sort: action.sort }
        default:
            return state
    }
}

export default vocabulary