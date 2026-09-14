import { Schema } from "mongoose"

export interface meNu {
    title: string
    _id: string
    image: string
    price: number
}

export interface product {
    _id: string,
    title: string,
    image: string,
    price: number,
    quantity?: number
}

 export interface proDuct {
        _id : string
        title: string,
        description: string
        image: string
        createdAt: Date
        price: number
        status: string
        purchaseCount : number,
        revenue : number
    }

   export type deletePro = Pick<proDuct, "_id" | "title">

export interface cartProduct {
    _id: string,
    productId: product,
    quantity: number
}

export interface saveFav {
    _id: string,
    title: string,
    image: string,
    price: number
}

interface iTeMs {
    productId: string,
    title: string,
    price: number,
    image: string,
    quantity: number
}

export type allOrdItem = Pick<iTeMs, "title" | "quantity" | 'productId'>

export interface oRdHst {
    _id: string,
    userId: string,
    items: iTeMs[],
    totalAmount: number,
    status: string,
    createdAt: Date,
}

export interface ctmrs {
    _id: string,
    firstName : string,
    lastName : string,
    amountSpent: number,
    email: string,
    profilePic: string
}

export interface all_Ord {
    _id : string,
    paymentReference : string,
    lastName : string,
    firstName : string,
    items : allOrdItem[],
    totalAmount: number,
    status: string,
    createdAt: Date
}