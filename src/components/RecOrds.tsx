"use client"
import Link from 'next/link'
const anton = Anton({ subsets: ['latin'], weight: '400' });
import { Anton } from 'next/font/google';
import { useCart } from '@/app/context/contextProvider';
import { useRouter } from 'next/navigation';

const RecOrds = () => {
    const { orderhst: rec, isPinner } = useCart();

    const orderhst = rec.slice(0, 10)
    const router = useRouter()

    const orderDet = (id: string) => {
        if (!id) return;

        router.push(`/dashboard/order-history/${id}`)
    }

    return (
        <div className='w-[95%] h-fit p-5 flex flex-col m-auto rounded-lg bg-white shadow-sm mt-5'>

            {
                orderhst.length === 0 && !isPinner ? (
                    <div>
                        <div className='w-full p-3 flex justify-between items-center flex-1'>
                            <h3 className='text-medium font-bold'>Recent Orders</h3>

                            <Link href='/dashboard/order-history' >
                                <p className='text-[17px] font-medium text-[#ED8F0C]'>view all</p>
                            </Link>
                        </div>

                        <div className='w-full flex-6 flex flex-col items-center justify-center rounded-sm'>
                            <h4 className='text-medium font-bold'>No recent orders found</h4>
                            <button className={`${anton.className} text-white bg-[#ED8F0C] hover:bg-[#e7b46c] py-3 px-5 mt-5 rounded-sm cursor-pointer transition-all duration-200`}>
                                Order Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className='w-full p-3 flex justify-between items-center flex-1 mb-5'>
                            <h3 className='text-medium font-bold'>Recent Orders</h3>

                            <Link href='/dashboard/order-history' >
                                <p className='text-[17px] font-medium text-[#ED8F0C]'>view all</p>
                            </Link>
                        </div>

                            {
                                isPinner && (
                                    <div className="flex justify-center items-center py-10 w-full">
                                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ED8F0C] border-t-transparent" />
                                    </div>
                                )
                            }

                            {
                                !isPinner && (
                                    <section className='w-full m-auto p-2 rounded-lg overflow-hidden '>
                                        <table className='w-full bg-white shadow-md rounded-xl overflow-hidden'>
                                            <thead className='h-8 bg-gray-50 md:table-header-group hidden'>
                                                <tr className='text-left text-gray-600 text-sm tracking-wide'>
                                                    <th className='pl-2'>
                                                        Order Id
                                                    </th>
                                                    <th className='pl-2'>
                                                        Date
                                                    </th>
                                                    <th className='pl-2'>
                                                        Products
                                                    </th>
                                                    <th className='pl-2'>
                                                        Total
                                                    </th>
                                                    <th className='pl-2'>
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    orderhst.map((order) => (
                                                        <tr onClick={() => orderDet(order._id)} key={order._id} className='hover:bg-neutral-100 focus:bg-neutral-100 cursor-pointer flex flex-col md:table-row md:p-0 p-4 mb-2 gap-3 md:gap-0'>
                                                            <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                                <h2 className='md:hidden text-xl font-bold text-gray-600'>Order Id</h2>

                                                                <p className='text-sm'>#AK-{order._id.slice(0, 8).toUpperCase()}</p>
                                                            </td>

                                                            <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                                <h2 className='md:hidden text-xl font-bold text-gray-600'>Date</h2>

                                                                <p>{order.createdAt.toLocaleDateString()}</p>
                                                            </td>

                                                            <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                                <h2 className='md:hidden text-xl font-bold text-gray-600'>Products</h2>

                                                                <p>{order.items.length.toString().padStart(2, "0")}</p>
                                                            </td>

                                                            <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                                <h2 className='md:hidden text-xl font-bold text-gray-600'>Total</h2>

                                                                <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>₦{order.totalAmount.toLocaleString()}</p>
                                                            </td>

                                                            <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                                <h2 className='md:hidden text-xl font-bold text-gray-600'>Status</h2>

                                                                <p
                                                                    className={`capitalize w-fit  px-3 py-1 rounded-full text-sm font-medium ${order.status === "pending"
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
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </section>
                                )
                            }
                    </div>
                )
            }

        </div>
    )
}

export default RecOrds
