import { Transaction } from "./transaction.model";

export class Card {
    id!:string;
    codeCard!:string;
    initialValue!:number;
    transactions!:Transaction[];
}