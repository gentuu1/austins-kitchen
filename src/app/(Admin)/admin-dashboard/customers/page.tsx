"use client"
import { customers, delete_customer } from '@/app/utils/action'
import { ctmrs } from '@/app/utils/type'
import Spinner from '@/components/Spinner'
import { useFormik } from 'formik'
import { Anton } from 'next/font/google'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useEffect, useState, useTransition } from 'react'
import { FaSearch, FaSpinner } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'
import { MdDelete, MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
const anton = Anton({ subsets: ['latin'], weight: '400' })

const Custm = () => {
  const router = useRouter()
  const [cusTomers, setcusTomers] = useState<ctmrs[]>([])
  const [filtered_cusTomers, setfiltered_cusTomers] = useState<ctmrs[]>([])
  const [isSpinner, setisSpinner] = useState(true)
  const [openDeleteUser, setopenDeleteUser] = useState(false)
  const [deleteUser, setdeleteUser] = useState({
    _id : '',
    firstName : '',
    email :'',
  })

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()

  const search = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!value) {
      params.delete('search')
    } else {
      params.set('search', value.trim().toString())
    }

    router.push(params.toString() ? `/admin-dashboard/customers?${params.toString()}` : `/admin-dashboard/customers`)
  }

  const searchFormik = useFormik({
    initialValues: {
      search: ''
    },
    onSubmit: (values) => {

      startTransition(() => {
        search(values.search.toString().trim())
      })

    }
  })

  useEffect(() => {
    const search = searchParams.get('search')

    if (!search) {
      setfiltered_cusTomers(cusTomers)
      return
    }

    const sear_ched = cusTomers.filter(
      cusT => cusT.email.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
        cusT.firstName.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
        cusT.lastName.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
        cusT._id.toLowerCase().trim().includes(search.toLowerCase().trim())
    )

    setfiltered_cusTomers(sear_ched)
  }, [searchParams, cusTomers])

