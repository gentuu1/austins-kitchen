"use client"
import { useCart } from '@/app/context/contextProvider'
import { iniPayment} from '@/app/utils/action'
import { product } from '@/app/utils/type'
import ProfileNavbar from '@/components/ProfileNavbar'
import Spinner from '@/components/Spinner'
import { useFormik } from 'formik'
import Image from 'next/image'
import {  useEffect, useState, useTransition } from 'react'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import * as yup from 'yup'

const Checkout = () => {
    const [isPending, startTransition] = useTransition()
    const { cart, cartNumber, subTotal, decRease } = useCart()
    const [isSpinner, setisSpinner] = useState(true)

    useEffect(()=>{
        setisSpinner(false)
    }, [])

    const inipayformik = useFormik({
        initialValues: {
            phoneNumber: '',
            firstName: '',
            lastName: '',
            address: '',
            state: '',
            town: '',
        },

        onSubmit: async (values) => {
            startTransition(async () => {
                const res = await iniPayment({ ...values });

                if (!res.success) {
                    toast.error(res.message, {
                        autoClose: 2000
                    })

                    return;
                }


                window.location.href = res.authorization_url
            })
        },

        validationSchema: yup.object({
            phoneNumber: yup.string().required("Phone number is required"),
            firstName: yup.string().required('Required'),
            lastName: yup.string().required('Required'),
            address: yup.string().required('Required'),
            state: yup.string().required('Required'),
            town: yup.string().required('Required')
        })
    })

    
   if (isSpinner) {
           return  <>
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


            <div className="w-[95%] max-w-7xl mx-auto mt-6 grid lg:grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8 space-y-8">

                    {/* Contact */}
                    <div className="space-y-5">
                        <div>
                            <h2 className="text-2xl font-bold text-[#ED8F0C]">
                                Contact Information
                            </h2>

                            <p className="text-gray-500 text-sm">
                                We'll use this to contact you about your order.
                            </p>
                        </div>

                        <div className='w-full flex flex-col'>
                            <input
                                onChange={inipayformik.handleChange}
                                value={inipayformik.values.phoneNumber}
                                onBlur={inipayformik.handleBlur}
                                name='phoneNumber'
                                type='number'
                                placeholder="Phone Number"
                                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#ED8F0C]"
                            />

                            {
                                inipayformik.errors.phoneNumber && inipayformik.touched.phoneNumber && (
                                    <small className='text-red-500 '>
                                        {inipayformik.errors.phoneNumber}
                                    </small>
                                )
                            }
                        </div>
                    </div>

                    <div className="space-y-5">

                        <div>
                            <h2 className="text-2xl font-bold text-[#ED8F0C]">
                                Delivery Address
                            </h2>

                            <p className="text-gray-500 text-sm">
                                Enter where you want your food delivered.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className='flex flex-col'>
                                <input
                                    onChange={inipayformik.handleChange}
                                    value={inipayformik.values.firstName}
                                    onBlur={inipayformik.handleBlur}
                                    name='firstName'
                                    placeholder="First Name"
                                    className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    inipayformik.errors.firstName && inipayformik.touched.firstName && (
                                        <small className='text-red-500 '>
                                            {inipayformik.errors.firstName}
                                        </small>
                                    )
                                }
                            </div>

                            <div className='flex flex-col'>
                                <input
                                    onChange={inipayformik.handleChange}
                                    value={inipayformik.values.lastName}
                                    onBlur={inipayformik.handleBlur}
                                    name='lastName'
                                    placeholder="Last Name"
                                    className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    inipayformik.errors.lastName && inipayformik.touched.lastName && (
                                        <small className='text-red-500 '>
                                            {inipayformik.errors.lastName}
                                        </small>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <select
                                onChange={inipayformik.handleChange}
                                value={inipayformik.values.state}
                                onBlur={inipayformik.handleBlur}
                                name='state'
                                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#ED8F0C]"
                            >
                                <option value="">Select State</option>
                                <option value="Oyo">Oyo</option>
                            </select>
                            {
                                inipayformik.errors.state && inipayformik.touched.state && (
                                    <small className='text-red-500 '>
                                        {inipayformik.errors.state}
                                    </small>
                                )
                            }
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <div className='flex flex-col'>
                                <input
                                    onChange={inipayformik.handleChange}
                                    value={inipayformik.values.address}
                                    onBlur={inipayformik.handleBlur}
                                    name='address'
                                    placeholder="Street Address"
                                    className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    inipayformik.errors.address && inipayformik.touched.address && (
                                        <small className='text-red-500 '>
                                            {inipayformik.errors.address}
                                        </small>
                                    )
                                }
                            </div>

                            <div className='flex flex-col'>
                                <select
                                    onChange={inipayformik.handleChange}
                                    value={inipayformik.values.town}
                                    onBlur={inipayformik.handleBlur}
                                    name='town'
                                    className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#ED8F0C]"
                                >
                                    <option value="">Town/City</option>
                                    <option value="Ibadan">Ibadan</option>
                                </select>
                                {
                                    inipayformik.errors.town && inipayformik.touched.town && (
                                        <small className='text-red-500 '>
                                            {inipayformik.errors.town}
                                        </small>
                                    )
                                }
                            </div>

                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-24">

                    <div className='flex justify-between mb-6'>
                        <h2 className="text-2xl font-bold">
                            Order Summary
                        </h2>

                        <h3 className='text-[20px] font-bold'>
                            {
                               cartNumber <=0 ? '0' : cartNumber <= 9 ? `0${cartNumber} ` : cartNumber
                            }
                        </h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-4">

                        {cart.map((each: product) => (
                            <div
                                key={each._id}
                                className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3 shadow-sm"
                            >

                                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                    <Image
                                        src={each.image}
                                        alt={each.title}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1">

                                    <h3 className="font-semibold text-gray-800">
                                        {each.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Qty: {each.quantity}
                                    </p>

                                    <p className="text-lg font-bold text-[#ED8F0C] mt-1">
                                        ₦{each.price.toLocaleString()}
                                    </p>

                                </div>

                                <div className='flex items-center justify-center'>
                                    <FaTimes onClick={() => decRease(each._id)} className='text-base md:text-lg cursor-pointer hover:text-red-500 transition' />
                                </div>

                            </div>
                        ))}

                    </div>

                    <div className="space-y-4">

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Subtotal
                            </span>

                            <span>₦{(subTotal).toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Delivery Fee
                            </span> 

                            <span>₦{(cart.length === 0 ? "0" : '1000').toLocaleString()}</span>
                        </div>

                        <hr />

                        <div className="flex justify-between text-xl font-bold">

                            <span>Total</span>

                            <span className="text-[#ED8F0C]">
                                ₦{
                                    (cart.length === 0 ? subTotal : subTotal + 1000).toLocaleString()
                                }
                            </span>

                        </div>

                        <button
                            disabled={cart.length === 0 || isPending}
                            onClick={() => inipayformik.handleSubmit()}
                            type='button'
                            className={`flex flex-col justify-center items-center w-full h-12 mt-6 rounded-xl text-white font-semibold transition ${cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ED8F0C] hover:bg-orange-600 '}`}
                        >
                            {

                                isPending ? (
                                    <FaSpinner className="text-lg animate-spin" />
                                ) : ' Proceed to payment'

                            }
                        </button>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default Checkout
