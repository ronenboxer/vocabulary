import { Dispatch } from "redux";
import { Phrase } from "../../interfaces/vocabulary";
import { gameService } from "../../services/game.service";
import { vocabularyService } from "../../services/vocabulary.service";

const GUESSES_TO_RATE_UP = 3

export function getStudyGroup() {
    return async (dispatch: Dispatch, getState: Function) => {
        try {
            const { pageIdx: idx, sortKey }: { pageIdx: number, sortKey: string, } = getState().gameModule
            const currGroup = await gameService.getVocabularyGroupByKey(sortKey, { idx: 0 }) as Phrase[]
            const quizAnswers = gameService.getQuizAnswers(currGroup)
            dispatch({ type: 'SET_GROUP', currGroup, quizAnswers })
        } catch (err) {
            console.log('err:', err)
        }
    }
}

export function setPageIdx(pageIdx: number) {
    return (dispatch: Dispatch) => {
        dispatch({ type: 'SET_PAGE_IDX', pageIdx })
    }
}

export function setTotalPages() {
    return (dispatch: Dispatch) => {
        const totalPages = gameService.getPageCount()
        dispatch({ type: 'SET_TOTAL_PAGES', totalPages })
    }
}

export function updateGroupVisits() {
    return (dispatch: Dispatch, useState: Function) => {
        let { currGroup }: { currGroup: Phrase[] } = (useState().gameModule)
        let vocabulary = [...useState().vocabularyModule.vocabulary] as Phrase[]
        currGroup = gameService.incrementVisits(currGroup)
        currGroup.forEach(phrase => {
            const idx = vocabulary.findIndex(p => p.id === phrase.id)
            if (idx === -1) return
            vocabulary.splice(idx, 1, phrase)
        })
        dispatch({ type: 'SET_GROUP', currGroup })
        dispatch({ type: 'SET_VOCABULARY', vocabulary })
    }
}


export function incrementGuesses(phrases: Phrase[]) {
    return (dispatch: Function, getState: Function) => {
        try {
            const vocabulary = getState().vocabularyModule.vocabulary as Phrase[]
            phrases.forEach(phrase => {
                phrase.correctGuesses = ((phrase.correctGuesses || 0) + 1)
                phrase.rate = Math.floor(phrase.correctGuesses / GUESSES_TO_RATE_UP)
                if (phrase.rate > 4) phrase.rate = 4
                const idx = vocabulary.findIndex(p => p.id === phrase.id)
                if (idx === -1) return console.log('Cannot find phrase in store')
                vocabulary.splice(idx, 1, phrase)
            })
            dispatch({ type: 'SET_VOCABULARY', vocabulary })
            vocabularyService.savePhrases(phrases)
        } catch (err) {
            console.log('Error saving phrase to database')
        }
    }
}