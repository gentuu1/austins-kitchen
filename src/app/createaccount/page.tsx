"use client"
import { Anton } from 'next/font/google';
const anton = Anton({ subsets: ['latin'], weight: '400' });
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { signUp } from '@/app/utils/action';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

const Page = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setisLoading] = useState(false)
    const router = useRouter()
    const [isSpinner, setisSpinner] = useState(true)

    useEffect(() => { setisSpinner(false) }, [])

   

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },

        onSubmit: async (values) => {
            try {
                setisLoading(true)
                const res = await signUp({ ...values })

                if (!res.success) {
                    toast.error(res.message, {
                        autoClose: 2000
                    })
                    return
                }

                toast.success(res.message, {
                    autoClose: 2000
                })

                router.push('/dashboard')
            } finally {
                setisLoading(false)
            }
        },

        validationSchema: yup.object({
            firstName: yup.string().required('Required'),
            lastName: yup.string().required('Required'),
            email: yup.string().required('Email is required').email('Enter a valid email'),
            password: yup.string().required('Password is required').min(8, 'Password must be at leats 8 characters'),
            confirmPassword: yup.string().required("Required").oneOf([yup.ref('password')], "Passwords do not match")
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

            <section className="w-full lg:p-7 md:p-7 p-5 bg-[#FFFFFF]/95 backdrop-blur-xl mt-5">

                <div className="w-full flex flex-col h-30 items-center justify-center space-y-3">
                    <h1 className={`${anton.className} text-center md:text-5xl text-4xl tracking-tight`}>
                        CREATE ACCOUNT
                    </h1>

                    <p className={`text-center text-sm tracking-tight`}>
                        <a className='underline hover:text-[#ED8F0C]' href="/">Home</a>/Create Account
                    </p>
                </div>

                <div className="w-full py-10 flex justify-center">

                    <div className="w-full max-w-md rounded-2xl p-6 md:p-8 flex flex-col space-y-6 shadow-2xl">

                        {/* Firstname & Lastname */}
                        <div className="flex gap-4">

                            <div className="flex flex-col space-y-2 w-1/2">
                                <label className="text-sm font-medium">First name</label>

                                <div className='leading-tight flex-col flex'>
                                    <input
                                        name='firstName'
                                        value={formik.values.firstName}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        placeholder="First name"
                                        className={`  border rounded-md p-3 focus:outline-none focus:border-[#ED8F0C]`}
                                    />
                                    {
                                        formik.errors.firstName && (<small className='text-red-500 md:text-[8px] text-[10px]'>
                                            {formik.errors.firstName}
                                        </small>)
                                    }
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2 w-1/2">
                                <label className="text-sm font-medium">Last name</label>

                                <div className="leading-tight flex flex-col">
                                    <input
                                        name='lastName'
                                        value={formik.values.lastName}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        placeholder="Last name"
                                        className="border rounded-md p-3 focus:outline-none focus:border-[#ED8F0C]"
                                    />
                                    {
                                        formik.errors.lastName && (<small className='text-red-500 md:text-[8px] text-[10px]'>
                                            {formik.errors.lastName}
                                        </small>)
                                    }
                                </div>
                            </div>

                        </div>



                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Email address</label>

                            <div className=' flex flex-col leading-tight'>
                                <input
                                    name='email'
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="border rounded-md p-3 focus:outline-none focus:border-[#ED8F0C]"
                                />

                                {
                                    formik.errors.email && (<small className='text-red-500 md:text-[8px] text-[10px]'>
                                        {formik.errors.email}
                                    </small>)
                                }
                            </div>
                        </div>



                        <div className="flex flex-col space-y-2">

                            <label className="text-sm font-medium">Password</label>

                            <div className="leading-tight">

                                <div className=' relative'>
                                    <input
                                        name='password'
                                        value={formik.values.password}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="border rounded-md p-3 w-full pr-10 focus:outline-none focus:border-[#ED8F0C]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {
                                    formik.errors.password && (<small className='text-red-500 md:text-[8px] text-[10px]'>
                                        {formik.errors.password}
                                    </small>)
                                }


                            </div>

                        </div>



                        <div className="flex flex-col space-y-2">

                            <label className="text-sm font-medium">Confirm password</label>

                            <div className='flex flex-col leading-tight'>
                                <input
                                    name='confirmPassword'
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="border rounded-md p-3 focus:outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    formik.errors.confirmPassword && (<small className='text-red-500 md:text-[8px] text-[10px]'>
                                        {formik.errors.confirmPassword}
                                    </small>)
                                }
                            </div>

                        </div>



                        <button type='button' onClick={() => formik.handleSubmit()} className="flex justify-center bg-[#ED8F0C] text-white p-3 rounded-md hover:opacity-90 transition ">
                            {
                                isLoading ? (
                                    <FaSpinner className="text-lg animate-spin" />
                                ) : ' Create account'
                            }
                        </button>



                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <a
                                href="/signin"
                                className="text-[#ED8F0C] font-medium hover:underline"
                            >
                                Sign In
                            </a>
                        </p>

                    </div>

                </div>

            </section>

            <Footer />
        </div>
    )
}

export default Page
