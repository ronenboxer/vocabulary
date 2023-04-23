export interface CardListItem {
    phrase: {
        [x: string]: unknown;
        id?: string | undefined;
        txt: string;
        meaning: string[];
        rate?: number | undefined;
        visits?: number | undefined;
    };
    id: string;
}

export interface QuizAnswer {
    correctAnswerIdx: number;
    meanings: string[][];

}