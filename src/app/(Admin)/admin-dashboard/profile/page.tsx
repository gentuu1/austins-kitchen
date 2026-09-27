'use client'

import { ChangeEvent, useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import { MdEdit, MdEmail, MdPhone, MdLockOutline, MdKeyboardArrowRight, MdNotificationsNone, MdDelete, MdLogout, MdClose, MdImage, MdStorefront, MdLocationOn, MdAccessTime } from 'react-icons/md'
import { FaRegUser, FaSearch, FaSpinner } from 'react-icons/fa'
import { Anton } from 'next/font/google'
import { admin_profile, deladmin_ProfilePic, deleteAdmin_account, edit_businessInfo, editAdmin_Profile, fetch_businessInfo, signOut } from '@/app/utils/action'
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

    interface edit_bsInfo {
        businessPhone: string,
        businessEmail: string,
        businessAddress: {
            address: string,
            town: string,
            state: string
        },
        openingFrom : string,
        openingTo : string
    }

    const [editPro, seteditPro] = useState(false)
    const [orderNotifications, setOrderNotifications] = useState(true)
    const [openDelete, setopenDelete] = useState(false)
    const [editInfo, seteditInfo] = useState(false)
    const [isSpinner, setisSpinner] = useState(true)
    const [prev, setprev] = useState('')
    const [openRemove, setopenRemove] = useState(false)
    const [profile, setprofile] = useState<ad_Min | null>(null)
    const [informations, setinformations] = useState<edit_bsInfo | null>(null)
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

    const editBusinessInfoFormik = useFormik({
        initialValues : {
            businessPhone :'',
            businessEmail : '',
            address : '',
            town : '',
            state : '',
            openingFrom : '',
            openingTo : ''
        }, 

        onSubmit : (values)=>{
            startTransition(async ()=>{
                const res = await edit_businessInfo(values)

                if(!res.success) {
                    toast.error(res.message, {
                        autoClose : 2000
                    })
                    return
                }

                await adminPro()
                toast.success(res.message, {
                    autoClose : 2000
                })
                seteditInfo(false)
            })
        },

        validationSchema:yup.object({
            businessPhone: yup.string().required('Required'),
            businessEmail: yup.string().required('Required'),
            address: yup.string().required('Required'),
            town: yup.string().required('Required'),
            state: yup.string().required('Required'),
            openingFrom: yup.string().required('Required'),
            openingTo: yup.string().required('Required')
        })
    })

    useEffect(()=>{
        const fetch = async()=>{

            const res = await fetch_businessInfo()

            if (!res.success) {
                toast.success(res.message, {
                    autoClose : 2000
                })
                return
            }

            editBusinessInfoFormik.setValues({
                businessPhone: res.info?.businessPhone,
                businessEmail: res.info?.businessEmail,
                address: res.info?.businessAddress.address,
                town: res.info?.businessAddress.town,
                state: res.info?.businessAddress.state,
                openingFrom : res.info?.openingFrom,
                openingTo : res.info?.openingTo
            })
            setinformations(res.info || null)
        }

        fetch()
    }, [])

    if (isSpinner) {
        return (
            <>
                <Spinner />
            </>
        )
    }

    return (
        <div className="min-h-screen px-4 py-6 md:px-7 lg:px-10">

            <div className="mb-7">
                <h1 className={`${anton.className} text-3xl text-gray-900 dark:text-[#D2D3DB]`}>
                    Admin Profile
                </h1>
            </div>


            <section className="mb-6 overflow-hidden rounded-2xl bg-white dark:bg-[#1A1C22] shadow-sm">

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
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                                    {profile?.firstName} {profile?.lastName}
                                </h2>

                                <div className="mt-2 inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950/40 px-3 py-1 text-xs font-medium text-[#ED8F0C]">
                                    {profile?.role}
                                </div>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() => seteditPro(true)}
                            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 px-4 text-sm font-semibold text-gray-700 dark:gray-200 transition hover:bg-gray-50 dark:hover:bg-slate-800"
                        >
                            <MdEdit />
                            Edit Profile
                        </button>

                    </div>

                </div>

                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-7">

                    <div className="flex items-center gap-4">
                        <div className="flex size-11 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                            <MdEmail className="text-xl text-gray-600 dark:text-gray-300" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">
                                Email Address
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-300 break-all">
                                {profile?.email}
                            </p>
                        </div>
                    </div>


                    <div className="flex items-center gap-4">
                        <div className="flex size-11 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                            <MdPhone className="text-xl text-gray-600 dark:text-gray-300" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">
                                Phone Number
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-300">
                                {profile?.phoneNumber || '000 0000 000'}
                            </p>
                        </div>
                    </div>

                </div>

            </section>


            <section className="mb-6 overflow-hidden rounded-2xl bg-white dark:bg-[#1A1C22] shadow-sm">

                <div className="border-b border-gray-100 dark:border-gray-700 p-5 md:p-7">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Account & Security
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                        Manage your account security and login settings.
                    </p>
                </div>


                <div>
                    <button
                        onClick={() => router.push('/admin-dashboard/profile/landing_images')}
                        type="button"
                        className="cursor-pointer flex w-full items-center justify-between border-b border-gray-100 dark:border-gray-700 px-5 py-5 transition hover:bg-gray-50 dark:hover:bg-gray-800 md:px-7"
                    >
                        <div className="flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/90">
                                <MdImage className="text-xl text-[#ED8F0C] " />
                            </div>

                            <div className="text-left">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Landing Page Images
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Change images displayed on the landing page
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-gray-400" />

                    </button>

                    <button
                        onClick={() => router.push('/admin-dashboard/profile/pass')}
                        type="button"
                        className="cursor-pointer flex w-full items-center justify-between border-b border-gray-100 dark:border-gray-700 px-5 py-5  transition hover:bg-gray-50 dark:hover:bg-gray-800 md:px-7"
                    >

                        <div className="flex items-center gap-4 text-left">

                            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                <MdLockOutline className="text-xl text-gray-600 dark:text-gray-300" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Change Password
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Update your account password
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-gray-400" />

                    </button>


                    <button
                        onClick={() => router.push('/admin-dashboard/profile/change_email')}
                        type="button"
                        className="cursor-pointer flex w-full items-center justify-between border-b border-gray-100 dark:border-gray-700 px-5 py-5  transition hover:bg-gray-50 dark:hover:bg-gray-800 md:px-7"
                    >

                        <div className="text-left flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                <MdEmail className="text-xl text-gray-600 dark:text-gray-300" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Change Email
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Change  your account email
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-gray-400" />

                    </button>


                    <button
                        onClick={logout}
                        type="button"
                        className="cursor-pointer flex w-full items-center justify-between px-5 py-5 transition hover:bg-red-50 dark:hover:bg-red-950/30 md:px-7"
                    >

                        <div className="text-left flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-red-50  dark:bg-red-300/70 ">
                                <MdLogout className="text-xl  text-red-500" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-red-500">
                                    Sign Out
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Sign out of your admin account
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-red-400" />

                    </button>

                </div>

            </section>

            <section className="mb-6 overflow-hidden rounded-2xl dark:bg-[#1A1C22] bg-white shadow-sm">

                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-700 md:flex-row sm:items-center md:justify-between md:p-7">

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Information
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage your public information.
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={() => seteditInfo(true)}
                        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <MdEdit />
                        Edit
                    </button>

                </div>


                <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 md:p-7 lg:grid-cols-3">

                    {/* PHONE */}
                    <div className="flex items-start gap-4">

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/30">
                            <MdPhone className="text-xl text-[#ED8F0C]" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Business Phone
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {informations?.businessPhone}
                            </p>
                        </div>

                    </div>


                    {/* EMAIL */}
                    <div className="flex items-start gap-4">

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/30">
                            <MdEmail className="text-xl text-[#ED8F0C]" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Business Email
                            </p>

                            <p className="mt-1 break-all text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {informations?.businessEmail}
                            </p>
                        </div>

                    </div>


                    <div className="flex items-start gap-4">

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/30">
                            <MdLocationOn className="text-xl text-[#ED8F0C]" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Address
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200 break-all">
                                {`${informations?.businessAddress.address}, ${informations?.businessAddress.town}, ${informations?.businessAddress.state}`}
                            </p>
                        </div>

                    </div>


                    {/* OPENING HOURS */}
                    <div className="flex items-start gap-4">

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/30">
                            <MdAccessTime className="text-xl text-[#ED8F0C]" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Opening Hours
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase">
                                {informations?.openingFrom} - {informations?.openingTo}
                            </p>
                        </div>

                    </div>

                </div>

            </section>

            {/* PREFERENCES */}
            <section className="mb-6 overflow-hidden rounded-2xl bg-white dark:bg-[#1A1C22] shadow-sm">

                <div className="border-b  border-gray-100 dark:border-gray-700 p-5 md:p-7">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Preferences
                    </h2>

                </div>


                <div>

                    {/* ORDER NOTIFICATIONS */}
                    <div className="flex items-center justify-between px-5 py-5 md:px-7">

                        <div className="flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/30">
                                <MdNotificationsNone className="text-xl text-[#ED8F0C]" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Order Notifications
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
                                : 'bg-gray-300 dark:bg-gray-600'
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




            <section className="mb-8 overflow-hidden rounded-2xl border border-red-100 dark:border-red-950/60 bg-white dark:bg-[#1A1C22]  shadow-sm">

                <div className="border-b border-red-100 dark:border-red-950/60 p-5 md:p-7">

                    <h2 className="text-lg font-semibold text-red-500">
                        Danger Zone
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Actions here can affect your admin account.
                    </p>    

                </div>


                <div>


                    <button
                        type="button"
                        onClick={() => setopenDelete(true)}
                        className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-red-50 dark:hover:bg-red-950/30 md:px-7 cursor-pointer"
                    >

                        <div className="flex items-center gap-4">

                            <div className="flex size-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
                                <MdDelete className="text-xl text-red-500" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-red-500">
                                    Delete Admin Account
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Permanently remove this administrator account
                                </p>
                            </div>

                        </div>

                        <MdKeyboardArrowRight className="text-xl text-red-400" />

                    </button>

                </div>

            </section>



          
            <div className={`${editPro ? 'flex' : 'hidden'
                    } fixed inset-0 z-50 items-center justify-center bg-black/50 px-4`}
            >

                <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#1A1C22] shadow-2xl">

                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-5 py-4">

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Edit Profile
                        </h2>

                        <button
                            type="button"
                            onClick={() => seteditPro(false)}
                            className="flex size-9 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
                        >
                            <MdClose className="text-xl" />
                        </button>

                    </div>


                    <div className="flex justify-center my-5">

                        <div className="relative">
                            <input type="file" onChange={handleEditImg} id="profilePi" className='hidden' />

                            <div className="size-24 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-500">
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
                                className="absolute bottom-0 right-0 size-8 rounded-full bg-[#ED8F0C] text-white flex items-center justify-center border-2 border-white dark:border-gray-400 cursor-pointer"
                            >
                                <MdEdit />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4 p-5">

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                First Name
                            </label>

                            <div className='flex flex-col gap-1'>
                                <input
                                    onChange={editAdminFormik.handleChange}
                                    value={editAdminFormik.values.firstName}
                                    name='firstName'
                                    type="text"
                                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    editAdminFormik.errors.firstName && (
                                        <small className='text-red-500 tracking-tight text-sm'>{editAdminFormik.errors.firstName}</small>
                                    )
                                }
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Last Name
                            </label>

                            <div className='flex flex-col gap-1'>
                                <input
                                    onChange={editAdminFormik.handleChange}
                                    value={editAdminFormik.values.lastName}
                                    name='lastName'
                                    type="text"
                                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    editAdminFormik.errors.lastName && (
                                        <small className='text-red-500 tracking-tight text-sm'>{editAdminFormik.errors.lastName}</small>
                                    )
                                }
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number
                            </label>

                            <input
                                onChange={editAdminFormik.handleChange}
                                value={editAdminFormik.values.phoneNumber}
                                name='phoneNumber'
                                type="number"
                                className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">

                            <button
                                type="button"
                                onClick={() => seteditPro(false)}
                                className="h-11 flex-1 rounded-xl bg-gray-100 dark:bg-gray-600 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 dark:hover:bg-gray-500 transition hover:bg-gray-200"
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

            <div className={`${editInfo ? 'flex' : 'hidden'
                    } fixed inset-0 z-50 items-center justify-center bg-black/50 px-4`}
            >

                <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#1A1C22] shadow-2xl">

                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-5 py-4">

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Edit Information
                        </h2>

                        <button
                            type="button"
                            onClick={() => seteditInfo(false)}
                            className="flex size-9 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
                        >
                            <MdClose className="text-xl" />
                        </button>

                    </div>


                    <div className="space-y-4 p-5">

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Business phone
                            </label>

                            <div className='flex flex-col gap-1'>
                                <input
                                    onChange={editBusinessInfoFormik.handleChange}
                                    value={editBusinessInfoFormik.values.businessPhone}
                                    name='businessPhone'
                                    type="tel"
                                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    editBusinessInfoFormik.errors.businessPhone && (
                                        <small className='text-red-500 tracking-tight text-sm'>{editBusinessInfoFormik.errors.businessPhone}</small>
                                    )
                                }
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Business email
                            </label>

                            <div className='flex flex-col gap-1'>
                                <input
                                    onChange={editBusinessInfoFormik.handleChange}
                                    value={editBusinessInfoFormik.values.businessEmail}
                                    name='businessEmail'
                                    type='email'
                                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                />
                                {
                                    editBusinessInfoFormik.errors.businessEmail && (
                                        <small className='text-red-500 tracking-tight text-sm'>{editBusinessInfoFormik.errors.businessEmail}</small>
                                    )
                                }
                            </div>
                        </div>


                        <div className='flex justify-between items-center gap-5'>
                            <div className='flex-1'>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Opens at
                                </label>

                                <div className='flex flex-col gap-1'>
                                    <select 
                                        onChange={editBusinessInfoFormik.handleChange}
                                        value={editBusinessInfoFormik.values.openingFrom}
                                        name='openingFrom'
                                        className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                    
                                    >
                                        <option className='dark:text-gray-800' value="">From</option>
                                        <option className='dark:text-gray-800' value="4 AM">4 AM</option>
                                        <option className='dark:text-gray-800' value="5 AM">5 AM</option>
                                        <option className='dark:text-gray-800' value="6 AM">6 AM</option>
                                        <option className='dark:text-gray-800' value="7 AM">7 AM</option>
                                        <option className='dark:text-gray-800' value="8 AM">8 AM</option>
                                        <option className='dark:text-gray-800' value="9 AM">9 AM</option>
                                        <option className='dark:text-gray-800' value="10 AM">10 AM</option>
                                        <option className='dark:text-gray-800' value="11 AM">11 AM</option>
                                        <option className='dark:text-gray-800' value="12 PM">12 PM</option>
                                        <option className='dark:text-gray-800' value="1 PM">1 PM</option>
                                        <option className='dark:text-gray-800' value="2 PM">2 PM</option>
                                        <option className='dark:text-gray-800' value="3 PM">3 PM</option>
                                        <option className='dark:text-gray-800' value="4 PM">4 PM</option>
                                        <option className='dark:text-gray-800' value="5 PM">5 PM</option>
                                        <option className='dark:text-gray-800' value="6 PM">6 PM</option>
                                        <option className='dark:text-gray-800' value="7 PM">7 PM</option>
                                        <option className='dark:text-gray-800' value="8 PM">8 PM</option>
                                        <option className='dark:text-gray-800' value="9 PM">9 PM</option>
                                        <option className='dark:text-gray-800' value="10 PM">10 PM</option>
                                        <option className='dark:text-gray-800' value="11 PM">11 PM</option>
                                    </select>
                                    {
                                        editBusinessInfoFormik.errors.openingFrom && (
                                            <small className='text-red-500 tracking-tight text-sm'>{editBusinessInfoFormik.errors.openingFrom}</small>
                                        )
                                    }
                                </div>
                            </div>

                            <div className='flex-1'>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Closes at
                                </label>
                                <div>
                                    <select
                                        onChange={editBusinessInfoFormik.handleChange}
                                        value={editBusinessInfoFormik.values.openingTo}
                                        name='openingTo'
                                        className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                    >
                                        <option className='dark:text-gray-800' value="">To</option>
                                        <option className='dark:text-gray-800' value="4 AM">4 AM</option>
                                        <option className='dark:text-gray-800' value="5 AM">5 AM</option>
                                        <option className='dark:text-gray-800' value="6 AM">6 AM</option>
                                        <option className='dark:text-gray-800' value="7 AM">7 AM</option>
                                        <option className='dark:text-gray-800' value="8 AM">8 AM</option>
                                        <option className='dark:text-gray-800' value="9 AM">9 AM</option>
                                        <option className='dark:text-gray-800' value="10 AM">10 AM</option>
                                        <option className='dark:text-gray-800' value="11 AM">11 AM</option>
                                        <option className='dark:text-gray-800' value="12 PM">12 PM</option>
                                        <option className='dark:text-gray-800' value="1 PM">1 PM</option>
                                        <option className='dark:text-gray-800' value="2 PM">2 PM</option>
                                        <option className='dark:text-gray-800' value="3 PM">3 PM</option>
                                        <option className='dark:text-gray-800' value="4 PM">4 PM</option>
                                        <option className='dark:text-gray-800' value="5 PM">5 PM</option>
                                        <option className='dark:text-gray-800' value="6 PM">6 PM</option>
                                        <option className='dark:text-gray-800' value="7 PM">7 PM</option>
                                        <option className='dark:text-gray-800' value="8 PM">8 PM</option>
                                        <option className='dark:text-gray-800' value="9 PM">9 PM</option>
                                        <option className='dark:text-gray-800' value="10 PM">10 PM</option>
                                        <option className='dark:text-gray-800' value="11 PM">11 PM</option>
                                    </select>
                                    {
                                        editBusinessInfoFormik.errors.openingTo && (
                                            <small className='text-red-500 tracking-tight text-sm'>{editBusinessInfoFormik.errors.openingTo}</small>
                                        )
                                    }

                                </div>
                            </div>
                        </div>

                        <div>   
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Business Address
                            </label>

                            <div className='flex flex-col gap-1'>
                                <input
                                    onChange={editBusinessInfoFormik.handleChange}
                                    value={editBusinessInfoFormik.values.address}
                                    name='address'
                                    type="text"
                                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                />   
                                {
                                    editBusinessInfoFormik.errors.address && (
                                        <small className='text-red-500 tracking-tight text-sm'>{editBusinessInfoFormik.errors.address}</small>
                                    )
                                }
                            </div>       
                        </div>

                        <div className='flex justify-between items-center gap-5'>
                            <div className='flex-1'>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Town
                                </label>

                                <div className='flex flex-col gap-1'>
                                    <input
                                        onChange={editBusinessInfoFormik.handleChange}
                                        value={editBusinessInfoFormik.values.town}
                                        name='town'
                                        type="text"
                                        className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                    />
                                    {
                                        editBusinessInfoFormik.errors.town && (
                                            <small className='text-red-500 tracking-tight text-sm'>{editBusinessInfoFormik.errors.town}</small>
                                        )
                                    }
                                </div>
                            </div>

                            <div className='flex-1'>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    State
                                </label>

                               <div>
                                    <input
                                        onChange={editBusinessInfoFormik.handleChange}
                                        value={editBusinessInfoFormik.values.state}
                                        name='state'
                                        type="text"
                                        className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-white/10 dark:text-white px-4 text-sm outline-none focus:border-[#ED8F0C]"
                                    />
                                    {
                                        editBusinessInfoFormik.errors.state && (
                                            <small className='text-red-500 tracking-tight text-sm'>{editBusinessInfoFormik.errors.state}</small>
                                        )
                                    }

                               </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">

                            <button
                                type="button"
                                onClick={() => seteditInfo(false)}
                                className="h-11 flex-1 rounded-xl bg-gray-100 dark:bg-gray-600 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 dark:hover:bg-gray-500 transition hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={isPending}
                                onClick={() => editBusinessInfoFormik.handleSubmit()}
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

                <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1A1C22] p-6 shadow-2xl sm:p-7">

                    <div className="mb-5 text-center">
                        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-300">
                            <span className="text-2xl text-[#C91737]">!</span>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                            Delete Account
                        </h2>
                    </div>

                    <div className="mb-4 text-center">
                        <p className="md:text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
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
                            className="h-11 py-3 flex-1 rounded-xl bg-gray-100 dark:bg-gray-600 px-4 font-semibold cursor-pointer text-gray-700 transition hover:bg-gray-200 dark:hover:bg-gray-500 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
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