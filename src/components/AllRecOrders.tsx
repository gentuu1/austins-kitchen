"use client"

import { allOrder } from "@/app/utils/action"
import { all_Ord } from "@/app/utils/type"
import { Anton } from "next/font/google"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HiOutlineReceiptRefund } from "react-icons/hi"
import Spinner from "./Spinner"

const anton = Anton({ subsets: ['latin'], weight: '400' })

const AllRecOrders = () => {
    const [rec_ord, setrec_ord] = useState<all_Ord[] | []>([])
    const [mess_age, setmess_age] = useState('')
    const [sPin, setsPin] = useState(true)
    const router = useRouter()

    useEffect(()=>{
        const rec = async()=>{
            setmess_age('')
            const res = await allOrder()

            if(!res.success){
                setmess_age(res.message)
                setsPin(false)
                return;
            }

            setrec_ord(res.orders?.slice(0, 10) || [])
            setsPin(false)
            setmess_age('')

        }
        rec()
    }, [])

  return (
      <section className='px-5 w-[95%] h-fit  m-auto rounded-lg bg-white mt-10'>
          <div className='w-full flex justify-between mb-5'>
              <h1 className='text-lg font-bold '>Recent Orders</h1>

              <Link href='/admin-dashboard/orders'>
                  <button className='border cursor-pointer rounded-sm py-1 px-2 text-sm text-center bg-transparent'>
                      See all orders
                  </button>
              </Link>
          </div>

          {
            sPin && (
                  <div className="flex justify-center items-center py-10">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ED8F0C] border-t-transparent" />
                  </div>
            )
          }

          {
              mess_age && (
                  <div className="bg-red-100 text-red-500 flex justify-center items-center text-center p-4">
                      <p>{mess_age}</p>
                  </div>
              )
          }

          {
              rec_ord.length === 0 && !sPin && (
                  <div className='w-full flex  flex-col justify-center items-center py-5 px-5 text-center'>
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
              rec_ord.length !== 0  && (
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
                              rec_ord.map((order) => (
                                  <tr onClick={() => router.push(`/admin-dashboard/orders/${order._id}`)} key={order._id} className='hover:bg-neutral-100 focus:bg-neutral-100 cursor-pointer flex flex-col md:table-row md:p-0 p-5 gap-3 md:gap-0 shadow-sm mb-2'>
                                      <td className='flex md:table-cell justify-between py-4  md:pl-2'>
                                          <h2 className='md:hidden text-xl text-bold'>
                                              Order Id
                                          </h2>

                                          <p className='text-gray-500'>#AK-{order._id.slice(0, 8).toUpperCase()}</p>
                                      </td>

                                      <td className='flex md:table-cell justify-between py-4'>
                                          <h2 className='md:hidden text-xl text-bold'>
                                              Date
                                          </h2>

                                          <p className='text-gray-500'>{(order.createdAt).toLocaleDateString()}</p>
                                      </td>

                                      <td className='flex md:table-cell justify-between py-4'>
                                          <h2 className='md:hidden text-xl text-bold'>
                                              Customer
                                          </h2>

                                          <p className='text-gray-500 line-clamp-1'>{`${order.firstName} ${order.lastName}`}</p>
                                      </td>

                                      <td className='flex md:table-cell items-center justify-between py-4'>
                                          <h2 className='md:hidden text-xl text-bold'>
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
                                          <h1 className='md:hidden text-xl text-bold'>
                                              Amount
                                          </h1>

                                          <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>
                                              ₦{order.totalAmount.toLocaleString()}
                                          </p>
                                      </td>

                                      <td className='flex md:table-cell justify-between py-4 '>
                                          <h1 className='md:hidden text-xl text-bold'>
                                              Status
                                          </h1>

                                          <div>
                                              <p
                                              className={`capitalize w-fit px-3 py-1 rounded-full text-sm font-medium ${order.status === "pending"
                                                    ? "text-amber-700 bg-amber-100"
                                                    : order.status === "confirmed"
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
  )
}

export default AllRecOrders
