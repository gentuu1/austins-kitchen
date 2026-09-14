import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {  fetchCart, addToCart,  removeCartproduct,   increaseCartproduct,  decreaseCartproduct, productSaved, fetchfav, removefav, orderHistory, canOrd, receivedOrd, userProfile, editProfile, delProfilePic, verify_emailotp } from "@/app/utils/action"
import { oRdHst, product, saveFav } from "../utils/type";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface EmailOtp {
    _id: string,
    newEmail: string,
    otp: string
}


interface userp {
    _id : string
    firstName : string
    lastName : string
    email : string
    amountSpent : number
    phoneNumber : string
    profilePic : string
}

interface editP {
    firstName: string,
    lastName: string,
    email: string,
    profilePic: string,
    phoneNumber: string,
    _id: string
} 

interface CartContextType {
    cart: product[]
    subTotal: number
    fetchcart: () => Promise<void>
    add: (id: string) => Promise<any>
    decRease: (id: string) => Promise<any>
    deCLoading: string,
    incRease: (id: string) => Promise<any>
    inCLoading : string,
    removeCart: (id: string) => Promise<any>
    removeSave : (id : string) => Promise<void>,
    save : (id : string)=> Promise<void>,
    orderhst: oRdHst[],
    isPinner : boolean
    pendOrders: oRdHst[],
    user_pro : userp | null,
    edit_profile: (data: editP)=> Promise<any>
    del_profilePic : (id:string)=>Promise<any>
    vrfEmailOtp : (data : EmailOtp) =>Promise<any>
    canOrder :(id:string) => Promise<any>,
    rvOrder:(id:string) => Promise<any>,
    rvLoading:string,
    pendOrdNum : number,
    toTalordNum : number,
    canLoading : string,
    remove : string,
    adding : string,
    saVing : string,
    fav : saveFav[],
    favNumber : number
    cartNumber : number
}





