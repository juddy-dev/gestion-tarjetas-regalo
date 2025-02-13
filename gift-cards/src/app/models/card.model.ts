import { Transaction } from "./transaction.model";

export class Card {
    app?:string = 'gift-cards'; //esto es de la api
    initialDate!:string;
    id!:string;
    codeCard!:string;
    initialValue!:number;
    transactions!:Transaction[];
}