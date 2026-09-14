'use client'

import { useCart } from "@/app/context/contextProvider"
import { change_email, change_password } from "@/app/utils/action"
import ProfileNavbar from "@/components/ProfileNavbar"
import { useFormik } from "formik"
import * as yup from 'yup'
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import {  FaEye, FaEyeSlash, FaSpinner, FaTimes } from "react-icons/fa"
import { toast } from "react-toastify"
import Spinner from "@/components/Spinner"

const Page = () => {
    const { user_pro, vrfEmailOtp } = useCart()
    const [openeditPass, setopeneditPass] = useState(false)
    const [openeditEmail, setopeneditEmail] = useState(false)
    const [otpsent, setotpsent] = useState(false)
    const [showPassword, setshowPassword] = useState(false)
    const [disableEmaiinput, setdisableEmaiinput] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [isSpinner, setisSpinner] = useState(true)
    const router = useRouter()
   


    const confirmOtpFormik = useFormik({
        initialValues: {
            _id: '',
            newEmail: '',
            otp: ''
        },

        onSubmit: (values) => {
            startTransition(async () => {
                setdisableEmaiinput(true)

                const res = await vrfEmailOtp(values)

                if (!res.success) {
                    if (res.message === 'Unauthorized user detected!') {
                        toast.error(res.message, {
                            autoClose: 2000
                        })
                        router.push('/signin')
                        return
                    }
                    toast.error(res.message, {
                        autoClose: 2000
                    })
                    return
                }

                toast.success(res.message, {
                    autoClose: 2000
                })

                setotpsent(false)
                setdisableEmaiinput(false)
                setopeneditEmail(false)
            })
        },

        validationSchema: yup.object({
            _id: yup.string().required('User ID not found'),
            newEmail: yup.string().required('Email required'),
            otp: yup.string().required('Verification code required')
        })
    })

    const editEmailFormik = useFormik({
        initialValues: {
            _id: '',
            newEmail: ''
        },

        onSubmit: (values) => {
            startTransition(async () => {
                const res = await change_email({ ...values })

                if (!res.success) {
                    if (res.message === 'Unauthorized user detected') {
                        toast.error(res.message, {
                            autoClose: 2000
                        })
                        router.push('/signin')
                        return
                    }

                    toast.error(res.message, {
                        autoClose: 2000
                    })
                    return
                }

                toast.success(res.message, {
                    autoClose: 2000
                })


                confirmOtpFormik.setFieldValue('newEmail', values.newEmail)
                setotpsent(true)
                setdisableEmaiinput(true)
            })
        },

        validationSchema: yup.object({
            _id: yup.string().required("ID required"),
            newEmail: yup.string().required('New email required').email('input valid email')
        })
    })

    const changePassformik = useFormik({
        initialValues : {
            _id : '',
            password : '',
            newPassword : '',
            conNewpassword : ''
        }, 

        onSubmit : (values)=>{
            startTransition(async()=>{
                const res = await change_password(values)

                if(!res.success) {
                    if (res.message === 'Unauthorized user detected!') {
                        toast.error(res.message, {
                            autoClose : 2000
                        })
                        router.push('/signin')
                        return
                    }

                    toast.error(res.message, {
                        autoClose: 2000
                    })
                    return
                }

                toast.success(res.message, {
                    autoClose: 2000
                })

                changePassformik.resetForm({
                    values: {
                        _id: user_pro?._id.toString() ?? '',
                        password: '',
                        newPassword: '',
                        conNewpassword: ''
                    }
                })
                setshowPassword(false)
                setopeneditPass(false)
            })
        },

        validationSchema:yup.object({
            _id : yup.string().required('ID required'),
            password: yup.string().required('Password required'),
            newPassword: yup.string().required('Password required').min(8, 'Password must be at least 8 characters'),
            conNewpassword: yup.string().required("Required").oneOf([yup.ref('newPassword')], "Passwords mismatch")
        })

    })


    useEffect(() => {
        if (!user_pro) return

        changePassformik.setFieldValue('_id', user_pro._id.toString())
        editEmailFormik.setFieldValue('_id', user_pro._id.toString())
        confirmOtpFormik.setFieldValue('_id', user_pro._id.toString())

        setisSpinner(false)
    }, [user_pro])

    if (isSpinner) {
        return <>
            <div className='sticky top-0 w-full z-50'>
                <ProfileNavbar />
            </div>
            <Spinner />
        </>
    }
    return (
        <div className="min-h-screen bg-zinc-50">
            <div className='sticky top-0 w-full z-50'>
                <ProfileNavbar />
            </div>

            <section className="w-full px-5 py-8 md:px-10 md:py-10">

                {/* Page heading */}
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1F2933]">
                        Password & Security
                    </h1>

                    <p className="text-sm md:text-base text-gray-500 mt-2">
                        Manage your email address and password to keep your account secure.
                    </p>
                </div>


                {/* Security card */}
                <div className="max-w-5xl mx-auto mt-8 md:mt-10 border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden">

                    {/* Card header */}
                    <div className="px-5 py-5 md:px-8 border-b border-neutral-200">
                        <h3 className="font-semibold text-base md:text-lg text-[#1F2933]">
                            Account security
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Update your email address or change your password.
                        </p>
                    </div>


                    {/* Email */}
                    <div className="px-5 py-5 md:px-8 flex items-center justify-between gap-5 border-b border-neutral-200">

                        <div className="min-w-0">
                            <h3 className="text-base md:text-lg font-semibold text-[#1F2933]">
                                Email
                            </h3>

                            <p className="text-sm md:text-base text-gray-500 mt-1 break-all">
                                {user_pro?.email}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setopeneditEmail(true)}
                            className="shrink-0 text-sm font-medium text-[#ED8F0C] hover:text-[#c86f00] transition cursor-pointer"
                        >
                            Edit
                        </button>

                    </div>

                    <div className="px-5 py-5 md:px-8 flex items-center justify-between gap-5">

                        <div>
                            <h3 className="text-base md:text-lg font-semibold text-[#1F2933]">
                                Password
                            </h3>

                            <p className="text-sm md:text-base text-gray-500 mt-1 tracking-widest">
                                ••••••••••
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setopeneditPass(true)}
                            className="shrink-0 text-sm font-medium text-[#ED8F0C] hover:text-[#c86f00] transition cursor-pointer"
                        >
                            Edit
                        </button>

                    </div>

                </div>

            </section>


            <section
                className={`${openeditPass ? 'fixed' : 'hidden'
                    } inset-0 z-50 bg-black/50 px-4 flex items-center justify-center`}
            >
                <div className="w-full md:max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">

                    <div className="flex items-center justify-between px-5 md:px-7 py-5 border-b border-neutral-200">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-[#1F2933]">
                                Change password
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Update your password to keep your account secure.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setopeneditPass(false)}
                            className="size-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
                        >
                            <FaTimes className="text-lg text-gray-500" />
                        </button>
                    </div>


                    <form className="p-5 md:p-7">

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="currentpassword"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Current password
                                </label>

                                <div className="flex flex-col gap-1">
                                    <input
                                        onChange={changePassformik.handleChange}
                                        value={changePassformik.values.password}
                                        id="currentpassword"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your current password"
                                        className="w-full h-11 px-3 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition"
                                    />
                                    {
                                        changePassformik.errors.password && (
                                            <small className="text-red-500 text-sm tracking-tight">{changePassformik.errors.password}</small>
                                        )
                                    }
                                </div>
                            </div>

                           
                            <div>
                                <label
                                    htmlFor="newpassword"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    New password
                                </label>

                                <div className="flex flex-col gap-1">
                                    <div className="relative">
                                        <input
                                            onChange={changePassformik.handleChange}
                                            value={changePassformik.values.newPassword}
                                            id="newpassword"
                                            name="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your new password"
                                            className="w-full h-11 px-3 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setshowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {
                                        changePassformik.errors.newPassword && (
                                            <small className="text-red-500 text-sm tracking-tight">{changePassformik.errors.newPassword}</small>
                                        )
                                    }
                                </div>
                            </div>


                            <div>
                                <label
                                    htmlFor="confirmpassword"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Confirm new password
                                </label>

                               <div className="flex flex-col gap-1">
                                    <input
                                        onChange={changePassformik.handleChange}
                                        value={changePassformik.values.conNewpassword}
                                        id="confirmpassword"
                                        name="conNewpassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm your new password"
                                        className="w-full h-11 px-3 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition"
                                    />
                                    {
                                        changePassformik.errors.conNewpassword && (
                                            <small className="text-red-500 text-sm tracking-tight">{changePassformik.errors.conNewpassword}</small>
                                        )
                                    }
                               </div>
                            </div>

                        </div>


                       
                        <div className="flex gap-3 pt-6">

                            <button
                                type="button"
                                onClick={() => setopeneditPass(false)}
                                className="flex-1 h-11 rounded-lg border border-neutral-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={isPending}
                                onClick={() => changePassformik.handleSubmit()}
                                type="button"
                                className="flex-1 flex justify-center items-center h-11 rounded-lg bg-[#ED8F0C] text-white font-medium hover:bg-[#d77d00] transition cursor-pointer"
                            >
                                {
                                 isPending ? (<FaSpinner size={15} className="animate-spin"/>) : 'Change'
                                }
                            </button>

                        </div>

                    </form>

                </div>
            </section>

            {/* edit email section */}
            <section
                className={`${openeditEmail ? 'fixed' : 'hidden'
                    } inset-0 z-50 bg-black/50 px-4 flex items-center justify-center`}
            >
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 md:px-7 py-5 border-b border-neutral-200">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-[#1F2933]">
                                Change email address
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Verify your new email address before updating your account.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setopeneditEmail(false)}
                            className="size-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
                        >
                            <FaTimes className="text-lg text-gray-500" />
                        </button>
                    </div>


                    <div className="p-5 md:p-7">

                        <div className="space-y-4">

                            <div>
                                <label
                                    htmlFor="newemail"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    New email address
                                </label>

                                <div className="flex flex-col gap-1">
                                    <input
                                        disabled={disableEmaiinput}
                                        onChange={editEmailFormik.handleChange}
                                        value={editEmailFormik.values.newEmail}
                                        id="newemail"
                                        name="newEmail"
                                        type="email"
                                        placeholder="Enter your new email address"
                                        className={`${disableEmaiinput && 'bg-neutral-400 cursor-not-allowed'} w-full h-11 px-3 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition`}
                                    />
                                    {
                                        editEmailFormik.errors.newEmail && (
                                            <small className="text-sm text-red-500 tracking-tight">{editEmailFormik.errors.newEmail}</small>
                                        )
                                    }
                                </div>
                            </div>


                            {/* OTP */}
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Verification code
                                </label>

                                <div className={`${otpsent && 'flex flex-col'} flex gap-2`}>

                                    <div className="flex flex-col gap-1">
                                        <input
                                            onChange={confirmOtpFormik.handleChange}
                                            value={confirmOtpFormik.values.otp}
                                            disabled={!otpsent}
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            placeholder="Enter verification code"
                                            className={`${!otpsent && 'bg-neutral-400 cursor-not-allowed '} py-3 flex-1 h-11 px-3 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition`}
                                        />
                                        {
                                            confirmOtpFormik.errors.otp && otpsent &&(
                                                <small className="text-red-500 text-sm tracking-tight">{confirmOtpFormik.errors.otp}</small>
                                            )
                                        }
                                    </div>

                                    <button
                                        disabled={isPending}
                                        onClick={() => editEmailFormik.handleSubmit()}
                                        type="button"
                                        className={`${otpsent && 'hidden'} shrink-0 px-4 h-11 rounded-lg border border-[#ED8F0C] text-[#ED8F0C] font-medium hover:bg-[#ED8F0C]/10 transition cursor-pointer`}
                                    >
                                        {
                                            isPending ? (<FaSpinner size={15} className="animate-spin" />) : 'Send code'
                                        }
                                    </button>

                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    We'll send a verification code to your new email address.
                                </p>
                            </div>

                        </div>


                        {/* Actions */}
                        <div className="flex gap-3 pt-6">

                            <button
                                type="button"
                                onClick={() => setopeneditEmail(false)}
                                className="flex-1 h-11 rounded-lg border border-neutral-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={!otpsent || isPending}
                                onClick={()=>confirmOtpFormik.handleSubmit()}
                                type="button"
                                className={`${!otpsent && ' cursor-not-allowed opacity-60'} flex justify-center items-center flex-1 h-11 rounded-lg bg-[#ED8F0C] text-white font-medium hover:bg-[#d77d00] transition cursor-pointer`}
                            >
                                {
                                    isPending ? (<FaSpinner size={15} className="animate-spin" />) : 'Update email'
                                }
                            </button>

                        </div>

                    </div>

                </div>
            </section>
        </div>
    )
}

export default Page
