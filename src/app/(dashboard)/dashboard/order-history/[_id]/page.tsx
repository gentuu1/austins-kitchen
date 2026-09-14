import { orderModel } from '@/app/models/order';
import dbConnect from '@/app/utils/dbConnects';
import { auth } from '@/app/utils/session';
import CanOrderButton from '@/components/CanOrderButton';
import ProfileNavbar from '@/components/ProfileNavbar';
import { Anton } from 'next/font/google';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import {
  FaCheckCircle, FaMotorcycle, FaMapMarkerAlt, FaPhoneAlt, FaReceipt, FaClock,
  FaBan,
} from "react-icons/fa";

const anton = Anton({ subsets: ["latin"], weight: "400", });

const Orderdts = async ({ params }: { params: { _id: string } }) => {
  await dbConnect()
  const { _id } = await params;

  const { success, _id : userId } = await auth();

  const order = await orderModel.findOne({
    _id,
    userId
  })

  if (!success) {
    redirect('/signin')
  }

  if (!order && success) {
    redirect('/dashboard/menu')
  }




  return (
    <div className="min-h-screen">

      <div className="sticky top-0 z-50">
        <ProfileNavbar />
      </div>

      <section className='w-full p-5'>
        <div className=' bg-white rounded-lg shadow-xl flex lg:flex-row flex-col gap-2 lg:justify-between p-2 lg:items-center'>
          <div className=' flex flex-col gap-1'>
            
              <h1 className={`${anton.className} text-3xl`}>
                Order #AK-{order._id.toString().slice(0, 8).toUpperCase()}
              </h1>

              <p className="text-gray-500 mt-2">
                {order.createdAt.toDateString()}
              </p>
            
          </div>


          <div>

            <CanOrderButton id={(order._id)?.toString()} orderStatus={order.status} />

          </div>
        </div>


        <div className=' grid grid:cols-1 lg:grid-cols-[2fr_1fr] gap-3 mt-3'>
          <div className=' p-2 rounded-xl bg-white shadow-xl'>
            <h2 className="font-semibold text-xl mb-2">
              Ordered Items
            </h2>

            <div className=' flex flex-col  max-h-80 overflow-y-auto'>
              {
                order.items.map((item: any, index: any) => (
                  <div key={index} className='p-2  bg-gray-50 flex justify-between border-b mb-1 border-neutral-100 items-center rounded-sm'>
                    <div className="flex gap-4 items-center">

                      <Image
                        src={item.image}
                        alt={item.title}
                        loading="eager"
                        width={90}
                        height={90}
                        className="rounded-xl object-cover"
                      />

                      <div>

                        <h3
                          className={`${anton.className} text-xl`}
                        >
                          {item.title}
                        </h3>

                        <p className="text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                      </div>

                    </div>

                    <p
                      className={`${anton.className} text-[#ED8F0C] text-xl`}
                    >
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))
              }
            </div>

            <div className='w-full '>
              <h2 className="font-semibold text-xl mb-5">
                Order Progress
              </h2>

              <div className='space-y-4'>

                <div className="flex gap-4 items-center pl-2">
                  <FaCheckCircle className="text-green-500 text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold">
                      Order Received
                    </h3>
                    <p className="text-sm text-gray-500">
                      Your order has been placed successfully.
                    </p>
                  </div>
                </div>

                {
                  order.paymentStatus === 'success' && order.status !== 'cancelled' && (
                    <div className="flex gap-4 items-center pl-2">
                      <FaReceipt className="text-green-500 text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold">
                          Payment Confirmed
                        </h3>
                        <p className="text-sm text-gray-500">
                          Payment has been verified.
                        </p>
                      </div>
                    </div>
                  )
                }

                {
                  order.paymentStatus === "refunded" &&
                  order.status === "cancelled" && (
                    <div className="flex gap-4 items-center pl-2">
                      <FaBan className="text-red-500 text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold">
                          Order Cancelled
                        </h3>
                        <p className="text-sm text-gray-500">
                          Your order has been cancelled
                        </p>
                      </div>
                    </div>
                  )
                }

                {
                  order.paymentStatus === "success" && order.status !== "cancelled" && (
                    <div className="flex gap-4 items-center pl-2">
                      {order.status === "pending" && (
                        <>
                          <FaClock className="text-amber-500 text-xl mt-1" />
                          <div>
                            <h3 className="font-semibold">Pending Confirmation</h3>
                            <p className="text-sm text-gray-500">
                              Your order is waiting for the restaurant to accept it.
                            </p>
                          </div>
                        </>
                      )}

                      {order.status === "confirmed" && (
                        <>
                          <FaCheckCircle className="text-blue-500 text-xl mt-1" />
                          <div>
                            <h3 className="font-semibold">Order Confirmed</h3>
                            <p className="text-sm text-gray-500">
                              Your order has been accepted and will be prepared shortly.
                            </p>
                          </div>
                        </>
                      )}

                      {order.status === "preparing" && (
                        <>
                          <div className='animate-pulse'><FaClock className="text-orange-500 text-xl mt-1" /></div>
                          <div>
                            <h3 className="font-semibold">Preparing Your Meal</h3>
                            <p className="text-sm text-gray-500">
                              Our chefs are preparing your order.
                            </p>
                          </div>
                        </>
                      )}

                      {order.status === "ready" && (
                        <>
                          <FaCheckCircle className="text-emerald-500 text-xl mt-1 animate-pulse" />
                          <div>
                            <h3 className="font-semibold">Ready for Pickup</h3>
                            <p className="text-sm text-gray-500">
                              Your order is ready and waiting for dispatch.
                            </p>
                          </div>
                        </>
                      )}

                      {order.status === "out-for-delivery" && (
                        <>
                          <FaMotorcycle className="text-violet-500 text-xl mt-1" />
                          <div>
                            <h3 className="font-semibold">Out for Delivery</h3>
                            <p className="text-sm text-gray-500">
                              Your rider is on the way with your order.
                            </p>
                          </div>
                        </>
                      )}

                      {order.status === "delivered" && (
                        <>
                          <FaCheckCircle className="text-green-500 text-xl mt-1" />
                          <div>
                            <h3 className="font-semibold">Order Delivered</h3>
                            <p className="text-sm text-gray-500">
                              Your order has been delivered successfully.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )
                }



              </div>
            </div>

          </div>


          <div className="bg-white rounded-xl shadow-xl border border-neutral-200 p-5 h-fit">

            
            <div className="pb-5 border-b">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-[#ED8F0C]" />
                </div>

                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    Delivery Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    Where your order will be delivered
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">

                <div>
                  <p className="text-gray-400 mb-1">Address</p>
                  <p className="font-medium text-gray-700">
                    {order.deliveryAddress.street}
                  </p>
                  <p className="text-gray-500">
                    {order.deliveryAddress.town}, {order.deliveryAddress.state}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <FaPhoneAlt className="text-gray-400" />
                  <span className="text-gray-700">
                    {order.phoneNumber}
                  </span>
                </div>

              </div>
            </div>


                
            <div className="py-5 border-b">

              <h2 className="font-semibold text-lg text-gray-800 mb-4">
                Payment Summary
              </h2>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Items
                  </span>

                  <span className="font-medium text-gray-700">
                    ₦{(
                      order.totalAmount - order.deliveryfee
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Delivery fee
                  </span>

                  <span className="font-medium text-gray-700">
                    ₦{order.deliveryfee.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold text-gray-800">
                    Total
                  </span>

                  <span className={`${anton.className} text-xl text-[#ED8F0C]`}>
                    ₦{order.totalAmount.toLocaleString()}
                  </span>
                </div>

              </div>

            </div>


            
            <div className="pt-2">

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  Payment Status
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
          ${order.paymentStatus === "success"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "refunded"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }
        `}
                >
                  {order.paymentStatus}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Payment Reference
                </p>

                <p className="text-sm font-mono text-gray-600 break-all">
                  {order.paymentReference}
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  )
}

export default Orderdts
