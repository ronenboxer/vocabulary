import { Filter, Phrase, Sort } from "../../interfaces/vocabulary";
import { vocabularyService } from "../../services/vocabulary.service";

const GUESSES_TO_RATE_UP = 3

export function setFilteredVocabulary() {
  return async (dispatch: Function, getState: Function) => {
    try {
      const { sort, filter }: { sort: Sort, filter: Filter } = getState().vocabularyModule
      const vocabulary = await vocabularyService.getFilteredVocabulary(filter, sort)
      dispatch({ type: 'SET_VOCABULARY', vocabulary })
    } catch (err) {
      console.log('err:', err)
    }
  }
}

export function savePhrase(phrase: Phrase, idx?: number) {
  return (dispatch: Function, getState: Function) => {
    try {
      const vocabulary = getState().vocabularyModule.vocabulary as Phrase[]
      const index = idx !== undefined
        ? idx
        : vocabulary.findIndex(p => p.id === phrase.id)
        if (index === -1) return console.log('Cannot find phrase in store')
        vocabulary.splice(index, 1, phrase)
        dispatch({ type: 'SET_VOCABULARY', vocabulary })
        vocabularyService.savePhrases([phrase])
      } catch (err) {
        console.log('Error saving phrase to database')
      }
    }
  }

export function setSort(sort:Sort){
  return (dispatch:Function)=>{
    dispatch({type: 'SET_SORT',sort})
  }
}

export function setFilter(filter:Filter){
  return (dispatch:Function)=>{
    dispatch({type:'SET_FILTER', filter})
  }
}