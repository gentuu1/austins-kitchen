'use client'

import { useCart } from "@/app/context/contextProvider"
import { FaSpinner } from "react-icons/fa"
import { MdClose } from "react-icons/md"

const CanOrderButton = (id : {id : string, orderStatus : string}) => {
    const {canLoading, canOrder, rvLoading, rvOrder} = useCart()
  return (
      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-fit">

          {/* Cancel Order */}
          <button
              disabled={canLoading === id.id || id.orderStatus !== 'pending'}
              onClick={() => canOrder(id.id)}
              type="button"
              className={`flex-1 lg:flex-none  min-w-0 rounded-lg px-4 py-3 transition flex items-center justify-center
                    ${id.orderStatus === 'pending'
                      ? 'bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
          >
              {canLoading === id.id ? (
                  <FaSpinner className="text-xl animate-spin" />
              ) : (
                  <MdClose className="text-xl" />
              )}
          </button>


          {/* Mark as Received */}
          <button
                onClick={()=>rvOrder(id.id)}
              disabled={id.orderStatus !== 'out-for-delivery'}
              type="button"
              className={`flex flex-col justify-center items-center flex-1 lg:flex-none min-w-0 px-4 py-3 rounded-lg whitespace-nowrap transition font-medium
                    ${id.orderStatus === 'out-for-delivery'
                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
          >
              {id.orderStatus === 'delivered'
                  ? 'Received' : rvLoading === id.id ? (<FaSpinner className=" animate-spin" />)
                  : "I've received it"
              }
          </button>


    </div>
  )
}

export default CanOrderButton
