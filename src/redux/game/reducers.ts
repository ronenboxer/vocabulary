import { CardListItem, QuizAnswer } from "../../interfaces/games";
import { Phrase } from "../../interfaces/vocabulary"

const initialState = {
    currGroup: [] as Phrase[],
    cardList: [] as CardListItem[],
    quizAnswers: {} as { [id: string]: QuizAnswer },
    pageIdx: 0,
    totalPages: 0,
    sortKey: 'random'
}

interface Action {
    type: string,
    currGroup: Phrase[],
    pageIdx: number,
    totalPages: number,
    sortKey: string,
    quizAnswers: { [id: string]: QuizAnswer },
}

const game = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'SET_GROUP':
            const cardList = [
                ...action.currGroup.map(phrase => {
                    return {
                        phrase: { ...phrase },
                        id: phrase.id + '_phrase'
                    }
                }),
                ...action.currGroup.map(phrase => {
                    return {
                        phrase: { ...phrase },
                        id: phrase.id + '_meaning'
                    }
                })
            ]
            cardList.sort((a, b) => Math.random() - .5)
            return { ...state, currGroup: action.currGroup, cardList, quizAnswers: action.quizAnswers }
        case 'SET_PAGE_IDX':
            return { ...state, pageIdx: action.pageIdx }
        case 'SET_TOTAL_PAGES':
            return { ...state, totalPages: action.totalPages }
        case 'SET_SORT_KEY':
            return { ...state, sortKey: action.sortKey }
        default:
            return state
    }
}

export default game