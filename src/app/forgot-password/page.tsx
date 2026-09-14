'use client'
import { confFgPassOtp, reqFgOtp } from '@/app/utils/action';
import Spinner from '@/components/Spinner';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import  { useEffect, useState, useTransition } from 'react'
import { toast } from 'react-toastify';
import * as yup from 'yup'

const Forgotpass = () => {
    const [confirmotp, setconfirmotp] = useState(false);
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [isSpinner, setisSpinner] = useState(true)

    useEffect(() => { setisSpinner(false) }, [])


    const formikemail = useFormik({
        initialValues: {
            email: '',
            newPassword: ''
        },
        onSubmit: (values) => {
            startTransition(async () => {
                const res = await reqFgOtp({ ...values })

                if (!res.success) {
                    setconfirmotp(false)
                    toast.error(res.message, {
                        autoClose: 2000
                    })
                    return;
                }

                formikotp.setFieldValue("email", values.email)
                formikotp.setFieldValue("newPassword", values.newPassword)
                setconfirmotp(true)
                toast.success(res.message, {
                    autoClose: 2000
                })
            })
        },

        validationSchema: yup.object({
            email: yup.string().required("Required").email("Enter a valid email"),
            newPassword: yup.string().required("New password is required").min(8, "Password must be at least 8 characters")
        })
    });

    const formikotp = useFormik({
        initialValues: {
            newPassword: '',
            email: '',
            otp: ''
        },
        onSubmit: (values) => {
            startTransition(async () => {
                const res = await confFgPassOtp(values)

                if (!res.success) {
                    toast.error(res.message, {
                        autoClose: 2000
                    })
                    return;
                }

                toast.success(res.message, {
                    autoClose: 2000
                })
                router.push(`/signin`)
            })
        },

        validationSchema: yup.object({
            newPassword: yup.string().required(),
            email: yup.string().required(),
            otp: yup.string().required("Confirm otp")
        })
    })

    if (isSpinner) {
        return <>
            <Spinner />
        </>
    }
    
    return (
        <div>


            <section className=" lg:w-xl md:w-[70%] w-full  px-5 flex flex-col justify-center m-auto mt-5">
                <h1 className="lg:text-3xl md:text-4xl text-3xl tracking-tight text-center text-[#262262]">Forgot your password?</h1>
                <p className='text-center lg:text-2xl md:text-[20px] text-lg mt-3'>We'll email you an otp to reset it.</p>
                <input
                    disabled={confirmotp}
                    className={`${formikemail.errors.email && formikemail.touched.email ? 'border-red-600 ' : 'border-neutral-300 hover:border-[#ED8F0C]'} lg:h-12 md:h-14 h-12 md:text-[17px] text-[17px] lg:text-sm px-2 outline-0 border  rounded-sm mt-5 `}
                    placeholder="Email address"
                    name="email"
                    type="text"
                    onChange={formikemail.handleChange}
                />
                {
                    formikemail.errors.email && formikemail.touched.email && (
                        <small className='text-red-600 text-[15px] lg:text-[14px] md:text-[17px]'>{formikemail.errors.email}</small>
                    )
                }

                <input
                    disabled={confirmotp}
                    className={`${formikemail.errors.newPassword && formikemail.touched.newPassword ? 'border-red-600 ' : 'border-neutral-300 hover:border-[#ED8F0C]'} lg:h-12 md:h-14 h-12 md:text-[17px] text-[17px] lg:text-sm px-2 outline-0 border  rounded-sm mt-5 `}
                    placeholder="New password"
                    name="newPassword"
                    type="password"
                    onChange={formikemail.handleChange}
                />
                {
                    formikemail.errors.newPassword && formikemail.touched.newPassword && (
                        <small className='text-red-600 text-[15px] lg:text-[14px] md:text-[17px]'>{formikemail.errors.newPassword}</small>
                    )
                }

                <input
                    className={`${formikotp.errors.otp && formikotp.touched.otp ? 'border-red-600 ' : 'border-neutral-300 hover:border-[#3921D7]'} ${confirmotp ? 'block' : "hidden"} lg:h-12 md:h-14 h-12 md:text-[17px] text-[17px] lg:text-sm px-2 outline-0 border  rounded-sm mt-5 `}
                    placeholder="Otp"
                    name="otp"
                    type="text"
                    onChange={formikotp.handleChange}
                />
                {
                    formikotp.errors.otp && formikotp.touched.otp && (
                        <small className='text-red-600 text-[15px] lg:text-[14px] md:text-[17px]'>{formikotp.errors.otp}</small>
                    )
                }

                <div className="flex justify-end-safe h-fit items-center pl-auto gap-2 mt-3">
                    <Link href='/signin'>
                        <button className="lg:text-[17px] md:text-[20px] text-[20px] lg:py-3 lg:px-7 md:py-4 md:px-8  py-3 px-6.5  text-[#ED8F0C] font-semibold bg-transparent hover:bg-[#F4F4F5] rounded-3xl cursor-pointer transition-all duration-300">Cancel</button>
                    </Link>

                    {/* confirm email button */}
                    <button type='button' onClick={() => formikemail.handleSubmit()} className={`lg:text-[17px] md:text-[20px] text-[20px] lg:py-3 lg:px-7 md:py-4 md:px-8 py-3 px-6.5  text-white font-semibold bg-[#ED8F0C] hover:bg-[#805d2b] rounded-3xl cursor-pointer transition-all duration-300 ${confirmotp ? 'hidden' : 'block'}`}>{
                        isPending ? "sending..." : "Send otp"
                    }</button>

                    {/* confirm otp button */}

                    <button type='button' onClick={() => formikotp.handleSubmit()} className={`lg:text-[17px] md:text-[20px] text-[20px] lg:py-3 lg:px-7 md:py-4 md:px-8 py-3 px-6.5  text-white font-semibold bg-[#ED8F0C] hover:bg-[#482e0a] rounded-3xl cursor-pointer transition-all duration-300 ${confirmotp ? 'block' : 'hidden'}`}>{
                        isPending ? "Updating..." : "Update"
                    }</button>


                </div>
            </section>

        </div>
    )
}

export default Forgotpass