const fetchCustomer = async () => {
      const res = await customers();

      if (!res.success) {
        toast.error(res.message, {
          autoClose: 2000
        })

        router.push('/admin-dashboard')
        return;
      }

      setcusTomers(res.cusTomers || [])
      setfiltered_cusTomers(res.cusTomers || [])
      setisSpinner(false)
    }

  useEffect(() => {
    fetchCustomer()
  }, [])

  const deLeteCst = async()=>{
    startTransition(async()=>{
      if (!deleteUser._id || !deleteUser.firstName.trim() || !deleteUser.email.trim()) return;

      const res = await delete_customer(deleteUser)

      if(!res.success) {
        toast.error(res.message, {
          autoClose:2000
        })
        return
      }

      await fetchCustomer()
      setdeleteUser({_id : '', email : '', firstName : ''})
      toast.success(res.message, {
        autoClose: 2000
      })
      setopenDeleteUser(false)
    })
  }

  if (isSpinner) return <Spinner />
  return (
    <div >
      <div className='md:hidden w-full px-5 py-2 mb-10'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-[#D2D3DB]'>Customers</h1>
      </div>

      <div className={`${openDeleteUser ? 'fixed inset-0' : 'hidden'} overflow-y-scroll border h-screen w-full flex items-center bg-black/60 z-50 `}>

        <div className='z-50 lg:w-[50%] md:w-[80%] w-[98%] h-fit p-2 bg-white dark:bg-[#1A1C22] rounded-lg m-auto'>
          <div className='flex flex-col items-center leading-tight'>
            <h1 className='text-xl font-bold text-center text-[#E7000B]'>Delete customer</h1>

            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-6 text-center">
              Are you sure you want to delete {deleteUser?.firstName}? <br />
              <span className='text-gray-600 dark:text-gray-400 font-semibold'>All {deleteUser.firstName}'s histories will be deleted</span> <br/>
              <span className="font-semibold text-red-600">This action cannot be undone.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">

            <button
              onClick={() => {
                setdeleteUser({ _id: '', firstName: '', email: '' })
                setopenDeleteUser(false)
              }}
              className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            <button
              type = 'button'
              disabled= {isPending}
              onClick={deLeteCst}
              className="flex-1 cursor-pointer bg-[#C91737] text-white font-semibold py-2 px-4 rounded-2xl hover:bg-red-700 transition flex justify-center items-center"
            >
              {
                isPending ? (<FaSpinner className="text-lg animate-spin" />) : "Delete"
              }
            </button>
          </div>
        </div>
      </div>

      <section className='p-2 w-full md:w-[95%] lg:w-[90%] h-fit m-auto rounded-lg bg-white dark:bg-[#1A1C22]'>

        <div className='w-full h-10 flex items-center'>
          <div className="w-70 h-8 rounded-2xl overflow-hidden flex items-center border border-gray-400 dark:border-gray-600">
            <input
              onChange={searchFormik.handleChange}
              value={searchFormik.values.search}
              name='search'
              className='flex-1 outline-0 h-8 text-sm text-gray-500 dark:text-gray-200 px-2 bg-white dark:bg-gray-800'
              placeholder='Search'
              type="text"
            />

            <button
              type='button'
              onClick={() => searchFormik.handleSubmit()}
              className='border dark:border-gray-600 size-8 transition-all duration-300 rounded-full hover:bg-[#ED8F0C]/30 bg-[#ED8F0C]/20 text-white flex flex-col items-center justify-center cursor-pointer'
            >
              {
                isPending ? (
                  <FaSpinner size={15} className='animate-spin' />
                ) : (
                  <FaSearch size={15} />
                )
              }
            </button>
          </div>
        </div>

        {
          filtered_cusTomers.length === 0 && (
            <div className="w-full py-10 px-5 flex flex-col items-center justify-center text-center gap-3">
              <FaSearch className="text-4xl text-gray-300 dark:text-gray-600" />

              <h2 className={`${anton.className} text-2xl text-gray-700 dark:text-[#D2D3DB]`}>
                No Customer Found
              </h2>
            </div>
          )
        }

        {
          filtered_cusTomers.length !== 0 && (
            <table className='mt-10 w-full bg-white dark:bg-[#1A1C22] shadow-md rounded-xl overflow-hidden'>
              <thead className='h-8 bg-gray-50 dark:bg-gray-800 md:table-header-group hidden'>
                <tr className='text-left text-gray-600 dark:text-gray-300 text-sm tracking-wide'>
                  <th className='md:pl-4'>
                    Name
                  </th>
                  <th>
                    Email
                  </th>
                  <th>
                    Phone
                  </th>
                  <th>
                    Spent
                  </th>
                  <th>
                    action
                  </th>
                </tr>
              </thead>

              <tbody>
                {
                  filtered_cusTomers.length > 0 && filtered_cusTomers.map((ctm) => (
                    <tr
                      key={ctm._id}
                      className='flex flex-col mb-2 cursor-pointer shadow-sm md:table-row md:p-0 p-4 gap-3 md:gap-0 border-b border-gray-400 dark:border-gray-700'
                    >

                      <td className='flex gap-2 items-center justify-between md:justify-start md:p-4'>
                        <div className='size-10 rounded-full overflow-hidden'>
                          <Image
                            src={ctm.profilePic || '/img/profileimage.jpg'}
                            alt='profile'
                            loading='eager'
                            height={500}
                            width={500}
                            className='w-ful h-full object-cover'
                          />
                        </div>

                        <h1 className={`${ctm.firstName === 'isAlreadyDeleted' && 'text-red-500 dark:text-red-500'} capitalize text-lg font-semibold text-gray-600 dark:text-gray-300`}>
                          {`${ctm.firstName}  ${ctm.lastName}`}
                        </h1>
                      </td>


                      <td className='flex justify-between md:table-cell py-2'>
                        <h2 className='md:hidden text-xl text-gray-500 dark:text-gray-400'>
                          Email
                        </h2>

                        <span className='text-gray-500 dark:text-gray-400 break-all'>
                          {ctm.email}
                        </span>
                      </td>

                      <td className='flex justify-between md:table-cell py-2'>
                        <h2 className='md:hidden text-xl text-gray-500 dark:text-gray-400'>
                          Phone
                        </h2>

                        <span className='text-gray-500 dark:text-gray-400'>
                          {ctm.phoneNumber? ctm.phoneNumber : 'No number added'}
                        </span>
                      </td>

                      <td className='flex justify-between md:table-cell py-2'>
                        <h2 className='md:hidden text-xl text-gray-500 dark:text-gray-400'>
                          Spent
                        </h2>

                        <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>
                          ₦{(ctm.amountSpent).toLocaleString()}
                        </p>
                      </td>

                      <td className='flex justify-between md:table-cell py-2'>
                        <h2 className='md:hidden text-xl text-gray-500 dark:text-gray-400'>
                          Action
                        </h2>

                        <div className='flex gap-2'>
                          <button
                            className='p-1.5 bg-gray-200 dark:bg-gray-800 shadow-2xl rounded-lg cursor-pointer'
                          >
                            <MdEdit className='text-lg text-[#0662FD]' />
                          </button>

                          <button
                            type='button'
                            onClick={(e) =>{
                              setdeleteUser({_id : ctm._id.toString(), firstName : ctm.firstName, email : ctm.email })
                              e.stopPropagation()
                              setopenDeleteUser(true)
                            }}
                            className='p-1.5 bg-gray-200 dark:bg-gray-800 shadow-2xl rounded-lg cursor-pointer'
                          >
                            <MdDelete className='text-lg text-[#F6473F]' />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                }
              </tbody>
            </table>
          )
        }
      </section>
    </div>
  )
}

export default Custm
