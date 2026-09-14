'use client'
import { Anton, Pacifico } from 'next/font/google';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useEffect, useState, useTransition } from 'react';
import Spinner from '@/components/Spinner';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { contactUs } from '../utils/action';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
const anton = Anton({ subsets: ['latin'], weight: '400' });
const pacifico = Pacifico({ subsets: ['latin'], weight: '400' });

const Page = () => {
    const [isSpinner, setisSpinner] = useState(true)
    const [isPending, startTransition] = useTransition()

    useEffect(()=>{setisSpinner(false)},[])

    const useformik = useFormik({
        initialValues : {
            firstName : '',
            lastName : '',
            email : '',
            subject : '',
            message : ''
        },

        onSubmit : (values)=>{
            startTransition(async ()=>{
                const res = await contactUs(values)

                if(!res.success) {
                    toast.error(res.message, {
                        autoClose : 2000
                    })
                    return
                }

                useformik.resetForm()
                toast.success(res.message, {
                    autoClose: 2000
                })
            })
        },

        validationSchema : yup.object({
            firstName: yup.string().required('First name is required'),
            lastName: yup.string().required('Last name is required'),
            email: yup.string().required('Email is required').email('Input valid email'),
            subject: yup.string().required('Subject is required'),
            message: yup.string().required('message is required')
        })
    })

    if (isSpinner) {
        return <>
            <div className="sticky top-0 z-50">
                <NavBar />
            </div>
            <Spinner />
        </>
    }
    return (
        <div className='min-h-screen min-w-screen'>
            <div className="sticky top-0 z-50">
                <NavBar />
            </div>

            <section className="md:w-full lg:w-[95%] w-full m-auto min-h-100 bg-[#FFFFFF]/95 backdrop-blur-xl mt-5">

                <div className="w-full flex flex-col h-30 items-center justify-center space-y-3">
                    <h1 className={`${anton.className} text-center md:text-5xl text-4xl tracking-tight`}>
                        CONTACT - US
                    </h1>

                    <p className={`text-center text-sm tracking-tight`}>
                        <a className='underline hover:text-[#ED8F0C]' href="/">Home</a>/Contact
                    </p>
                </div>


                <div className='lg:w-[95%] w-full m-auto md:flex-row flex-col flex md:px-3 px-5 lg:px-5'>
                    <div className='md:w-[50%] w-full py-5  flex flex-col space-y-5'>
                        <h1 className={`${pacifico.className} text-3xl tracking-wide text-[#ED8F0C]`}>
                            Contact Us
                        </h1>

                        <p className={`${anton.className} md:text-start text-center text-[#3E4C59] text-lg font-semibold    md:max-w-100  tracking-wide `}>

                            At Austine's kitchen Foods, we’re always happy to hear from you. Whether you want to place an order, make an enquiry, give feedback, or partner with us, our team is ready to respond quickly and professionally.
                        </p>

                        <p className='text-sm md:text-start text-center max-w-120 text-[#52606D]'>
                            Have questions about our <strong> Shawarma</strong> ,<strong>  Smoothies</strong>, <strong>Burger</strong>, or <strong>Pizza</strong> ? Need support with your order? Looking to locate the closest Austine's kitchen branch?
                            Just reach out — we’ve got you covered.
                        </p>

                    </div>

                    <div className='md:w-[50%] w-full px-5 flex flex-col py-5 space-y-5'>
                        <div className='flex md:flex-row flex-col gap-5 justify-between'>
                            <div className='flex flex-col gap-1 md:w-[45%]'>
                                <input
                                    onChange={useformik.handleChange}
                                    value={useformik.values.firstName}
                                    name='firstName'
                                    type="text"
                                    placeholder='First Name'
                                    className='outline py-3 text-sm px-2 focus:outline-blue-500 focus:shadow-sm'
                                />
                                {
                                    useformik.errors.firstName && (
                                        <small className='text-red-500 text-sm tracking-tight'>{useformik.errors.firstName}</small>
                                    )  
                                }
                            </div>

                           <div className='flex flex-col gap-1 md:w-[45%]'>
                                <input
                                    onChange={useformik.handleChange}
                                    value={useformik.values.lastName}
                                    name='lastName'
                                    type="text"
                                    placeholder='Last Name'
                                    className='outline py-3  text-sm px-2 focus:outline-blue-500 focus:shadow-sm'
                                />
                                {
                                    useformik.errors.lastName && (
                                        <small className='text-red-500 text-sm tracking-tight'>{useformik.errors.lastName}</small>
                                    )
                                }
                           </div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <input
                                onChange={useformik.handleChange}
                                value={useformik.values.email}
                                name='email'
                                type="text"
                                placeholder='Email Address'
                                className='outline py-3  text-sm px-2 focus:outline-blue-500 focus:shadow-sm'
                            />
                            {
                                useformik.errors.email && (
                                    <small className='text-red-500 text-sm tracking-tight'>{useformik.errors.email}</small>
                                )
                            }
                        </div>

                        <div className='flex flex-col gap-1'>
                            <input
                                onChange={useformik.handleChange}
                                value={useformik.values.subject}
                                name='subject'
                                type="text"
                                placeholder='Subject'
                                className='outline py-3 text-sm px-2 focus:outline-blue-500 focus:shadow-sm'
                            />
                            
                            {
                                useformik.errors.subject && (
                                    <small className='text-red-500 text-sm tracking-tight'>{useformik.errors.subject}</small>
                                )
                            }
                        </div>

                        <div className='flex flex-col'>
                            <textarea
                                onChange={useformik.handleChange}
                                value={useformik.values.message}
                                name='message'
                                placeholder='Your Message'
                                className='outline py-3 text-sm px-2 focus:outline-blue-500 focus:shadow-sm '
                            />
                            {
                                useformik.errors.message && (
                                    <small className='text-red-500 text-sm tracking-tight'>{useformik.errors.message}</small>
                                )
                            }
                        </div>

                        <div className='flex flex-col'>
                            <button type='button' disabled={isPending} onClick={()=>useformik.handleSubmit()} className={`${anton.className} text-lg text-white bg-[#E47B02] py-4 w-[50%] cursor-pointer hover:bg-[#f3ab59] flex justify-center items-center`}>
                                {
                            isPending ? (<FaSpinner size={15} className='animate-spin'/>) : "SUBMIT FORM"
                            }
                            </button>

                        </div>



                    </div>
                </div>

                <div className=' mt-10 flex flex-col space-y-3 py-7 w-[95%] m-auto'>
                    <h1 className={`${pacifico.className} text-3xl text-[#E47B02] mb-7`}>
                        Head Office
                    </h1>

                    <h3 className={`${anton.className} text-[#3E4C59] md:text-3xl text-2xl `}>
                        IB, Ojo ogundana crescent, vulcaniser bus stop, egbeda, Ibadan
                    </h3>

                    <h3 className={`${anton.className} text-[#3E4C59] md:text-3xl text-2xl `}>
                        070614124242
                    </h3>

                    <h3 className={`${anton.className} text-[#3E4C59] md:text-3xl text-2xl `}>
                        AUSTINESKITCHEN@GMAIL.COM
                    </h3>
                </div>

            </section>

            <Footer />
        </div>
    )
}

export default Page
