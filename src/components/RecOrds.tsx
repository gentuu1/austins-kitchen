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
        <div className='w-[95%] h-fit p-2 flex flex-col m-auto rounded-lg bg-white dark:bg-[#1A1C22] shadow-sm mt-5'>

            {
                orderhst.length === 0 && !isPinner ? (
                    <div>
                        <div className='w-full p-3 flex justify-between items-center flex-1'>
                            <h3 className='text-medium font-bold dark:text-white'>Recent Orders</h3>

                            <Link href='/dashboard/order-history'>
                                <p className='text-[17px] font-medium text-[#ED8F0C]'>view all</p>
                            </Link>
                        </div>

                        <div className='w-full flex-6 flex flex-col items-center justify-center rounded-sm'>
                            <h4 className='text-medium font-bold dark:text-white'>No recent orders found</h4>
                            <button className={`${anton.className} text-white bg-[#ED8F0C] hover:bg-[#e7b46c] py-3 px-5 mt-5 rounded-sm cursor-pointer transition-all duration-200`}>
                                Order Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className='w-full p-3 flex justify-between items-center flex-1 mb-5'>
                            <h3 className='text-medium font-bold dark:text-white'>Recent Orders</h3>

                            <Link href='/dashboard/order-history'>
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
                                <section className='w-full m-auto p-2 rounded-lg overflow-hidden'>
                                    <table className='w-full bg-white dark:bg-[#1A1C22] shadow-md rounded-xl overflow-hidden'>
                                        <thead className='h-8 bg-gray-50 dark:bg-gray-800 md:table-header-group hidden'>
                                            <tr className='text-left text-gray-600 dark:text-gray-300 text-sm tracking-wide'>
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
                                                    <tr
                                                        onClick={() => orderDet(order._id)}
                                                        key={order._id}
                                                        className='hover:bg-neutral-100 dark:hover:bg-gray-800 focus:bg-neutral-100 dark:focus:bg-gray-800 cursor-pointer flex flex-col md:table-row md:p-0 p-4 mb-2 gap-3 md:gap-0'
                                                    >
                                                        <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                            <h2 className='md:hidden text-xl font-bold text-gray-600 dark:text-gray-300'>Order Id</h2>

                                                            <p className='text-sm dark:text-gray-200'>#AK-{order._id.slice(0, 8).toUpperCase()}</p>
                                                        </td>

                                                        <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                            <h2 className='md:hidden text-xl font-bold text-gray-600 dark:text-gray-300'>Date</h2>

                                                            <p className='dark:text-gray-200'>{order.createdAt.toLocaleDateString()}</p>
                                                        </td>

                                                        <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                            <h2 className='md:hidden text-xl font-bold text-gray-600 dark:text-gray-300'>Products</h2>

                                                            <p className='dark:text-gray-200'>{order.items.length.toString().padStart(2, "0")}</p>
                                                        </td>

                                                        <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                            <h2 className='md:hidden text-xl font-bold text-gray-600 dark:text-gray-300'>Total</h2>

                                                            <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>
                                                                ₦{order.totalAmount.toLocaleString()}
                                                            </p>
                                                        </td>

                                                        <td className='flex md:table-cell justify-between py-2 pl-2'>
                                                            <h2 className='md:hidden text-xl font-bold text-gray-600 dark:text-gray-300'>Status</h2>

                                                            <p
                                                                className={`capitalize w-fit px-3 py-1 rounded-full text-sm font-medium ${order.status === "pending"
                                                                    ? "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950"
                                                                    : order.status === "confirmed"
                                                                        ? "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-950"
                                                                        : order.status === "preparing"
                                                                            ? "text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-950"
                                                                            : order.status === "ready"
                                                                                ? "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950"
                                                                                : order.status === "delivered"
                                                                                    ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-950"
                                                                                    : order.status === "out-for-delivery"
                                                                                        ? "text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-950"
                                                                                        : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950"
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
