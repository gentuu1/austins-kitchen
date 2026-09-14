"use client"
import ProfileNavbar from '../../../../components/ProfileNavbar'
import { Anton } from 'next/font/google'
const anton = Anton({ subsets: ['latin'], weight: '400' })
import { useEffect, useState } from 'react'
import { product } from '@/app/utils/type'
import { toast } from 'react-toastify'
import { useCart } from '@/app/context/contextProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaShoppingCart, FaSpinner } from 'react-icons/fa'
import Spinner from '@/components/Spinner'

const Cart = () => {
    const { cart, subTotal, incRease, decRease, removeCart, inCLoading, deCLoading } = useCart()
    const [isSpinner, setisSpinner] = useState(true)
    const router = useRouter()

      useEffect(()=>{
            setisSpinner(false)
        }, [])
    
    // const subTotal = cart.length !== 0 ? cart.reduce((sum, item) =>{
    //     return sum + item.price
    // }, 0) : 0

    // const fetchcart = async()=>{
    //     const res = await fetchCart()

    //     if(res.success && res.items.length !== 0){
    //         setcart(res.items)
    //         return;
    //     }

    //     setcart([])
    // }

    // useEffect(()=>{
    //     fetchcart()

    // }, [])

    // const removeCart = async(id : string)=>{


    //         const res = await removeCartproduct(id);

    //         if(!res.success){
    //             toast.error(res.message, {
    //                 autoClose : 2000
    //             });

    //             return ;
    //         }

    //         fetchcart()
    //         toast.success(res.message, {
    //             autoClose : 2000
    //         })
    // }

    // const decRease = async (id:string)=>{

    //     const res = await decreaseCartproduct(id)

    //     if(!res.success){
    //         toast.error(res?.message, {
    //             autoClose : 2000
    //         })
    //         return
    //     }

    //     fetchcart()
    //     toast.success(res?.message, {
    //         autoClose : 2000
    //     })
    // }


    if (isSpinner) {
        return  <>
            <div className='sticky top-0 w-full z-50'>
                <ProfileNavbar/>
            </div>
            <Spinner />
        </>
    }


    return (
        <div >
            <div className='sticky top-0 w-full z-50'>
                <ProfileNavbar />
            </div>

            {
                cart.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-5">

                        <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                            <FaShoppingCart className="text-5xl text-[#ED8F0C]" />
                        </div>

                        <h2 className={`${anton.className} text-3xl tracking-wide text-gray-800`}>
                            Your Cart is Empty
                        </h2>

                        <p className="mt-2 text-gray-500 max-w-md leading-7">
                            There are no items in your cart yet. Browse our menu and add something delicious to get started.
                        </p>

                        <Link
                            href="/dashboard/menu"
                            className="mt-6 bg-[#ED8F0C] hover:bg-[#d97f08] text-white font-semibold px-6 py-3 rounded-xl transition"
                        >
                            Browse Menu
                        </Link>

                    </div>
                )
            }

            {
                cart.length !== 0 && (
                    <div className=' w-full py-5'>
                        <table className='m-auto w-[90%] bg-white shadow-md rounded-xl overflow-hidden'>
                            <thead className='p-5 bg-gray-50 md:table-header-group hidden'>
                                <tr className='text-left text-gray-600 text-sm uppercase tracking-wide'>
                                    <th className='p-4 '>
                                        product
                                    </th>
                                    <th className='p-4 '>
                                        price
                                    </th>
                                    <th className='p-4 '>
                                        Qty
                                    </th>
                                    <th className='p-4 text-center'>
                                        Remove
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    cart.length !== 0 && cart.map((each: product) => (
                                        <tr key={each._id} className='flex flex-col md:table-row md:p-0 p-4 gap-3 md:gap-0 border-b border-gray-300'>
                                            <td className='flex gap-3 items-center justify-between md:justify-start md:p-4 '>
                                                <div className='w-16 h-16 rounded-lg overflow-hidden'>
                                                    <img
                                                        src={each.image}
                                                        alt='shawarma'
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>

                                                <p className={`${anton.className} tracking-wide font-medium text-lg text-gray-800`}>
                                                    {each.title}
                                                </p>
                                            </td>

                                            <td className='flex justify-between md:table-cell md:p-4 py-4'>
                                                <h2 className='md:hidden text-gray-500'>Price</h2>

                                                <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>
                                                    ₦{(each.price).toLocaleString()}
                                                </p>
                                            </td>

                                            <td className='flex justify-between md:table-cell md:p-4 py-4'>
                                                <h2 className='md:hidden text-gray-500'>Qty</h2>

                                                <div className='flex items-center gap-2'>
                                                    <button disabled={deCLoading === each._id.toString()} onClick={() => decRease(each._id)} className='cursor-pointer w-8 h-8 border rounded-md hover:bg-gray-100 flex justify-center items-center'>{
                                                        deCLoading === each._id ? (<FaSpinner className="text-sm animate-spin" />) : "-"
                                                    }</button>
                                                    <span>{each.quantity}</span>
                                                    <button disabled={inCLoading === each._id.toString()} onClick={() => incRease(each._id.toString())} className='w-8 h-8 border rounded-md hover:bg-gray-100 flex justify-center items-center'>{
                                                        inCLoading === each._id ? (<FaSpinner className="text-sm animate-spin" />) : "+"
                                                    }</button>
                                                </div>
                                            </td>

                                            <td className='flex justify-between md:table-cell md:text-center md:p-4 py-4'>
                                                <h2 className='md:hidden text-gray-500'>Remove</h2>

                                                <button onClick={() => removeCart(each._id.toString())} className='hover:text-red-500 cursor-pointer focus:text-red-500 text-gray-500 text-lg font-bold'>×</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                        <section className=' mt-20 lg:w-[50%] md:w-[80%] w-full h-fit py-5 ml-auto bg-gray-100 mr-5 flex-col flex gap-10'>
                            <h1 className='lg:text-xl md:text-2xl font-bold text-center tracking-tight'>
                                CART TOTALS
                            </h1>

                            <div className='p-5 md:w-[90%] w-full m-auto h-fit bg-white rounded-lg shadow-2xs '>
                                <div className='w-full border-b border-gray-300 py-3 flex justify-between items-center'>
                                    <h3 className='lg:text-lg md:text-xl font-semibold'>
                                        Subtotal
                                    </h3>

                                    <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>
                                        ₦{
                                            (cart.length === 0 ? 0 : subTotal).toLocaleString()
                                        }
                                    </p>
                                </div>

                                <div className='w-full mt-5 border-gray-300 py-3 flex justify-between items-center'>
                                    <h3 className='lg:text-lg md:text-xl font-light'>
                                        Delivery fee
                                    </h3>

                                    <p className={`${anton.className} text-2xl md:text-xl text-[#ED8F0C] tracking-wide`}>
                                        ₦{
                                            (cart.length === 0 ? 0 : 1000).toLocaleString()
                                        }
                                    </p>
                                </div>

                                <div className='w-full border-t mt-5 border-gray-300 py-3 flex justify-between items-center'>
                                    <h3 className='lg:text-2xl font-bold'>
                                        TOTAL
                                    </h3>

                                    <p className={`${anton.className} text-2xl md:text-xl text-[#ED8F0C] tracking-wide`}>
                                        ₦{
                                            (cart.length === 0 ? subTotal : subTotal + 1000).toLocaleString()
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className=' w-[90%] flex flex-col m-auto'>
                                <button
                                    onClick={() => router.push('/dashboard/check-out')}
                                    disabled={cart.length === 0}
                                    className={`${cart.length === 0 ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer hover:bg-[#e1af69] bg-[#ED8F0C]'} py-3  text-white   transition duration-300`}>
                                    PROCEED TO CHECKOUT
                                </button>
                            </div>


                        </section>
                    </div>
                )
            }
        </div>
    )
}

export default Cart
