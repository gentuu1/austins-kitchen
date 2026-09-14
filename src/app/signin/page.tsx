"use client"
import { Anton } from 'next/font/google';
const anton = Anton({ subsets: ['latin'], weight: '400' });
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';
import { useFormik } from 'formik';
import * as yup from "yup"
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { signIn } from '@/app/utils/action';
import Spinner from '@/components/Spinner';


const Page = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setisLoading] = useState(false)
    const router = useRouter()
    const [isSpinner, setisSpinner] = useState(true)

    useEffect(() => { setisSpinner(false) }, [])


    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },

        onSubmit: async (values) => {
            try {
                setisLoading(true)

                const res = await signIn({ ...values })

                if (!res.success) {
                    toast.error(res.message,
                        {
                            autoClose: 2000
                        }
                    )
                    return;
                }

                toast.success(res.message,
                    {
                        autoClose: 2000
                    }
                )

                if (res.role !== "admin") {
                    router.push('/dashboard')
                    return
                }

                router.push('/admin-dashboard')



            } finally {
                setisLoading(false)
            }
        },

        validationSchema: yup.object({
            email: yup.string().required('Email is required').email('Enter a valid email'),
            password: yup.string().required('Password is required').min(8, 'Password must be at leasst 8 charaters')
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
                        SIGN IN
                    </h1>

                    <p className={`text-center text-sm tracking-tight`}>
                        <a className='underline hover:text-[#ED8F0C]' href="/">Home</a>/Sign-In
                    </p>
                </div>

                <div className="w-full py-10 flex justify-center">

                    <form className="w-full max-w-md rounded-2xl p-6 md:p-8 flex flex-col space-y-6 shadow-2xl">


                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Email address</label>


                            <div className='flex flex-col leading-tight'>
                                <input
                                    name='email'
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="border rounded-md p-3 focus:outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    formik.errors.email && formik.touched.email && (
                                        <small className='text-red-500 text-[10px] md:text-[8px]'>{formik.errors.email}</small>
                                    )
                                }
                            </div>

                        </div>


                        <div className="flex flex-col space-y-2">

                            <label className="text-sm font-medium">Password</label>

                            <div className='flex flex-col leading-tight'>
                                <div className="relative">

                                    <input
                                        name='password'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
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
                                    formik.errors.password && formik.touched.password && (
                                        <small className='text-red-500 text-[10px] md:text-[8px]'>{formik.errors.password}</small>
                                    )
                                }
                            </div>

                        </div>



                        <div className="flex justify-end text-sm">
                            <a
                                href="/forgot-password"
                                className="text-gray-600 hover:text-[#ED8F0C]"
                            >
                                Forgot password?
                            </a>
                        </div>



                        <button type='button' onClick={() => formik.handleSubmit()} className=" flex justify-center bg-[#ED8F0C] text-white p-3 rounded-md hover:opacity-90 transition">
                            {

                                isLoading ? (
                                    <FaSpinner className="text-lg animate-spin" />
                                ) : ' Sign In'

                            }
                        </button>



                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a
                                href="/createaccount"
                                className="text-[#ED8F0C] font-medium hover:underline"
                            >
                                Create account
                            </a>
                        </p>

                    </form>

                </div>

            </section>
            <Footer />
        </div>
    )
}

export default Page
