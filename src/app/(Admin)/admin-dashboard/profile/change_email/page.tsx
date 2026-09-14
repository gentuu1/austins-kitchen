"use client"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Anton } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import { changeAdmin_email, verifyAdmin_otp } from '@/app/utils/action'
import { toast } from 'react-toastify'
const anton = Anton({ subsets: ['latin'], weight: '400' })

const ChangeAdminemail = () => {
    const [disableEmailinput, setdisableEmailinput] = useState(false)
    const [otpsent, setotpsent] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const confirmOtpFormik = useFormik({
        initialValues: {
            newEmail: '',
            otp : ''
        },

        onSubmit : (values)=>{
            startTransition(async()=>{
                const res = await verifyAdmin_otp(values) 
                if(!res.success) {
                    toast.error(res.message, {
                        autoClose : 2000
                    })
                    return
                }

                
                toast.success(res.message, {
                    autoClose: 2000
                })
                
                editEmailFormik.resetForm()
                confirmOtpFormik.resetForm()
                setdisableEmailinput(false)
                setotpsent(false)
                router.push('/admin-dashboard/profile')
                return
            })
        },

        validationSchema: yup.object({
            newEmail: yup.string().required("New email is required").email('Input valid email'),
            otp : yup.string().required('Verification code required')
        })
    })

    const editEmailFormik = useFormik({
        initialValues : {
            newEmail : ''
        }, 
        onSubmit:(values)=>{
            startTransition(async()=>{
                const res = await changeAdmin_email(values.newEmail)

                if(!res.success) {
                    toast.error(res.message, {
                        autoClose : 2000
                    })
                    return
                }

                confirmOtpFormik.setFieldValue('newEmail', values.newEmail)
                toast.success(res.message, {
                    autoClose: 2000
                })
                setdisableEmailinput(true)
                setotpsent(true)
                
            })
        },

        validationSchema : yup.object({
            newEmail : yup.string().required("New email is required").email('Input valid email')
        })
    })
  return (
      <div className="min-h-screen bg-zinc-50 px-5 py-8 md:px-10 md:py-10">

          
          <div className="w-full max-w-2xl mx-auto">

              <div className="flex items-center justify-between mb-7">

                  <div>
                      <h1 className={`${anton.className} text-2xl md:text-3xl text-gray-900`}>
                          Change email address
                      </h1>

                      <p className="text-sm md:text-base text-gray-500 mt-1">
                          Verify your new email address before updating your admin account.
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


              <div className="w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 md:p-7">

                  <div className="space-y-4">
                      <div>
                          <label
                              htmlFor="newEmail"
                              className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                              New email address
                          </label>

                          <div className="flex flex-col gap-1">

                              <input
                                  disabled={disableEmailinput}
                                  onChange={editEmailFormik.handleChange}
                                  value={editEmailFormik.values.newEmail}
                                  id="newEmail"
                                  name="newEmail"
                                  type="email"
                                  placeholder="Enter your new email address"
                                  className={`${disableEmailinput
                                          ? 'bg-gray-100 cursor-not-allowed'
                                          : ''
                                      } w-full h-11 px-3 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition`}
                              />

                              {
                                  editEmailFormik.errors.newEmail && (
                                      <small className="text-sm text-red-500 tracking-tight">
                                          {editEmailFormik.errors.newEmail}
                                      </small>
                                  )
                              }

                          </div>
                      </div>


                      <div>

                          <label
                              htmlFor="otp"
                              className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                              Verification code
                          </label>

                          <div className="flex flex-col gap-1">

                              <div className="flex gap-2">

                                  <input
                                      onChange={confirmOtpFormik.handleChange}
                                      value={confirmOtpFormik.values.otp}
                                      disabled={!otpsent}
                                      id="otp"
                                      name="otp"
                                      type="text"
                                      placeholder="Enter verification code"
                                      className={`${!otpsent
                                              ? 'bg-gray-100 cursor-not-allowed'
                                              : ''
                                          } flex-1 h-11 px-3 border border-neutral-300 rounded-lg outline-none focus:border-[#ED8F0C] focus:ring-1 focus:ring-[#ED8F0C]/20 transition`}
                                  />

                                  <button
                                      disabled={isPending || disableEmailinput}
                                      onClick={() => editEmailFormik.handleSubmit()}
                                      type="button"
                                      className={`${otpsent  && 'hidden' } shrink-0 px-4 h-11 rounded-lg border border-[#ED8F0C] text-[#ED8F0C] font-medium hover:bg-[#ED8F0C]/10 transition cursor-pointer`}
                                  >
                                      {
                                          isPending ? (
                                              <FaSpinner size={15} className="animate-spin" />
                                          ) : (
                                              'Send code'
                                          )
                                      }
                                  </button>

                              </div>

                              {
                                  confirmOtpFormik.errors.otp && otpsent && (
                                      <small className="text-sm text-red-500 tracking-tight">
                                          {confirmOtpFormik.errors.otp}
                                      </small>
                                  )
                              }

                          </div>

                          <p className="text-xs text-gray-400 mt-2">
                              We'll send a verification code to your new email address.
                          </p>

                      </div>

                  </div>


                 
                  <div className="flex gap-3 pt-6">

                      <button
                          type="button"
                          onClick={() => router.push('/admin-dashboard/profile')}
                          className="flex-1 h-11 rounded-lg border border-neutral-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
                      >
                          Cancel
                      </button>

                      <button
                          disabled={!otpsent || isPending}
                          onClick={() => confirmOtpFormik.handleSubmit()}
                          type="button"
                          className={`${!otpsent
                                  ? 'cursor-not-allowed opacity-60'
                                  : ''
                              } flex justify-center items-center flex-1 h-11 rounded-lg bg-[#ED8F0C] text-white font-medium hover:bg-[#d77d00] transition cursor-pointer`}
                      >
                          {
                              isPending ? (
                                  <FaSpinner size={15} className="animate-spin" />
                              ) : (
                                  'Update email'
                              )
                          }
                      </button>

                  </div>

              </div>

          </div>

      </div>
  )
}

export default ChangeAdminemail
