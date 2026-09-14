import {  allOrder, customers, fectchProduct } from "@/app/utils/action"
import dbConnect from "@/app/utils/dbConnects"
import { VerifyUser } from "@/app/utils/session"
import { ctmrs } from "@/app/utils/type"
import AllRecOrders from "@/components/AllRecOrders"
import { redirect } from "next/navigation"
import {  FaShoppingBag, FaUsers } from "react-icons/fa"
import { FaNairaSign } from "react-icons/fa6"


const Admindashboard = async () => {

    await dbConnect();

    const { success: succ, user } = await VerifyUser();

    if (!succ) {
        redirect('/signin')
    }

    if (user.role !== 'admin') {

        redirect('/signin')
    }

    

    let products: {
        _id: string
        title: string,
        description: string
        image: string
        createdAt: Date
        price: number
        status: string
        purchaseCount: number,
        revenue: number
    }[] | [];

    const { success, cusTomers } = await customers();
    if (!success) redirect('/signin');

    const { products: prods } = await fectchProduct();

    products = prods || [];
    const cusTs: ctmrs[] | [] = cusTomers || [];

    const rev = products.length > 0 ? products.reduce((sum, num) =>
        sum + num.revenue
        , 0) : 0


    const {orders} = await allOrder()


    return (
        <div>
            <div className='p-5'>
                <h1 className='text-3xl font-bold '>Welcome back! <span className="capitalize">{user.firstName + " " + user.lastName}</span></h1>
            </div>

            <section className='w-full flex md:flex-row flex-col gap-5 md:px-5 md:py-3 p-3 items-center '>

                <div className=' md:flex-1 w-full lg:h-28 md:h-36 h-34 bg-white shadow-sm rounded-xl items-center lg:gap-3 gap-5 p-4 flex flex-col'>
                    <div className='flex w-full  justify-between items-center '>
                        <div className='bg-[#ED8F0C]/20 p-3 rounded-full'>
                            <FaShoppingBag className='text-[#ED8F0C] text-lg' />
                        </div>
                        <p className='text-gray-600 md:text-xl font-semibold '>Total Orders</p>
                    </div>

                    <p className='text-2xl font-bold text-gray-800'>{String(orders?.length).padStart(2, "0")}</p>
                </div>


                <div className='md:flex-1 w-full lg:h-28 md:h-36 h-34 bg-white shadow-sm rounded-xl items-center lg:gap-3 gap-5 p-4 flex flex-col'>
                    <div className='flex w-full justify-between items-center '>
                        <div className='bg-[#ED8F0C]/20 p-3 rounded-full'>
                            <FaUsers className='text-[#ED8F0C] text-lg' />
                        </div>
                        <p className='text-gray-600 md:text-xl font-semibold '>Total Customers</p>
                    </div>

                    <p className='text-2xl font-bold text-gray-800'>{String(cusTs.length).padStart(2, '0')}</p>
                </div>


                <div className='md:flex-1 w-full lg:h-28 md:h-36 h-34 bg-white shadow-sm rounded-xl items-center lg:gap-3 gap-5 p-4 flex flex-col'>
                    <div className='flex w-full  justify-between items-center '>
                        <div className='bg-[#ED8F0C]/20 p-3 rounded-full'>
                            <FaNairaSign className='text-[#ED8F0C] text-lg' />
                        </div>
                        <p className='text-gray-600 md:text-xl font-semibold '>Total Revenue</p>
                    </div>

                    <p className='text-2xl font-bold text-gray-800'>₦{(rev).toLocaleString()}</p>
                </div>

            </section>

            <AllRecOrders/>

            
        </div>


    )
}

export default Admindashboard
