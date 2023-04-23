
import gWords from '../data/words.json'
import gIdioms from '../data/idioms.json'
import { Filter, Phrase, Sort } from '../interfaces/vocabulary'
import { utilService } from './util.service'


const MAX_RATE = 4
const WORDS_STORAGE_KEY = 'wordDB'
const IDIOMS_STORAGE_KEY = 'idiomDB'
const VOCABULARY_TYPES = {
    word: WORDS_STORAGE_KEY,
    idiom: IDIOMS_STORAGE_KEY
}

const defaultVocabulary = {
    word: gWords,
    idiom: gIdioms
}

const gVocabulary: { [key: string]: Phrase[] } = {}

// getFilteredVocabulary({ txt: '', rate: MAX_RATE }, { primaryKey: 'rate', primaryOrderMultiplier: 1, secondaryKey: 'txt', secondaryOrderMultiplier: 1 })

async function getFilteredVocabulary(filter: Filter, sort: Sort) {
    if (!gVocabulary.word || !gVocabulary.idiom) {
        gVocabulary.word = await _getVocabulary('word') || defaultVocabulary.word
        gVocabulary.idiom = await _getVocabulary('idiom') || defaultVocabulary.idiom
        _saveVocabulary(gVocabulary.word, 'word')
        _saveVocabulary(gVocabulary.idiom, 'idiom')
    }
    let vocabulary = filter.type
        ? gVocabulary[filter.type as keyof typeof gVocabulary]
        : [...gVocabulary.word, ...gVocabulary.idiom]
    if (!filter.txt && filter.rate == MAX_RATE) return getSortedVocabulary(vocabulary, sort)

    const regex = new RegExp(filter.txt || '', 'ig')
    vocabulary = vocabulary.filter(({ txt, meaning, rate = 0 }) => {
        return ((!filter.txt || (filter.txt && regex.test(JSON.stringify({ txt, meaning }))))
            && rate <= filter.rate)
    })
    return getSortedVocabulary(vocabulary, sort)
}

function getSortedVocabulary(vocabulary: Phrase[], sort: Sort) {
    vocabulary.sort((phrase1, phrase2) => {
        const mainKey = sort.primaryKey
        const phrase1Val = phrase1[mainKey as keyof typeof phrase1]
        const phrase2Val = phrase2[mainKey as keyof typeof phrase2]
        if (phrase1Val! > phrase2Val!) return sort.primaryOrderMultiplier
        if (phrase1Val! < phrase2Val!) return -sort.primaryOrderMultiplier

        const secondaryKey = sort.secondaryKey
        const phrase1PseudoVal = phrase1[secondaryKey as keyof typeof phrase1]
        const phrase2PseudoVal = phrase2[secondaryKey as keyof typeof phrase2]
        if (phrase1PseudoVal! > phrase2PseudoVal!) return sort.secondaryOrderMultiplier
        if (phrase1PseudoVal! < phrase2PseudoVal!) return -sort.secondaryOrderMultiplier

        return 0
    })
    return vocabulary
}

function getPhraseByKey(key: string, value: string) {
    return gVocabulary.word.find(word => word[key as keyof typeof word] === value) ||
        gVocabulary.idiom.find(idiom => idiom[key as keyof typeof idiom] === value) || null
}

function compareMeanings(m1: string[], m2: string[]) {
    if (m1.length !== m2.length) return false
    for (let i = 0; i < m1.length; i++) {
        if (!m2.includes(m1[i])) return false
    }
    return true
}

function deletePhrase(id: string) {
    let idx = gVocabulary.word.findIndex(word => word.id === id)
    if (idx !== -1) {
        const word = gVocabulary.word.splice(idx, 1)[0]
        _saveVocabulary(gVocabulary.word, 'word')
        return word
    }
    idx = gVocabulary.idiom.findIndex(idiom => idiom.id == id)
    if (idx === -1) return null
    const idiom = gVocabulary.idiom.splice(idx, 1)[0]
    _saveVocabulary(gVocabulary.idiom, 'idiom')
    return idiom
}

async function savePhrases(phrases: Phrase[]) {
    const savedPhrase = phrases.map(phrase => {
        let savedPhrase: Phrase
        let type: string
        if (phrase.id) {
            let idx = gVocabulary.word.findIndex(entity => entity.id === phrase.id)
            type = 'word'
            if (idx === -1) {
                idx = gVocabulary.idiom.findIndex(entity => entity.id === phrase.id)
                type = 'idiom'
            }
            if (idx === -1) return null
            savedPhrase = { ...gVocabulary[type][idx], ...phrase }
            if ((type === 'word' && savedPhrase.txt.trim().includes(' ')) ||
                (type === 'idiom' && !savedPhrase.txt.trim().includes(' '))) {
                gVocabulary[type].splice(idx, 1)
                gVocabulary[type === 'word' ? 'idiom' : 'word'].push(savedPhrase)
            } else gVocabulary[type][idx] = savedPhrase
        } else {
            type = phrase.txt.includes(' ')
                ? 'idiom'
                : 'word'
            savedPhrase = { ...phrase, id: utilService.makeId() }
            gVocabulary[type].push(savedPhrase)
        }
        return savedPhrase
    })
    _saveVocabulary(gVocabulary.word, 'word')
    _saveVocabulary(gVocabulary.idiom, 'idiom')
    return savedPhrase
}

async function resetDB(type = '') {
    if (type) return gVocabulary[type as keyof typeof gVocabulary] = await _saveVocabulary(defaultVocabulary[type as keyof typeof defaultVocabulary], type)
    gVocabulary.word = await _saveVocabulary(defaultVocabulary.word, 'word')
    gVocabulary.idiom = await _saveVocabulary(defaultVocabulary.idiom, 'idiom')
}

async function _saveVocabulary(vocabulary: Phrase[], type = 'word'): Promise<Phrase[]> {
    return await utilService.saveToStorage(VOCABULARY_TYPES[type as keyof typeof VOCABULARY_TYPES], vocabulary) as Phrase[]
}

async function _getVocabulary(type = ''): Promise<Phrase[]> {
    if (!type) return [...(await utilService.getFromStorage(VOCABULARY_TYPES.word)), ...(await utilService.getFromStorage(VOCABULARY_TYPES.idiom))]
    return await utilService.getFromStorage(VOCABULARY_TYPES[type as keyof typeof VOCABULARY_TYPES])
}

export const vocabularyService = {
    maxRate: MAX_RATE,
    getFilteredVocabulary,
    getSortedVocabulary,
    getPhraseByKey,
    savePhrases,
    deletePhrase,
    resetDB,
    compareMeanings,
    VOCABULARY_TYPES
}