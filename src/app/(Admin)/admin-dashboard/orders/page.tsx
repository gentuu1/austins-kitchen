'use client'
import { allOrder } from '@/app/utils/action'
import { all_Ord } from '@/app/utils/type'
import Spinner from '@/components/Spinner'
import { useFormik } from 'formik'
import { Anton } from 'next/font/google'
import { useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useEffect, useState, useTransition } from 'react'
import { FaSearch, FaSpinner } from 'react-icons/fa'
import { FiCheckCircle, FiLoader, FiXSquare } from 'react-icons/fi'
import { HiOutlineReceiptRefund } from 'react-icons/hi'
import { toast } from 'react-toastify'
const anton = Anton({ subsets: ['latin'], weight: '400' })


const page = () => {

  const [all_orders, setall_orders] = useState<all_Ord[]>([])
  const [allfiteredOrders, setallfiteredOrders] = useState<all_Ord[]>([])
  const [isSpinner, setisSpinner] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const search = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value.trim()) {
      params.delete('search')
    } else {
      params.set('search', value.trim())
    }

    router.push(params.toString() ? `/admin-dashboard/orders?${params.toString()}` : `/admin-dashboard/orders` )
  }

  const searchFormik = useFormik({
    initialValues: {
      search: ''
    },

    onSubmit: (values) => {
      startTransition(()=>{
        search(values.search.trim())
      })
    }
  })

  useEffect(() => {
    const search = searchParams.get("search")

    if (!search) {
      setallfiteredOrders(all_orders)
      return
    }

    const searchOrder = all_orders.filter(
      order =>
        order.firstName.toLowerCase().includes(search.toLowerCase()) ||
        order.lastName.toLowerCase().includes(search.toLowerCase()) ||
        order._id.toString().includes(search.toString().toLowerCase()) ||
        order.paymentReference.toLowerCase().includes(search.toLowerCase()) ||
        order.status.toLowerCase().includes(search.toLowerCase())
    )



    setallfiteredOrders(searchOrder)

  }, [searchParams, all_orders])

  useEffect(() => {
    const fetch_all_orders = async () => {
      const res = await allOrder();

      if (!res.success) {
        toast.error(res.message, {
          autoClose: 2000
        })

        router.push('/signin')
        return;
      }

      setall_orders(res.orders || [])
      setallfiteredOrders(res.orders || [])
      setisSpinner(false)
    }

    fetch_all_orders()
  }, [])

  const pro_cess_ing = all_orders.filter(item =>
    item.status === 'confirmed' ||
    item.status === 'preparing' ||
    item.status === 'ready' ||
    item.status === 'out-for-delivery' ||
    item.status === 'pending'
  )
  const comple_ted = all_orders.filter(item => item.status === 'delivered')
  const can_celled = all_orders.filter(item => item.status === 'cancelled')

  if (isSpinner) return <Spinner />

  return (
    <div>
      <div className='md:hidden w-full px-5 py-2 mb-10'>
        <h1 className='text-3xl font-bold'>Orders</h1>
      </div>

      <section className='w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5 md:px-5 lg:px-5 md:py-3 lg:py-3 p-3'>

        <div className=' h-40 md:h-30 lg:h-35 rounded-2xl p-5 bg-white shadow-lg flex flex-col space-y-3'>
          < HiOutlineReceiptRefund className='text-2xl text-[#ED8F0C]' />
          <h1 className='text-2xl font-semibold '>{(all_orders.length).toString().padStart(2, '0')}</h1>
          <p className='text-sm text-gray-300'>Total Orders</p>
        </div>

        <div className=' h-40 md:h-30 lg:h-35 rounded-2xl p-5 bg-white shadow-lg flex flex-col space-y-3'>
          <FiLoader className='text-2xl text-[#ED8F0C]' />
          <h1 className='text-2xl font-semibold '>{String(pro_cess_ing.length).padStart(2, '0')}</h1>
          <p className='text-sm text-gray-300'>On Process</p>
        </div>

        <div className=' h-40 md:h-30 lg:h-35 rounded-2xl p-5 bg-white shadow-lg flex flex-col space-y-3'>
          <FiCheckCircle className='text-2xl text-[#ED8F0C]' />
          <h1 className='text-2xl font-semibold '>{String(comple_ted.length).padStart(2, '0')}</h1>
          <p className='text-sm text-gray-300'>Completed</p>
        </div>

        <div className=' h-40 md:h-30 lg:h-35 rounded-2xl p-5 bg-white shadow-lg flex flex-col space-y-3'>
          <FiXSquare className='lg:text-2xl md:text-3xl text-[#ED8F0C]' />
          <h1 className='text-2xl font-semibold '>{String(can_celled.length).padStart(2, '0')}</h1>
          <p className='text-sm text-gray-300'>Cancelled</p>
        </div>

      </section>

      <section className='px-2 w-[98%] md:w-[95%] h-fit py-5 m-auto rounded-lg bg-white mt-10'>
        <div className='w-full flex md:flex-row md:justify-between flex-col gap-2 p-2'>
          <div className="md:w-70 overflow-hidden md:h-8 h-10 rounded-2xl flex  items-center border border-gray-400">
            <input
              onChange={searchFormik.handleChange}
              value={searchFormik.values.search}
              name='search'
              className='flex-1 outline-0 md:h-8 h-10 text-sm text-gray-500 px-2'
              placeholder='Search'
              type="text" />

            <button type='button' onClick={() => searchFormik.handleSubmit()} className='size-10 md:size-8 transition-all duration-300 rounded-full hover:bg-[#ED8F0C]/30 bg-[#ED8F0C]/20 text-[#ED8F0C] flex flex-col items-center justify-center cursor-pointer'>
              {
                isPending ? (<FaSpinner size={15} className='animate-spin' />) : (<FaSearch size={15} />)
              }
            </button>
          </div>
        </div>

        {
          all_orders.length > 0 && allfiteredOrders.length === 0 && (
            <div className="w-full py-10 px-5 flex flex-col items-center justify-center text-center gap-3">
              <FaSearch className="text-4xl text-gray-300" />

              <h2 className={`${anton.className} text-2xl text-gray-700`}>
                No Orders Found
              </h2>
            </div>
          )
        }

        {
          all_orders.length === 0 && (
            <div className='w-full flex  flex-col justify-center items-center py-20 px-5 text-center'>
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-5">
                <HiOutlineReceiptRefund className="text-4xl text-[#ED8F0C]" />
              </div>

              <h2 className={`${anton.className} text-2xl md:text-3xl text-gray-800`}>
                No Orders Yet
              </h2>

              <p className="m-auto max-w-md text-sm md:text-base text-gray-500">
                There are no customer orders to display at the moment.
                New orders will appear here once they are placed.
              </p>
            </div>
          )
        }

        {
          allfiteredOrders.length !== 0 && (
            <table className='mt-10 w-full bg-white shadow-md rounded-xl overflow-hidden'>
              <thead className='h-8 bg-gray-50 md:table-header-group hidden' >
                <tr className=' text-left text-gray-600 text-sm tracking-wide'>
                  <th className='pl-2'>
                    Order ID
                  </th>
                  <th>
                    Date
                  </th>
                  <th>
                    Customer
                  </th>
                  <th>
                    Product
                  </th>
                  <th>
                    Amount
                  </th>
                  <th>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {
                  allfiteredOrders.map((order) => (
                    <tr onClick={() => router.push(`/admin-dashboard/orders/${order._id}`)} key={order._id} className='cursor-pointer flex flex-col md:table-row md:p-0 p-4 gap-3 md:gap-0 shadow-sm mb-2 hover:bg-neutral-100'>
                      <td className='flex md:table-cell justify-between py-4  md:pl-2'>
                        <h2 className='md:hidden text-2xl text-bold'>
                          Order Id
                        </h2>

                        <p className='text-gray-500'>#AK-{order._id.slice(0, 8).toUpperCase()}</p>
                      </td>

                      <td className='flex md:table-cell justify-between py-4'>
                        <h2 className='md:hidden text-2xl text-bold'>
                          Date
                        </h2>

                        <p className='text-gray-500'>{(order.createdAt).toLocaleDateString()}</p>
                      </td>

                      <td className='flex md:table-cell justify-between py-4'>
                        <h2 className='md:hidden text-2xl text-bold'>
                          Customer
                        </h2>

                        <p className='text-gray-500 line-clamp-1'>{`${order.firstName} ${order.lastName}`}</p>
                      </td>

                      <td className='flex md:table-cell items-center justify-between py-4'>
                        <h2 className='md:hidden text-2xl text-bold'>
                          Product
                        </h2>


                        <div className='flex flex-col'>
                          {
                            order.items.map((each, index) => (
                              <p key={index} className='text-gray-500 md:text-sm'><small className='mr-2'>{each.quantity}x</small>{each.title}</p>
                            ))
                          }
                        </div>
                      </td>

                      <td className='flex md:table-cell justify-between py-4'>
                        <h1 className='md:hidden text-2xl text-bold'>
                          Amount
                        </h1>

                        <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>
                          ₦{order.totalAmount.toLocaleString()}
                        </p>
                      </td>

                      <td className='flex md:table-cell justify-between py-4 '>
                        <h1 className='md:hidden text-2xl text-bold'>
                          Status
                        </h1>

                        <p
                          className={`capitalize w-fit px-3 py-1 rounded-full text-sm font-medium ${order.status === "pending"
                            ? "text-amber-700 bg-amber-100"
                            :order.status === "confirmed"
                            ? "text-blue-700 bg-blue-100"
                            : order.status === "preparing"
                            ? "text-orange-700 bg-orange-100"
                            : order.status === "ready"
                            ? "text-emerald-700 bg-emerald-100"
                            : order.status === "delivered"
                            ? "text-green-700 bg-green-100"
                            : order.status === "out-for-delivery"
                            ? "text-violet-700 bg-violet-100"
                            : "text-red-700 bg-red-100"
                            }`}
                        >
                          {order.status === "preparing"
                            ? `${order.status}...`
                            : order.status}
                        </p>
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

export default page
