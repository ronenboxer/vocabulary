import { Phrase } from "../interfaces/vocabulary"
import { utilService } from "./util.service"
import { vocabularyService } from "./vocabulary.service"

const GROUP_SIZE = 9
const ANSWER_COUNT = 4

let gVocabulary: Phrase[]
loadVocabulary()

async function loadVocabulary() {
    gVocabulary = await _getVocabulary() as Phrase[]
    return gVocabulary
}

async function getVocabularyGroupByKey(key = 'random', pagination?: { idx: number }) {
    const vocabulary = [...(gVocabulary || await loadVocabulary())]
    vocabulary.sort((a, b) => sortVocabularyByKey(a, b, key))
    const totalPages = getPageCount()
    if (pagination && pagination.idx < totalPages)
        return vocabulary.slice(pagination.idx * 10, (pagination.idx + 1) * GROUP_SIZE)
    const groups = []
    for (let i = 0; i < totalPages; i++) {
        groups.push([...vocabulary.slice(i, i === totalPages - 1 ? vocabulary.length : i + 10)])
    }
    return groups
}

function getQuizAnswers(group: Phrase[]) {
    const answers = {} as { [id: string]: { correctAnswerIdx: number, meanings: string[][] } }
    for (let phrase of group) {
        const meanings = [] as string[][]
        for (let i = 0; i < ANSWER_COUNT - 1; i++) {
            const idx = utilService.getRandomInt(gVocabulary.length)
            if (meanings.some(meaning => vocabularyService.compareMeanings(meaning,gVocabulary[idx].meaning))) console.log(i--)
            else meanings.push(gVocabulary[idx].meaning)
        }
        meanings.sort((a, b) => Math.random() - .5)
        const idx = utilService.getRandomInt(ANSWER_COUNT)
        meanings.splice(idx, 0, phrase.meaning)
        answers[phrase.id as string] = {
            correctAnswerIdx: idx,
            meanings
        }
    }
    return answers
}

function getPageCount() {
    return Math.ceil((gVocabulary?.length || 0) / GROUP_SIZE)
}

function sortVocabularyByKey(phrase1: Phrase, phrase2: Phrase, key: string) {
    if ((phrase1.visits || 0) === (phrase2.visits || 0)) {
        switch (key) {
            case 'rate':
                return (phrase1.rate || 0) - (phrase2.rate || 0)
            case 'txt':
                return phrase1.txt.localeCompare(phrase2.txt)
            default:
                return utilService.getRandomInt(1, -1, true)
        }
    }
    return (phrase1.visits || 0) - (phrase2.visits || 0)
}

async function _getVocabulary() {
    return [
        ...await utilService.getFromStorage(vocabularyService.VOCABULARY_TYPES.word),
        ...await utilService.getFromStorage(vocabularyService.VOCABULARY_TYPES.idiom)
    ]
}

function incrementVisits(group: Phrase[]) {
    const updatedGroup = group.map(phrase => {
        const phraseToSave = { ...phrase, visits: (phrase.visits || 0) + 1 }
        const idx = gVocabulary.findIndex(_ => _.id === phrase.id)
        if (idx !== -1) gVocabulary[idx] = phraseToSave
        return phraseToSave as Phrase
    })
    vocabularyService.savePhrases(updatedGroup)
    return updatedGroup
}

export const gameService = {
    getVocabularyGroupByKey,
    getQuizAnswers,
    incrementVisits,
    getPageCount
}