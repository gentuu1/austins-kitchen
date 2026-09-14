"use client"

import { verifyPay } from "@/app/utils/action";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaMotorcycle } from "react-icons/fa";
import { toast } from "react-toastify";
import { Anton } from "next/font/google";
import Spinner from "@/components/Spinner";
const anton = Anton({
    subsets: ["latin"],
    weight: "400",
});

const Success = () => {
    const [order, setsuccess] = useState<{
        _id ?: string,
        totalAmount ?: number,
        paymentStatus? : string,
        success? : boolean,
        message? : string
        status ? : string
    }>({
        _id: '',
        totalAmount: 0,
        paymentStatus: '',
        success: false,
        message: "",
        status : ''
    })
    
    const [isSpinner, setisSpinner] = useState(true)

    const searchParams = useSearchParams()

    const router = useRouter()

    const reference = searchParams.get('reference')

    useEffect(() => {
            const verifyPayment = async () => {
                if (!reference) {
                    toast.error('Invalid payment reference', {
                        autoClose : 2000
                    })

                    setisSpinner(false)
                    router.push('/signin')

                    return
                }
    
                const res = await verifyPay(reference)
    
                if (!res.success) {
                    toast.error(res.message, {
                        autoClose: 2000
                    })

                    router.push('/dashboard/checkout')
                    setisSpinner(false)
                    return
                };

               
                setsuccess({...res})
                setisSpinner(false) 
                
            }
    
            verifyPayment()
    
        }, [reference])

        if(isSpinner) return <Spinner/>
   
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-5">

                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">

                    <div className="flex justify-center">
                        <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                            <FaCheckCircle className="text-6xl text-green-600" />
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <h1
                            className={`${anton.className} text-4xl tracking-wide text-[#3E4C59]`}
                        >
                           {order?.message}
                        </h1>

                        <p className="text-gray-500 mt-3 text-md">
                            Thank you for ordering from Austin Kitchen.
                            <br />
                            Your payment was successful and your order has been received.
                        </p>
                    </div>

                    <div className="mt-10 rounded-2xl border border-gray-200 overflow-hidden">

                        <div className="flex justify-between p-5 border-b">
                            <span className="font-semibold text-gray-500">Order ID</span>
                            <span className={`${anton.className}`}>
                                #AK-{(order?._id)?.slice(0, 8).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex justify-between p-5 border-b">
                            <span className="font-semibold text-gray-500">
                                Total Paid
                            </span>

                            <span
                                className={`${anton.className} text-[#ED8F0C] text-xl`}
                            >
                                ₦{(order?.totalAmount)?.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex justify-between p-5">
                            <span className="font-semibold text-gray-500">
                                Payment Status
                            </span>

                            <span className="text-green-600 font-semibold">
                                {order.paymentStatus === "success"
                                    ? "Paid"
                                    : order.paymentStatus}
                            </span>
                        </div>

                    </div>

                    <div className="flex flex-col mt-8">
                        <div className="bg-orange-50 rounded-xl p-5 flex items-center gap-4">

                            <div className="bg-[#ED8F0C]/20 p-3 rounded-full">
                                <FaMotorcycle className="text-[#ED8F0C] text-xl" />
                            </div>

                            <div>
                                <p className="font-semibold">Current Status</p>
                                <p className="text-orange-600 capitalize">
                                    {order?.status}
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="mt-10">

                        <h2 className="font-bold text-lg mb-5">
                            Order Progress
                        </h2>

                        <div className="space-y-5">

                            <div className="flex items-center gap-4">
                                <div className="w-5 h-5 rounded-full bg-green-500"></div>
                                <p>Order Received</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-5 h-5 rounded-full bg-green-500"></div>
                                <p>Payment Confirmed</p>
                            </div>

                        </div>

                    </div>

                    <div className="mt-10 flex flex-col md:flex-row gap-4">

                        <Link
                            href="/dashboard/pending-orders"
                            className="flex-1"
                        >
                            <button className="w-full bg-[#ED8F0C] text-white py-4 rounded-xl hover:bg-orange-500 transition font-semibold cursor-pointer">
                                Track Order
                            </button>
                        </Link>

                        <Link
                            href="/dashboard/menu"
                            className="flex-1"
                        >
                            <button className="w-full border-2 border-[#ED8F0C] text-[#ED8F0C] py-4 rounded-xl hover:bg-orange-50 transition font-semibold cursor-pointer">
                                Continue Shopping
                            </button>
                        </Link>

                    </div>

                </div>

            </div>
        );
    };

    export default Success;