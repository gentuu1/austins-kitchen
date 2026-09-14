"use client"
import Image from 'next/image';
import { Anton } from 'next/font/google';
import { useCart } from '@/app/context/contextProvider';
import Link from 'next/link';
import { MdClose } from 'react-icons/md';
import { FaHistory, FaSpinner } from 'react-icons/fa';
import ProfileNavbar from './ProfileNavbar';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
const anton = Anton({ subsets: ['latin'], weight: '400' });


const OrderHistory = () => {
    const { canLoading, canOrder, orderhst, rvLoading, rvOrder } = useCart()
    const [isSpinner, setisSpinner] = useState(true)
    const router = useRouter()

    useEffect(()=>{
        setisSpinner(false)
    }, [])

      if (isSpinner) {
            return <>
                <div className='sticky top-0 w-full z-50'>
                    <ProfileNavbar />
                </div>
                <Spinner />
            </>
        }

    return (
        <div>
            <div className='sticky top-0 w-full z-50'>
                <ProfileNavbar />
            </div>

            <div className='md:hidden p-5'>
                <h1 className={`${anton.className} text-3xl font-bold tracking-wide`}>Orders History</h1>
            </div>

            {
                orderhst.length === 0 ? (
                    <div className='flex flex-col items-center justify-center min-h-[65vh] text-center'>
                        <div className='w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center mb-6'>
                            <FaHistory className='text-5xl text-[#ED8F0C]' />
                        </div>

                        <h2 className={`${anton.className} text-3xl tracking-wide text-gray-800`}>
                            No Orders Yet
                        </h2>

                        <p className="mt-2 text-gray-500 max-w-md leading-7">
                            You haven't placed any orders yet. Browse our menu and place your first order to see it here.
                        </p>
                    </div>
                ) : (
                    <section className='w-full  grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 p-5 '>

                        {
                            orderhst.map((order) => (
                                <div onClick={()=> router.push(`/dashboard/order-history/${order._id}`)} key={order._id} className='bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col min-h-80 border border-neutral-200'>

                                    <Link href={`/dashboard/order-history/${order._id}`}>
                                        <div className='w-full pb-3 border-b flex flex-col '>
                                            <h1 className='text-lg  font-semibold text-gray-600'>
                                                Order #AK-{order._id.slice(0, 8).toUpperCase()}
                                            </h1>

                                            <h2 className='text-sm text-gray-500'>
                                                {order.createdAt.toDateString()}
                                            </h2>
                                        </div>
                                    </Link>

                                    <Link href={`/dashboard/order-history/${order._id}`}>
                                        <div className='w-full max-h-52 overflow-y-auto py-3 flex flex-col gap-1'>

                                            {
                                                order.items.map((each, index) => (
                                                    <div key={index} className='w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition'>

                                                        <div className='w-16 h-16 md:w-18 md:h-18 rounded-lg overflow-hidden shrink-0'>
                                                            <Image
                                                                src={each.image}
                                                                alt={each.image}
                                                                loading='eager'
                                                                width={500}
                                                                height={500}
                                                                className='w-full h-full object-cover'
                                                            />
                                                        </div>

                                                        <div className='flex-1 flex flex-col justify-center gap-1'>

                                                            <p className={`${anton.className} text-base md:text-lg text-gray-800 truncate`}>
                                                                {each.title}
                                                            </p>

                                                            <div className='flex justify-between items-center'>
                                                                <p className={`${anton.className} text-base md:text-lg text-[#ED8F0C]`}>
                                                                    ₦{(each.price).toLocaleString()}
                                                                </p>

                                                                <p className='text-sm md:text-base font-medium text-gray-600'>
                                                                    <small>x</small>{each.quantity}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))
                                            }

                                        </div>
                                    </Link>


                                    <div className='w-full pt-3 border-t flex justify-between items-center'>

                                        <Link href={`/dashboard/order-history/${order._id}`}>
                                            <div className='flex flex-col'>
                                                <p className='text-sm text-gray-500 font-bold'>
                                                    {
                                                        order.items.length <= 9 ? `0${order.items.length}` : `${order.items.length}`
                                                    }
                                                </p>

                                                <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C]`}>
                                                    ₦{(order.totalAmount).toLocaleString()}
                                                </p>
                                            </div>
                                        </Link>

                                        <div className="flex flex-col items-end gap-2">


                                            {order.status === "pending" && (
                                                <div className="flex items-center gap-2">
                                                    <button disabled={canLoading === order._id} onClick={() => canOrder(order._id)} type='button' className="bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer p-3 transition">
                                                        {

                                                            canLoading === order._id ? (
                                                                <FaSpinner className="text-red-500 text-xl animate-spin" />
                                                            ) : <MdClose className="text-red-500 text-xl" />

                                                        }
                                                    </button>

                                                    <button className="capitalize px-4 md:px-6 py-2.5 md:py-3 border rounded-lg text-sm md:text-base font-medium bg-amber-100 text-amber-700 border-amber-300">
                                                        {order.status}
                                                    </button>
                                                </div>
                                            )}


                                            {order.status !== "pending" && (
                                                <button
                                                    className={`capitalize px-4 md:px-6 py-2.5 md:py-3 border rounded-lg text-sm md:text-base font-medium transition
                                                    ${order.status === "confirmed"
                                                            ? "bg-blue-100 text-blue-700 border-blue-300"
                                                            : order.status === "preparing"
                                                                ? "bg-orange-100 text-orange-700 border-orange-300"
                                                                : order.status === "ready"
                                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                                                                    : order.status === "out-for-delivery"
                                                                        ? "bg-violet-100 text-violet-700 border-violet-300"
                                                                        : order.status === "delivered"
                                                                            ? "bg-green-100 text-green-700 border-green-300"
                                                                            : 'bg-red-100 text-red-700 border-red-300'
                                                        }`}
                                                >
                                                    {order.status}
                                                </button>
                                            )}

                                        </div>



                                    </div>
                                  { order.status === 'out-for-delivery' && (
                                    <button onClick={(e) => {
                                            e.stopPropagation()
                                            rvOrder(order._id)
                                    }} disabled={order.status !== 'out-for-delivery'} className={`${order.status !== 'out-for-delivery' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'} mt-2 w-full text-white py-2 rounded-lg transition flex-col flex justify-center items-center`}>
                                        { rvLoading === order._id ? (<FaSpinner className=" animate-spin" />)
                                                : "I've received it"
                                        }
                                    </button>
                                    ) }

                                </div>
                            ))
                        }
                    </section>
                )
            }

        </div>
    )
}

export default OrderHistory
