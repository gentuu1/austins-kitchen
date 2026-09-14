'use client'

import { ChangeEvent, useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import { MdEdit, MdEmail, MdPhone, MdLockOutline, MdKeyboardArrowRight, MdNotificationsNone, MdDelete, MdLogout, MdClose, MdImage } from 'react-icons/md'
import { FaRegUser, FaSearch, FaSpinner } from 'react-icons/fa'
import { Anton } from 'next/font/google'
import { admin_profile, deladmin_ProfilePic, deleteAdmin_account, editAdmin_Profile, signOut } from '@/app/utils/action'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/Spinner'
import { useFormik } from 'formik'
import * as yup from 'yup'
const anton = Anton({ subsets: ['latin'], weight: '400', })

const Page = () => {

    interface ad_Min {
        _id: string
        firstName: string
        lastName: string
        email: string,
        role: string,
        profilePic: string,
        phoneNumber: string
    }
    const [editPro, seteditPro] = useState(false)
    const [orderNotifications, setOrderNotifications] = useState(true)
    const [openDelete, setopenDelete] = useState(false)
    const [isSpinner, setisSpinner] = useState(true)
    const [prev, setprev] = useState('')
    const [openRemove, setopenRemove] = useState(false)
    const [profile, setprofile] = useState<ad_Min | null>(null)
    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const adminPro = async () => {
        const res = await admin_profile()

        if (!res.success) {
            if (res.message === "You're not allowed!" || res.message === 'Account not found') {
                toast.error(res.message, {
                    autoClose: 2000
                })
                router.push('/signin')
                setisSpinner(false)
                return
            }
            toast.error(res.message, {
                autoClose: 2000
            })
            setisSpinner(false)
            return
        }

        setprofile(res.user || null)
        setisSpinner(false)

    }

    useEffect(() => {
        adminPro()
        setisSpinner(false)
    }, [])


    const editAdminFormik = useFormik({
        initialValues: {
            _id: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            profilePic: ''
        },

        onSubmit: (values) => {
            startTransition(async () => {
                const res = await editAdmin_Profile(values)

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
                    router.push('/signin')
                    return
                }

                toast.success(res.message, {
                    autoClose: 2000
                })
                await adminPro()
                seteditPro(false)
                return
            })
        },

        validationSchema: yup.object({
            _id: yup.string().required('ID not found'),
            firstName: yup.string().required('First name is required'),
            lastName: yup.string().required('last name is required'),
        })
    })



    useEffect(() => {
        if (!profile) return;

        setprev(profile.profilePic || '')

        editAdminFormik.setValues({
            _id: profile._id.toString() || '',
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phoneNumber: profile.phoneNumber || '',
            profilePic: profile.profilePic || ''
        })

    }, [profile])

    const handleEditImg = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            setprev(profile?.profilePic ? profile?.profilePic : '')
            editAdminFormik.setFieldValue("profilePic", profile?.profilePic)
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const image = reader.result as string
            setprev(image)
            editAdminFormik.setFieldValue("profilePic", image)
        }

        reader.readAsDataURL(file)
    }

    const del_profilepic = (id: string) => {
        startTransition(async () => {
            const res = await deladmin_ProfilePic(id)

            if (!res.success) {
                if (res.message === 'Unauthorized user detected!') {
                    toast.error(res.message, {
                        autoClose: 2000
                    })
                    router.push('/signin')
                    return;
                }

                toast.error(res.message, {
                    autoClose: 2000
                })
                return;
            }

            toast.success(res.message, {
                autoClose: 2000
            })
            await adminPro()
            setopenRemove(false)
            return;
        })
    }

    const logout = async () => {
        const res = await signOut()

        if (!res.success) {
            toast.error(res.message, {
                autoClose: 1500
            })

            return;
        }

        toast.success(res.message, {
            autoClose: 1500
        })
        router.push('/signin')
    }

    const delete_account = async()=>{
        startTransition(async()=>{
            const res = await deleteAdmin_account()
            if(!res.success) {
                toast.error(res.message, {
                    autoClose : 2000
                })
                return
            }

            toast.success(res.message, {
                autoClose : 2000
            })
            router.push('/signin')
        })
    }

    if (isSpinner) {
        return (
            <>
                <Spinner />
            </>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 px-4 py-6 md:px-7 lg:px-10">

            <div className="mb-7">
                <h1 className={`${anton.className} text-3xl text-gray-900`}>
                    Admin Profile
                </h1>
            </div>


            <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">

                <div className=" p-5 md:p-7">

                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                        <div className="flex items-center gap-4">

                            <div className="relative">

                                {/* Profile image */}
                                <div
                                    onClick={() => setopenRemove(prev => !prev)}
                                    className="relative flex size-20 overflow-hidden rounded-full bg-orange-100 cursor-pointer"
                                >
                                    <Image
                                        src={profile?.profilePic || "/img/profileimage.jpg"}
                                        alt="Admin profile"
                                        loading="eager"
                                        height={300}
                                        width={300}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Remove button */}
                                {openRemove && profile?.profilePic && (
                                    <button
                                        disabled={isPending}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            del_profilepic(profile!._id.toString())
                                        }}
                                        className="cursor-pointer absolute left-1 mt-2 z-50 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-lg font-medium text-red-600 shadow-lg transition hover:border-red-400 hover:bg-red-50 hover:text-red-700 whitespace-nowrap"
                                    >
                                        {
                                            isPending ? <FaSpinner className="text-lg animate-spin" /> : <MdDelete className="text-lg" />
                                        }
                                        Remove
                                    </button>
                                )}

                            </div>


                            {/* NAME */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                                    {profile?.firstName} {profile?.lastName}
                                </h2>

                                <div className="mt-2 inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-[#ED8F0C]">
                                    {profile?.role}
                                </div>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() => seteditPro(true)}
                            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            <MdEdit />
                            Edit Profile
                        </button>

                    </div>

                </div>

                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-7">

                    <div className="flex items-center gap-4">
                        <div className="flex size-11 items-center justify-center rounded-full bg-gray-100">
                            <MdEmail className="text-xl text-gray-600" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">
                                Email Address
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-800 break-all">
                                {profile?.email}
                            </p>
                        </div>
                    </div>


                    <div className="flex items-center gap-4">
                        <div className="flex size-11 items-center justify-center rounded-full bg-gray-100">
                            <MdPhone className="text-xl text-gray-600" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">
                                Phone Number
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-800">
                                {profile?.phoneNumber || '000 0000 000'}
                            </p>
                        </div>
                    </div>

                </div>

            </section>


            <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">

                <div className="border-b border-gray-100 p-5 md:p-7">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Account & Security
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your account security and login settings.
                    </p>
                </div>


                <div>
                    <button
                        onClick={() => router.push('/admin-dashboard/profile/landing_images')}
                        type="button"
                        className="cursor-pointer flex w-full items-center justify-between border-b border-gray-100 px-5 py-5 transition hover:bg-gray-50 md:px-7"
                    >
                        <div className="flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-orange-50">
                                <MdImage className="text-xl text-[#ED8F0C]" />
                            </div>

                            <div className="text-left">
                                <p className="text-sm font-semibold text-gray-800">
                                    Landing Page Images
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Change images displayed on the landing page
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-gray-400" />

                    </button>

                    <button
                        onClick={() => router.push('/admin-dashboard/profile/pass')}
                        type="button"
                        className="cursor-pointer flex w-full items-center justify-between border-b border-gray-100 px-5 py-5  transition hover:bg-gray-50 md:px-7"
                    >

                        <div className="flex items-center gap-4 text-left">

                            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
                                <MdLockOutline className="text-xl text-gray-600" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    Change Password
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Update your account password
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-gray-400" />

                    </button>


                    <button
                        onClick={() => router.push('/admin-dashboard/profile/change_email')}
                        type="button"
                        className="cursor-pointer flex w-full items-center justify-between border-b border-gray-100 px-5 py-5  transition hover:bg-gray-50 md:px-7"
                    >

                        <div className="text-left flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
                                <MdEmail className="text-xl text-gray-600" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    Change Email
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Change  your account email
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-gray-400" />

                    </button>


                    <button
                        onClick={logout}
                        type="button"
                        className="cursor-pointer flex w-full items-center justify-between px-5 py-5 transition hover:bg-red-50 md:px-7"
                    >

                        <div className="text-left flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-red-50 ">
                                <MdLogout className="text-xl  text-red-500" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-red-500">
                                    Sign Out
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Sign out of your admin account
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-red-400" />

                    </button>

                </div>

            </section>

            {/* PREFERENCES */}
            <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">

                <div className="border-b  border-gray-100 p-5 md:p-7">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Preferences
                    </h2>

                </div>


                <div>

                    {/* ORDER NOTIFICATIONS */}
                    <div className="flex items-center justify-between px-5 py-5 md:px-7">

                        <div className="flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-orange-50">
                                <MdNotificationsNone className="text-xl text-[#ED8F0C]" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    Order Notifications
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Get notified when a new order is placed
                                </p>
                            </div>

                        </div>


                        {/* TOGGLE */}
                        <button
                            type="button"
                            onClick={() =>
                                setOrderNotifications(prev => !prev)
                            }
                            className={`relative h-6 w-11 shrink-0 rounded-full transition ${orderNotifications
                                ? 'bg-[#ED8F0C]'
                                : 'bg-gray-300'
                                }`}
                        >

                            <span
                                className={`absolute top-1 size-4 rounded-full bg-white shadow transition ${orderNotifications
                                    ? 'left-6'
                                    : 'left-1'
                                    }`}
                            />

                        </button>

                    </div>

                </div>

            </section>




            <section className="mb-8 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">

                <div className="border-b border-red-100 p-5 md:p-7">

                    <h2 className="text-lg font-semibold text-red-500">
                        Danger Zone
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Actions here can affect your admin account.
                    </p>

                </div>


                <div>


                    <button
                        type="button"
                        onClick={() => setopenDelete(true)}
                        className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-red-50 md:px-7"
                    >

                        <div className="flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-red-50">
                                <MdDelete className="text-xl text-red-500" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-red-500">
                                    Delete Admin Account
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Permanently remove this administrator account
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-red-400" />

                    </button>

                </div>

            </section>



            {/* EDIT PROFILE MODAL */}
            <div
                className={`${editPro ? 'flex' : 'hidden'
                    } fixed inset-0 z-50 items-center justify-center bg-black/50 px-4`}
            >

                <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit Profile
                        </h2>

                        <button
                            type="button"
                            onClick={() => seteditPro(false)}
                            className="flex size-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                        >
                            <MdClose className="text-xl" />
                        </button>

                    </div>


                    <div className="flex justify-center my-5">

                        <div className="relative">
                            <input type="file" onChange={handleEditImg} id="profilePi" className='hidden' />

                            <div className="size-24 rounded-full overflow-hidden border border-neutral-200">
                                <Image
                                    src={prev || "/img/profileimage.jpg"}
                                    alt="Profile"
                                    loading='eager'
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <label
                                htmlFor="profilePi"
                                className="absolute bottom-0 right-0 size-8 rounded-full bg-[#ED8F0C] text-white flex items-center justify-center border-2 border-white cursor-pointer"
                            >
                                <MdEdit />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4 p-5">

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                First Name
                            </label>

                            <div className='flex flex-col gap-1'>
                                <input
                                    onChange={editAdminFormik.handleChange}
                                    value={editAdminFormik.values.firstName}
                                    name='firstName'
                                    type="text"
                                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    editAdminFormik.errors.firstName && (
                                        <small className='text-red-500 tracking-tight text-sm'>{editAdminFormik.errors.firstName}</small>
                                    )
                                }
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Last Name
                            </label>

                            <div className='flex flex-col gap-1'>
                                <input
                                    onChange={editAdminFormik.handleChange}
                                    value={editAdminFormik.values.lastName}
                                    name='lastName'
                                    type="text"
                                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    editAdminFormik.errors.lastName && (
                                        <small className='text-red-500 tracking-tight text-sm'>{editAdminFormik.errors.lastName}</small>
                                    )
                                }
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>

                            <input
                                onChange={editAdminFormik.handleChange}
                                value={editAdminFormik.values.phoneNumber}
                                name='phoneNumber'
                                type="number"
                                className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#ED8F0C]"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">

                            <button
                                type="button"
                                onClick={() => seteditPro(false)}
                                className="h-11 flex-1 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={isPending}
                                onClick={() => editAdminFormik.handleSubmit()}
                                type="button"
                                className="h-11 flex-1 flex justify-center items-center rounded-xl bg-[#ED8F0C] px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
                            >
                                {
                                    isPending ? (<FaSpinner size={15} className='animate-spin' />) : 'Save changes'
                                }
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* DELETE MODAL */}
            <div className={`${openDelete ? 'fixed' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4`}>

                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7">

                    <div className="mb-5 text-center">
                        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                            <span className="text-2xl text-[#C91737]">!</span>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            Delete Account
                        </h2>
                    </div>

                    <div className="mb-4 text-center">
                        <p className="md:text-sm leading-6 text-gray-600 sm:text-base">
                            Are you sure you want to delete admin account?
                        </p>

                        <p className="text-sm font-semibold text-[#C91737]">
                            This action cannot be undone.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row">

                        <button
                            type="button"
                            onClick={() => setopenDelete(false)}
                            className="h-11 py-3 flex-1 rounded-xl bg-gray-100 px-4 font-semibold cursor-pointer text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={delete_account}
                            type="button"
                            className="h-11 py-3 flex items-center justify-center flex-1 rounded-xl bg-[#C91737] hover:bg-[#dd546e] cursor-pointer px-4 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? (<FaSpinner size={15} className='animate-spin' />) : "Delete Account"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Page