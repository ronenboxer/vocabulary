export interface Phrase {
    [key: string]: unknown,
    id?: string,
    txt: string,
    meaning: string[],
    rate: number,
    visits: number,
    correctGuesses: number
}

declare global {
    interface Array<T> {
        findLastIndex(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number;
    }
}

Array.prototype.findLastIndex = function <T>(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number {
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate.call(thisArg, this[i], i, this)) {
            return i;
        }
    }
    return -1;
};


export interface Filter {
    txt: string,
    rate: number,
    type?: string
}

export interface Sort {
    primaryKey: string,
    primaryOrderMultiplier: number,
    secondaryKey: string,
    secondaryOrderMultiplier: number
}