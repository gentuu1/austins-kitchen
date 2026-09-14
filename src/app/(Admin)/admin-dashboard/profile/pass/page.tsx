"use client"
import { Anton } from "next/font/google"
import { FaEye, FaEyeSlash, FaTimes, FaSpinner } from "react-icons/fa"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useFormik } from "formik"
import * as yup from 'yup'
import { changeadmin_Password } from "@/app/utils/action"
import { toast } from "react-toastify"
const anton = Anton({ subsets: ['latin'], weight: '400' })

const EditpassWord = () => {
    const [showPassword, setshowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

     const formik = useFormik({
        initialValues : {
            currentPassword : '',
            newPassword : '',
            confirmPassword : '',
        }, 

        onSubmit : (values)=>{
            startTransition(async()=>{
                const res = await changeadmin_Password(values);

                if(!res.success) {
                    toast.error(res.message, {
                        autoClose : 2000
                    })
                    return
                }

                toast.success(res.message, {
                    autoClose : 2000
                })
                router.push('/admin-dashboard/profile')
                return
            })
        },

        validationSchema : yup.object({
            currentPassword : yup.string().required("Password is required"),
            newPassword : yup.string().required('New password is required').min(8, 'Password must be at least 8 characters'),
            confirmPassword: yup.string().required('Confirm password').oneOf([yup.ref('newPassword')], 'Passwords mismatch')
        })
     })    
    return (
        
        <div className="min-h-screen bg-zinc-50 px-5 py-8 md:px-10 md:py-10">

            {/* Header */}
            <div className="w-full max-w-2xl mx-auto">

                <div className="flex items-center justify-between mb-7">

                    <div>
                        <h1 className={`${anton.className} text-2xl md:text-3xl text-gray-900`}>
                            Change password
                        </h1>

                        <p className="text-sm md:text-base text-gray-500 mt-1">
                            Update your password to keep your account secure.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/admin-dashboard/profile')}
                        type="button"
                        className="size-9 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition cursor-pointer"
                    >
                        <FaTimes className="text-lg text-gray-500" />
                    </button>

                </div>


                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 md:p-7">

                    <div className="space-y-4">

                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Current password
                            </label>

                            <div className="flex flex-col gap-1">
                                <input
                                    onChange={formik.handleChange}
                                    value={formik.values.currentPassword}
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    placeholder="Enter your current password"
                                    className="w-full h-11 px-3 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition"
                                />
                                {
                                    formik.errors.currentPassword && (
                                        <small className="text-red-500 text-sm tracking-tight">{formik.errors.currentPassword}</small>
                                    )
                                }
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                New password
                            </label>

                            <div className="flex flex-col gap-1">
                                <div className="relative">

                                    <input
                                        onChange={formik.handleChange}
                                        value={formik.values.newPassword}
                                        id="newPassword"
                                        name="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your new password"
                                        className="w-full h-11 px-3 pr-10 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setshowPassword(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                    >
                                        {showPassword
                                            ? <FaEyeSlash />
                                            : <FaEye />
                                        }
                                    </button>

                                </div>
                                {
                                    formik.errors.newPassword && (
                                        <small className="text-red-500 text-sm tracking-tight">{formik.errors.newPassword}</small>
                                    )
                                }
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Confirm new password
                            </label>

                            <div className="flex flex-col gap-1">
                                <input
                                    onChange={formik.handleChange}
                                    value={formik.values.confirmPassword}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm your new password"
                                    className="w-full h-11 px-3 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition"
                                />
                                {
                                    formik.errors.confirmPassword && (
                                        <small className="text-red-500 text-sm tracking-tight">{formik.errors.confirmPassword}</small>
                                    )
                                }
                            </div>
                        </div>

                    </div>


                    {/* Buttons */}
                    <div className="flex gap-3 pt-6">

                        <button
                            onClick={() => router.push('/admin-dashboard/profile')}
                            type="button"
                            className="flex-1 h-11 rounded-lg border border-neutral-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={isPending}
                            type="submit"
                            className="flex-1 h-11 rounded-lg bg-[#ED8F0C] text-white font-medium hover:bg-[#d77d00] transition cursor-pointer flex items-center justify-center"
                        >
                            {isPending ? (
                                <FaSpinner size={15} className="animate-spin" />
                            ) : (
                                'Change'
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default EditpassWord