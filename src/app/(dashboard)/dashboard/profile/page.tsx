'use client'

import Image from 'next/image'
import ProfileNavbar from '../../../../components/ProfileNavbar'
import { ChangeEvent, useEffect, useState, useTransition } from 'react'
import { MdClose, MdEdit, MdLocationOn, MdLockOutline, MdLogout, MdKeyboardArrowRight, MdDelete } from 'react-icons/md'
import { FaRegUser, FaShoppingBag, FaSpinner } from 'react-icons/fa'
import { Anton } from 'next/font/google'
import { TbCurrencyNaira } from 'react-icons/tb'
import { useCart } from '@/app/context/contextProvider'
import { useRouter } from 'next/navigation'
import { del_account, signOut } from '@/app/utils/action'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Spinner from '@/components/Spinner'
const anton = Anton({ subsets: ['latin'], weight: '400' });



const Page = () => {
  const [editbasic, seteditbasic] = useState(false)
  const [openDeleteAcc, setopenDeleteAcc] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [prev, setprev] = useState('')
  const [isSpinner, setisSpinner] = useState(true)
  const router = useRouter()

  const { user_pro, toTalordNum, edit_profile, del_profilePic } = useCart()

  const editFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      profilePic: '',
      phoneNumber: '',
      _id: ''
    },

    onSubmit: (values) => {
      startTransition(async () => {
        await edit_profile({ ...values })
        seteditbasic(false)
      })
    },

    validationSchema: yup.object({
      firstName: yup.string().required('First name required'),
      lastName: yup.string().required('Last name required'),
      email: yup.string().required('Email required').email('Input valid email'),
      _id: yup.string().required('ID not found')
    })
  })


  useEffect(() => {
    if (!user_pro) return;


    setprev(user_pro?.profilePic ? user_pro?.profilePic : '')

    editFormik.setValues({
      firstName: user_pro.firstName || '',
      lastName: user_pro.lastName || '',
      email: user_pro.email || '',
      profilePic: user_pro.profilePic || '',
      phoneNumber: user_pro.phoneNumber || '',
      _id: user_pro._id.toString()
    })

    setisSpinner(false)
  }, [user_pro])

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

  const handleEditImg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setprev(user_pro?.profilePic ? user_pro?.profilePic : '')
      editFormik.setFieldValue("profilePic", user_pro?.profilePic)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const image = reader.result as string
      setprev(image)
      editFormik.setFieldValue("profilePic", image)
    }

    reader.readAsDataURL(file)
  }

  const deleteAcc = (id:string)=>{
   startTransition(async()=>{
     const res = await del_account(id)

     if (!res.success) {
       if (res.message === 'Unauthorized user detected!') {
         toast.error(res.message, { autoClose: 2000 })
         router.push('/signin')
         return
       }

       toast.error(res.message, { autoClose: 2000 })
       return
     }

     toast.success(res.message, { autoClose: 2000 })
     router.push('/signin')
     return
   })
  }

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

      <div className="sticky top-0 w-full z-50">
        <ProfileNavbar />
      </div>

      <main className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm text-[#ED8F0C] font-semibold mb-1">
            ACCOUNT
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1F2933]">
            Profile
          </h1>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Manage your personal information and account settings.
          </p>
        </div>


        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">

          <div className="h-24  md:h-32 bg-[#1F2933]/90 " />

          <div className="px-5 md:px-8 pb-6">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 md:-mt-14 gap-5">

              <div className="flex items-end gap-4">

                <div className="size-24 md:size-28 rounded-full overflow-hidden bg-[#ED8F0C]/10 shadow-md shrink-0 z-10">
                  <Image
                    src={user_pro?.profilePic || "/img/profileimage.jpg"}
                    alt="Profile"
                    width={500}
                    height={500}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="pb-1">
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F2933]">
                    Welcome back
                  </h2>

                  <p className="text-sm text-gray-500">
                    Manage your account
                  </p>
                </div>

              </div>

              <button
                onClick={() => del_profilePic(user_pro!._id.toString())}
                type="button"
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-red-300 hover:border-red-500 focus:bg-red-200 hover:text-red-500 text-red-600 font-medium transition cursor-pointer"
              >
                <MdDelete className="text-lg" />
                Remove
              </button>

            </div>

          </div>
        </section>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          <section className="lg:col-span-2 bg-white rounded-2xl  shadow-sm">

            <div className="px-5 md:px-7 py-5 border-b border-neutral-200 flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#ED8F0C]/10 flex items-center justify-center">
                  <FaRegUser className="text-[#ED8F0C]" />
                </div>

                <div>
                  <h2 className="font-bold text-lg text-[#1F2933]">
                    Personal information
                  </h2>

                  <p className="text-xs text-gray-500">
                    Your basic account details
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => seteditbasic(true)}
                className="text-sm font-medium text-[#ED8F0C] hover:text-[#c86f00] cursor-pointer"
              >
                Edit
              </button>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2">

              <div className="p-5 md:p-7 border-b md:border-r border-neutral-200">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  First name
                </p>

                <p className="font-medium text-gray-800 capitalize">
                  {user_pro?.firstName}
                </p>


              </div>


              <div className="p-5 md:p-7 border-b border-neutral-200">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Last name
                </p>

                <p className="font-medium text-gray-800 capitalize">
                  {user_pro?.lastName}
                </p>
              </div>


              <div className="p-5 md:p-7 border-b md:border-b-0 md:border-r border-neutral-200">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Email
                </p>

                <p className="font-medium text-gray-800 break-all capitalize">
                  {user_pro?.email}
                </p>
              </div>


              <div className="p-5 md:p-7">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Phone number
                </p>

                <p className="font-medium text-gray-800">
                  {user_pro?.phoneNumber ? `${user_pro?.phoneNumber}` : '0000 000 0000'}
                </p>
              </div>

            </div>

          </section>



          <section className="bg-white rounded-2xl  shadow-sm h-fit">

            <div className="px-5 py-5 border-b border-neutral-200 flex items-center gap-3">

              <div className="size-10 rounded-full bg-[#ED8F0C]/10 flex items-center justify-center">
                <FaShoppingBag className="text-[#ED8F0C]" />
              </div>

              <div>
                <h2 className="font-bold text-lg text-[#1F2933]">
                  Orders
                </h2>

                <p className="text-xs text-gray-500">
                  Your order activity
                </p>
              </div>

            </div>


            <div className="p-5" >

              <div className="flex justify-between items-center pb-5 border-b border-neutral-200">

                <div>
                  <p className="text-sm text-gray-500">
                    Total orders
                  </p>

                  <p className="text-3xl font-bold text-[#1F2933] mt-1">
                    {toTalordNum}
                  </p>
                </div>

                <div className="size-12 rounded-full bg-[#1F2933] flex items-center justify-center">
                  <FaShoppingBag className="text-white" />
                </div>

              </div>

              <div className="flex justify-between items-center pb-5 border-b border-neutral-200 mt-1">

                <div>
                  <p className="text-sm text-gray-500">
                    Amount spent
                  </p>

                  <p className={`${anton.className} text-[#ED8F0C] text-3xl font-bold mt-1`}>
                    ₦{(user_pro?.amountSpent)?.toLocaleString()}
                  </p>
                </div>

                <div className="size-12 rounded-full bg-[#1F2933] flex items-center justify-center">
                  <TbCurrencyNaira className="text-white" />
                </div>

              </div>


              <button
                onClick={() => router.push('/dashboard/order-history')}
                type="button"
                className="w-full mt-5 flex items-center justify-between py-3 px-4 rounded-lg bg-[#f7f7f7] hover:bg-[#ED8F0C]/10 transition cursor-pointer"
              >
                <span className="font-medium text-gray-700">
                  View order history
                </span>

                <MdKeyboardArrowRight className="text-xl text-gray-500" />
              </button>

            </div>

          </section>

        </div>

        {/* Account settings */}
        <section className="bg-white rounded-2xl shadow-sm mt-6 mb-8">

          <div className="px-5 md:px-7 py-5 border-b border-neutral-200">

            <h2 className="font-bold text-lg text-[#1F2933]">
              Account & security
            </h2>

            <p className="text-xl text-gray-500 mt-1">
              Manage your account preferences
            </p>

          </div>


          <div>

            <button
              onClick={() => router.push('/dashboard/profile/pass&security')}
              type="button"
              className="w-full px-5 md:px-7 py-5 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer border-b border-neutral-200"
            >

              <div className="flex items-center gap-4">

                <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <MdLockOutline className="text-xl text-gray-600" />
                </div>

                <div className="text-left">
                  <p className="font-medium text-gray-800">
                    Change password & email
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Update your account password and email
                  </p>
                </div>

              </div>

              <MdKeyboardArrowRight className="text-xl text-gray-400" />

            </button>


            <button
              onClick={logout}
              type="button"
              className="w-full px-5 md:px-7 py-5 flex items-center justify-between hover:bg-red-50 transition cursor-pointer"
            >

              <div className="flex items-center gap-4">

                <div className="size-10 rounded-full bg-red-50 flex items-center justify-center">
                  <MdLogout className="text-xl text-red-500" />
                </div>

                <div className="text-left">
                  <p className="font-medium text-red-500">
                    Log out
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Sign out of your account
                  </p>
                </div>

              </div>

              <MdKeyboardArrowRight className="text-xl text-red-400" />

            </button>


            <button
              onClick={() => setopenDeleteAcc(true)}
              type="button"
              className="w-full px-5 md:px-7 py-5 flex items-center justify-between hover:bg-red-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-4">

                <div className="size-10 rounded-full bg-red-50 flex items-center justify-center">
                  <MdDelete className="text-xl text-red-500" />
                </div>

                <div className="text-left">
                  <p className="font-medium text-red-500">
                    Delete account
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Permanently delete your account and all your data
                  </p>
                </div>

              </div>

              <MdKeyboardArrowRight className="text-xl text-red-400" />

            </button>

          </div>

        </section>

      </main>


      {/* EDIT PROFILE MODAL */}
      <div
        className={`${editbasic ? 'fixed' : 'hidden'} inset-0 z-50 bg-black/50 px-4 flex items-center justify-center`}
      >

        <div
          className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">

            <div>
              <h2 className="text-xl font-bold text-[#1F2933]">
                Edit profile
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Update your personal information
              </p>
            </div>

            <button
              type="button"
              onClick={() => seteditbasic(false)}
              className="size-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <MdClose className="text-xl text-gray-600" />
            </button>

          </div>


          <div className="p-5 space-y-4">

            <div className="flex justify-center mb-5">

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


            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  First name
                </label>

                <div className='flex flex-col gap-1'>
                  <input
                    onChange={editFormik.handleChange}
                    value={editFormik.values.firstName}
                    name='firstName'
                    type="text"
                    className="mt-1 w-full h-11 border border-neutral-300 rounded-lg px-3 outline-none focus:border-[#ED8F0C]"
                  />
                  {
                    editFormik.errors.firstName && (
                      <small className='text-sm text-red-500 tracking-tight'>{editFormik.errors.firstName}</small>
                    )
                  }
                </div>
              </div>


              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last name
                </label>

                <div className='flex flex-col gap-1'>
                  <input
                    onChange={editFormik.handleChange}
                    value={editFormik.values.lastName}
                    name='lastName'
                    type="text"
                    className="mt-1 w-full h-11 border border-neutral-300 rounded-lg px-3 outline-none focus:border-[#ED8F0C]"
                  />
                  {
                    editFormik.errors.lastName && (
                      <small className='text-sm text-red-500 tracking-tight'>{editFormik.errors.lastName}</small>
                    )
                  }
                </div>
              </div>

            </div>


            <div>
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>

              <div className='flex flex-col gap-1'>
                <input
                  disabled={true}
                  type="email"
                  value={`${editFormik.values.email}`}
                  className="mt-1 w-full h-11 border cursor-not-allowed border-neutral-400 rounded-lg px-3 outline-none focus:border-[#ED8F0C]"
                />
                {
                  editFormik.errors.email && (
                    <small className='text-sm text-red-500 tracking-tight'>{editFormik.errors.email}</small>
                  )
                }
              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone number
              </label>

              <input
                onChange={editFormik.handleChange}
                value={editFormik.values.phoneNumber}
                name='phoneNumber'
                type='number'
                className="mt-1 w-full h-11 border border-neutral-300 rounded-lg px-3 outline-none focus:border-[#ED8F0C]"
              />
            </div>


            <div className="flex gap-3 pt-3">

              <button
                type="button"
                onClick={() => seteditbasic(false)}
                className="flex-1 h-11 rounded-lg border border-neutral-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => editFormik.handleSubmit()}
                className="flex-1 flex justify-center items-center h-11 rounded-lg bg-[#ED8F0C] text-white font-medium hover:bg-[#d77d00] transition cursor-pointer"
              >
                {
                  isPending ? (<FaSpinner size={15} className='animate-spin' />) : 'Save changes'
                }
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Delete modal */}

      <div className={`${openDeleteAcc ? 'fixed' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4`}>

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
              Are you sure you want to delete your account?
            </p>

            <p className="text-sm font-semibold text-[#C91737]">
              This action cannot be undone.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              disabled={isPending}
              onClick={() => setopenDeleteAcc(false)}
              className="h-11 py-3 flex-1 rounded-xl bg-gray-100 px-4 font-semibold cursor-pointer text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={() => deleteAcc(user_pro!._id?.toString())}
              type="button"
              disabled={isPending}
              className="h-11 py-3 flex items-center justify-center flex-1 rounded-xl bg-[#C91737] hover:bg-[#dd546e] cursor-pointer px-4 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (<FaSpinner size={15} className='animate-spin'/>): "Delete Account"}
            </button>

          </div>

        </div>

      </div>


    </div>
  )
}

export default Page
