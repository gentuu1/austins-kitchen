'use client'

import { accept_order, admin_canOrd, mark_delivered, mark_ofd, mark_ready, startpre_paring } from "@/app/utils/action"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaSpinner } from "react-icons/fa"
import { toast } from "react-toastify"

const Status = (order : {status : string, _id: string}) => {
    const router = useRouter()
    const [can_loading, setcan_loading] = useState('')
    const [acc_loading, setacc_loading] = useState('')
    const [prepare_loading, setprepare_loading] = useState('')
    const [ready_loading, setready_loading] = useState('')
    const [ofd_loading, setofd_loading] = useState('')
    const [delivered_loading, setdelivered_loading] = useState('')

    const cancelOrder = async (id: string)=>{
        setcan_loading(id)
        const res = await admin_canOrd(id)

        if(!res.success){
            toast.error(res.message, {
                autoClose : 2000
            })
            setcan_loading('') 
            return;
        }

        toast.success(res.message, {
            autoClose: 2000
        })

        router.refresh()

        setcan_loading('') 
    }

    const acceptOrder = async(id:string)=>{
        setacc_loading(id)
        const res = await accept_order(id)

        if(!res.success){
            toast.error(res.message, {autoClose : 2000})
            setacc_loading('')
            return
        }

        toast.success(res.message, { autoClose: 2000 })
        router.refresh()
        setacc_loading('')
    }

    const startPreparing = async(id:string)=>{
        setprepare_loading(id)
        const res = await startpre_paring(id)

        if(!res.success){
            toast.error(res.message, {autoClose : 2000})
           setprepare_loading('')
            return
        }

        toast.success(res.message, { autoClose: 2000 })
        router.refresh()
       setprepare_loading('')
    }

    const markReady = async(id:string)=>{
        setready_loading(id)
        const res = await mark_ready(id)

        if(!res.success){
            toast.error(res.message, {autoClose : 2000})
          setready_loading('')
            return
        }

        toast.success(res.message, { autoClose: 2000 })
        router.refresh()
       setready_loading('')
    }

    const markoutFd = async(id:string)=>{
        setofd_loading(id)
        const res = await mark_ofd(id)

        if(!res.success){
            toast.error(res.message, {autoClose : 2000})
         setofd_loading('')
            return
        }

        toast.success(res.message, { autoClose: 2000 })
        router.refresh()
       setofd_loading('')
    }

    const markDelivered= async(id:string)=>{
        setdelivered_loading(id)
        const res = await mark_delivered(id)

        if(!res.success){
            toast.error(res.message, {autoClose : 2000})
         setdelivered_loading('')
            return
        }

        toast.success(res.message, { autoClose: 2000 })
        router.refresh()
       setdelivered_loading('')
    }

    return (
        <div className="flex lg:flex-row flex-col gap-2">

            
            {order.status === "pending" && (
                <>
                    <button
                        disabled={acc_loading === order._id}
                        onClick={() => acceptOrder(order._id)}
                        type="button"
                        className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition cursor-pointer  flex items-center justify-center"
                    >
                        {
                            acc_loading === order._id ? (
                                <FaSpinner className="text-lg animate-spin" />
                            ) : 'Accept'
                        }
                    </button>

                    <button
                        disabled={can_loading === order._id}
                        onClick={()=>cancelOrder(order._id)}
                        type="button"
                        className="flex-1 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-500 font-medium transition cursor-pointer  flex items-center justify-center"
                    >
                       {
                            can_loading === order._id ? (
                                <FaSpinner className="text-lg animate-spin" />
                            ) : 'Cancel'
                       }
                    </button>
                </>
            )}

           
            {order.status === "confirmed" && (
                <button
                    disabled={prepare_loading === order._id}
                    onClick={() => startPreparing(order._id)}
                    type="button"
                    className="w-full px-4 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition cursor-pointer  flex items-center justify-center"
                >
                    {
                        prepare_loading === order._id ? (
                            <FaSpinner className="text-lg animate-spin" />
                        ) : 'Start Preparing'
                    }
                </button>
            )}


            
            {order.status === "preparing" && (
                <button
                    disabled={ready_loading === order._id}
                    onClick={() =>markReady (order._id)}
                    type="button"
                    className="w-full px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition cursor-pointer flex justify-center items-center"
                >
                    {
                        ready_loading === order._id ? (
                            <FaSpinner className="text-lg animate-spin" />
                        ) : 'Mark as ready'
                    }
                </button>
            )}

            {/* Ready */}
            {order.status === "ready" && (
                <button
                    disabled={ofd_loading === order._id}
                    onClick={() => markoutFd(order._id)}
                    type="button"
                    className="w-full px-4 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition cursor-pointer flex justify-center items-center"
                >
                    {
                        ofd_loading === order._id ? (
                            <FaSpinner className="text-lg animate-spin" />
                        ) : 'Out for Delivery'
                    }
                </button>
            )}


            {order.status === "out-for-delivery" && (
                <button
                    disabled={delivered_loading === order._id}
                    onClick={() => markDelivered(order._id)}
                    type="button"
                    className="w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition cursor-pointer flex justify-center items-center"
                >
                    {
                        delivered_loading === order._id ? (
                            <FaSpinner className="text-lg animate-spin" />
                        ) : 'Mark as delivered'
                    }
                </button>
            )}

        </div>
    )
}

export default Status