const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({children}: { children: ReactNode }) => {

    const [adding, setadding] = useState('');
    const [remove, setremove] = useState('');
    const [cart, setcart] = useState<product[]>([])
    const [fav, setfav] = useState<saveFav[]>([])
    const [orderhst, setorderhst] = useState<oRdHst[]>([])
    const [isPinner, setisPinner] = useState(true)
    const [user_pro, setuser_pro] = useState<userp | null>(null)
    const [canLoading, setcanLoading] = useState('')
    const [rvLoading, setrvLoading] = useState('')
    const [saVing, setsaVing] = useState('')
    const [inCLoading, setinCLoading] = useState('')
    const [deCLoading, setdeCLoading] = useState('')
    const router = useRouter()

    const subTotal = cart.length !== 0 ? cart.reduce((sum, item) => {
        return sum + item.price
    }, 0) : 0

    const pendOrders: oRdHst[]  = orderhst.filter(
        order => order.status === 'pending'
    )

    const toTalordNum = orderhst.length

    const pendOrdNum = pendOrders.length

   

    const favNumber = fav.length
    const cartNumber = cart.length

    const fetchcart = async () => {
        const res = await fetchCart()

        if (res.success && res.items.length !== 0) {
            setcart(res.items)
            return;
        }

        setcart([])
    }

    useEffect(() => {
        fetchcart()

    }, [])

    const removeCart = async (id: string) => {
        const res = await removeCartproduct(id);

        if (!res.success) {
            toast.error(res.message, {
                autoClose: 2000
            });

            return;
        }

        await fetchcart()
        toast.success(res.message, {
            autoClose: 2000
        })
    }

    const decRease = async (id: string) => {
        setdeCLoading(id)

        const res = await decreaseCartproduct(id)

        if (!res.success) {
            toast.error(res?.message, {
                autoClose: 2000
            })
            setdeCLoading('')
            return
        }

        await fetchcart()
        toast.success(res?.message, {
            autoClose: 2000
        })
        setdeCLoading('')
    }

    const incRease = async (id: string) => {
        setinCLoading(id)

        const res = await increaseCartproduct(id)

        if (!res.success) {
            toast.error(res?.message, {
                autoClose: 2000
            })
            setinCLoading('')
            return;
        }

        await fetchcart()
        toast.success(res?.message, {
            autoClose: 2000
        })
        setinCLoading('')
    }

    const add = async (id: string) => {
        setadding(id)
        const res = await addToCart(id)

        if (!res.success) {
            toast.error(res.message, {
                autoClose: 2000
            })
            setadding('')
            return;
        }

        await fetchcart()
        toast.success(res.message, {
            autoClose: 2000
        })
        
        setadding('')
    }

    const fetchSave = async ()=>{
        const res = await fetchfav()

        if (res.success && res.favPro){
            setfav(res.favPro)
            return;
        }

        setfav([])
    }

    useEffect(()=>{
        fetchSave()
    }, [])


    const save = async (id: string) => {
        setsaVing(id)
        const res = await productSaved(id)

        if (!res.success) {
            toast.error(res.message, {
                autoClose: 2000
            })
            setsaVing('')
            return;
        }

        await fetchSave()
        toast.success(res.message, {
            autoClose: 2000
        })

        setsaVing('')

    }

    const removeSave = async(id:string)=>{
        setremove(id)
        const res = await removefav(id)

        if(!res.success){
            toast.error(res.message, {
                autoClose: 2000
            })
            setremove('')
            return;
        }

        await fetchSave()
        toast.success(res.message, {
            autoClose: 2000
        })

        setremove('')
    }

    const Orders = async ()=>{
        setisPinner(true)
        const res = await orderHistory();

        if(!res.success){
            toast.error(res.message, {
                autoClose : 2000
            })
            setisPinner(false)
            return;
        }

        setorderhst(res.orders || [])
        setisPinner(false)
    }

    useEffect(()=>{
        Orders()
    }, [])

    const canOrder = async(id : string)=>{
        console.log(id)
        setcanLoading(id)
        const res = await canOrd(id)
        
        if(!res.success){
            toast.error(res.message, {
                autoClose : 2000
            })

            setcanLoading('')

            return;
        }

        await Orders()
        toast.success(res.message,{
            autoClose: 2000
        })

        setcanLoading('')
    }

    const rvOrder = async(id:string)=>{
        setrvLoading(id)
        const res = await receivedOrd(id)

        if(!res.success) {
            toast.error(res.message, {
                autoClose : 2000
            })
            setrvLoading('')
            return;
        }

        await Orders()
        toast.success(res.message,{
            autoClose : 2000
        })

        
        

        setrvLoading('')

    }

    const user_profile = async() => {
        const res = await userProfile()

        if(!res.success){
            toast.error(res.message, {
                autoClose : 2000
            })
            setuser_pro(null)
            return
        }

        setuser_pro(res.uSer || null)
    }

    useEffect(()=>{
        user_profile()
    }, [])

    const edit_profile = async (data : editP)=>{
        const res = await editProfile({...data})

        if(!res.success) {
           if(res.message === 'All fields are required') {
               toast.error(res.message, {
                   autoClose: 2000
               })
               return
           }

            toast.error(res.message, {
                autoClose: 2000
            })
            router.push('/signin')
            return
        }

        toast.success(res.message, {
            autoClose : 2000
        })
        await user_profile()
    }

    const del_profilePic = async (id: string)=>{
        const res = await delProfilePic(id)

        if(!res.success) {
            toast.error(res.message, {
                autoClose : 2000
            })
            router.push('/signin')
            return
        }

        toast.success(res.message,{
            autoClose : 2000
        })

        await user_profile()
    }

    const vrfEmailOtp = async (data: EmailOtp)=>{
        const res = await verify_emailotp(data)

        if(!res.success) return { success : false, message : res.message }
        
        await user_profile()
        return { success: true, message: res.message }
    }

    return (
        <CartContext.Provider value={{
            cart,
            subTotal,
            fetchcart,
            add,
            removeCart,
            decRease,
            deCLoading,
            incRease,
            inCLoading,
            save,
            removeSave,
            orderhst,
            isPinner,
            user_pro,
            edit_profile,
            del_profilePic,
            vrfEmailOtp,
            pendOrders,
            canOrder,
            rvOrder,
            rvLoading,
            pendOrdNum,
            toTalordNum,
            canLoading,
            adding,
            saVing,
            favNumber,
            cartNumber,
            fav,
            remove
        }}>{children}</CartContext.Provider>
    )
}

export const useCart = ()=>{
    const context = useContext(CartContext)
    
    if(!context) {
        throw new Error ('Error loading cart context')
    }
   return context
}