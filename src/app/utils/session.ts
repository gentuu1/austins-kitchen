'server-only'

import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import { userModel } from "../models/user"
import dbConnect from "./dbConnects"

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

interface JWTPayload  {
    _id?: string;
    success: boolean;
};

export async function encrypt(payload: {_id : string}) {
    const token =await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)

        return token
}

export async function decrypt(token: string): Promise<JWTPayload> {
    try {
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ['HS256'],
        })
        return {...payload, success : true}
    } catch (error) {
        return {success : false}
    }
}

export async function auth(){
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if(!token){
        return  {
            success : false
        }
    }

    const {_id, success} = await decrypt(token)

    if(!success){
        return {
            success : false
        }
    }

    return {
        _id,
        success: true
    }
}

export const VerifyUser = async()=>{
    await dbConnect();

    const {_id, success}  = await auth()

    if(!success){
        return {
            success: false
        }
    }

    const user = await userModel.findById(_id)

    if(!user){
        return {
            success : false
        }
    }

    return {
        success : true,
        user
    }

}