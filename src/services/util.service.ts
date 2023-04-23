import AsyncStorage from '@react-native-async-storage/async-storage';

function makeId(blocks = 2, length = 5) {
    const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const strs = []
    for (let i = 0; i < blocks; i++) {
        let currStr = ''
        for (let j = 0; j < length; j++) {
            currStr += CHARS.charAt(getRandomInt(CHARS.length))
        }
        strs.push(currStr)
    }
    return strs.join('-')
}

function getRandomInt(max: number, min = 0, isInclusive = false) {
    return Math.floor(Math.random() * (max - min + (isInclusive ? 1 : 0)) + min)
}

function debounce<F extends (...params: any[]) => void>(fn: F, delay = 350) {
    let timeoutID: number | null = null;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutID!);
        timeoutID = setTimeout(() => fn.apply(this, args), delay);
    } as F;
}

async function saveToStorage(key: string, value: unknown) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
        return value
    } catch (err) {
        console.log('Cannot save to storage', err)
        throw err
    }
}

async function getFromStorage(key: string) {
    try {
        const entity = await AsyncStorage.getItem(key)
        return entity
            ? JSON.parse(entity)
            : null
    } catch (err) {
        console.log('Cannot load from storage', err)
        throw (err)
    }
}

export const utilService = {
    makeId,
    getRandomInt,
    saveToStorage,
    getFromStorage,
    debounce
}