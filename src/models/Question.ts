import { IndexDescription, ObjectId } from "mongodb";
interface Answer {
    id: string;
    answer: string
}
export interface Question {
    question_id: string;
    question: string,
    question_slug: string,
    answers: Answer[],
    correct_answer: string
    createdAt: number
    last_update_at: number
}
export const QuestionIndexes: IndexDescription[] = [
    { key: { question_id: 1 }, unique: true, background: true },
    { key: { question: 1 }, background: true },
    { key: { createdAt: 1 }, background: true },
]