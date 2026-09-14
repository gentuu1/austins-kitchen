"use client"
import { customers } from '@/app/utils/action'
import { ctmrs } from '@/app/utils/type'
import Spinner from '@/components/Spinner'
import { useFormik } from 'formik'
import { Anton } from 'next/font/google'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const [isSearch, setisSearch] = useState(false)
  const searchParams = useSearchParams()

  const search = (value : string)=>{
    const params = new URLSearchParams(searchParams.toString())

    if(!value) {
      params.delete('search')
    } else{
      params.set('search', value.trim().toString())
    }

    router.push(params.toString() ? `/admin-dashboard/customers?${params.toString()}` : `/admin-dashboard/customers`)
  }

  const searchFormik = useFormik({
    initialValues : {
      search : ''
    }, 
    onSubmit: (values)=>{
      setisSearch(true)
      search(values.search.toString().trim())
      setisSearch(false)
    }
  })

  useEffect(()=>{
    const search = searchParams.get('search')

    if(!search) {
      setfiltered_cusTomers(cusTomers)
      return
    }

    const sear_ched = cusTomers.filter(
      cusT => cusT.email.toLowerCase().trim().includes(search.toLowerCase().trim())  ||
              cusT.firstName.toLowerCase().trim().includes(search.toLowerCase().trim())  ||
              cusT.lastName.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
              cusT._id.toLowerCase().trim().includes(search.toLowerCase().trim())
    )     

    setfiltered_cusTomers(sear_ched)
  }, [searchParams, cusTomers])

  useEffect(() => {
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

    fetchCustomer()
  }, [])

  if (isSpinner) return <Spinner />
  return (
    <div >
      <div className='md:hidden w-full px-5 py-2 mb-10'>
        <h1 className='text-3xl font-bold'>Customers</h1>
      </div>
      <section className='px-2 w-full md:w-[95%]  lg:w-[90%] h-fit m-auto rounded-lg bg-white '>

        <div className='w-full h-10 flex items-center'>
          <div className="w-70 h-8 rounded-2xl overflow-hidden flex  items-center border border-gray-400">
            <input
              onChange={searchFormik.handleChange}
              value={searchFormik.values.search}
              name='search'
              className='flex-1 outline-0 h-8 text-sm text-gray-500 px-2'
              placeholder='Search'
              type="text" />

            <button type='button' onClick={()=>searchFormik.handleSubmit()} className='border size-8 transition-all duration-300 rounded-full hover:bg-[#ED8F0C]/30 bg-[#ED8F0C]/20 text-white flex flex-col items-center justify-center cursor-pointer'>
              {
                isSearch ? (<FaSpinner size={15} className='animate-spin' />) : (<FaSearch size={15} />)
              }
            </button>
          </div>
        </div>

        {
          filtered_cusTomers.length === 0 && (
            <div className="w-full py-10 px-5 flex flex-col items-center justify-center text-center gap-3">
              <FaSearch className="text-4xl text-gray-300" />

              <h2 className={`${anton.className} text-2xl text-gray-700`}>
                  No Customer Found
              </h2>
            </div>
          )
        }

        {
          filtered_cusTomers.length !== 0 && (
            <table className='mt-10 w-full bg-white shadow-md rounded-xl overflow-hidden'>
              <thead className='h-8 bg-gray-50 md:table-header-group hidden ' >
                <tr className=' text-left text-gray-600 text-sm tracking-wide'>
                  <th>
                    Name
                  </th>
                  <th>
                    Email
                  </th>
                  <th>
                    Spent
                  </th>
                  <th>
                    action
                  </th>
                  {/* <th>
                        Name
                    </th> */}
                </tr>
              </thead>

              <tbody>
                {
                  filtered_cusTomers.length > 0 && filtered_cusTomers.map((ctm) => (
                    <tr key={ctm._id} className='flex flex-col md:table-row md:p-0 p-4 gap-3 md:gap-0 border-b'>

                      <td className=' flex gap-2  items-center justify-between md:justify-start md:p-4 '>
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

                        <h1 className={`${ctm.firstName === 'isAlreadyDeleted' && 'text-red-500'} capitalize text-lg font-semibold text-gray-600`}>
                          {`${ctm.firstName}  ${ctm.lastName}`}
                        </h1>
                      </td>

                      <td className='flex justify-between md:table-cell  py-4'>
                        <h2 className='md:hidden text-gray-500'>Email</h2>

                        <span className='text-gray-500'>{ctm.email}</span>

                      </td>

                      <td className='flex justify-between md:table-cell py-4'>
                        <h2 className='md:hidden text-gray-500'>Spent</h2>

                        <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>
                          ₦{(ctm.amountSpent).toLocaleString()}
                        </p>
                      </td>

                      <td className='flex justify-between md:table-cell py-4'>
                        <h2 className='md:hidden text-gray-500'>Action</h2>

                        <div className='flex gap-2'>
                          <button
                            className='p-1.5 bg-gray-200 shadow-2xl rounded-lg cursor-pointer'>
                            < MdEdit className='text-lg text-[#0662FD]' />
                          </button>
                          <button
                            className='p-1.5 bg-gray-200 shadow-2xl rounded-lg cursor-pointer '>
                            < MdDelete className='text-lg text-[#F6473F]' />
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
