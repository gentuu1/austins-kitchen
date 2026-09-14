"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { FaBox, FaCog, FaHome, FaShoppingBag, FaUsers } from "react-icons/fa";
import { signOut } from "../utils/action";
import { toast } from "react-toastify";
import { CartProvider } from "../context/contextProvider";

export default function AdminLayout({children,}:{children:ReactNode}){
    const pathname = usePathname()
    const router = useRouter()
    
    const logout = async()=>{
        const res = await signOut()

        if(!res.success){
            toast.error(res.message, {
                autoClose : 1500
            })

            return;
        }

        toast.success(res.message, {
            autoClose : 1500
        })
        router.push('/signin')
    }

    return (
        <div className="w-screen h-screen flex lg:flex-row  flex-col-reverse">

            <div className="lg:w-62 w-full lg:relative fixed bottom-0 lg:h-screen justify-between h-fit md:p-2 lg:p-0 bg-[#1F2933] text-white z-50">
               
                <div className=" lg:flex lg:flex-col p-5 items-center hidden">
                    <h1 className="text-2xl font-bold">
                        Admin Panel
                    </h1>
                </div>

                <div className=" w-full h-fit p-5 flex lg:flex-col lg:space-y-3 justify-between">
                    <Link href='/admin-dashboard'>
                        <div className={`p-2 md:flex-col lg:flex-row flex items-center gap-2 hover:bg-gray-700 transition-all duration-200  ${pathname === '/admin-dashboard' && 'bg-[#ED8F0C]'} rounded-lg`}>

                            <FaHome className="text-lg" />
                            <p className="hidden lg:block md:block font-medium">Dashboard</p>
                        </div>
                    </Link>

                    <Link href='/admin-dashboard/products'>
                        <div className={`p-2 md:flex-col lg:flex-row flex items-center gap-2 hover:bg-gray-700 transition-all duration-200 ${pathname === '/admin-dashboard/products' && 'bg-[#ED8F0C]'} rounded-lg`}>
                            <FaBox className="text-lg" />
                            <p className="hidden lg:block md:block font-medium">Products</p>
                        </div>
                    </Link>

                    <Link href='/admin-dashboard/customers'>
                        <div className={`p-2 md:flex-col lg:flex-row flex items-center gap-2 hover:bg-gray-700 transition-all duration-200  ${pathname === '/admin-dashboard/customers' && 'bg-[#ED8F0C]'} rounded-lg`}>
                            <FaUsers className="text-lg" />
                            <p className="hidden lg:block md:block font-medium">Customers</p>
                        </div>
                    </Link>

                    <Link href='/admin-dashboard/orders'>
                        <div className={`p-2 md:flex-col lg:flex-row flex items-center gap-2 hover:bg-gray-700 transition-all duration-200  ${pathname === '/admin-dashboard/orders' && 'bg-[#ED8F0C]'} rounded-lg`}>
                            <FaShoppingBag className="text-lg" />
                            <p className="hidden lg:block md:block font-medium">Orders</p>
                        </div>
                    </Link>

                    <Link href='/admin-dashboard/profile'>
                    <div className={`p-2 md:flex-col lg:flex-row flex items-center gap-2 hover:bg-gray-700 transition-all duration-200  ${pathname === '/admin-dashboard/profile' && 'bg-[#ED8F0C]'}  text-red-500 rounded-lg`}>
                        <FaCog className="text-lg" />
                        <p className="hidden lg:block md:block font-medium text-red-500">Settings</p>
                    </div>

                    </Link>


                </div>

                <div className="w-full hidden h-fit lg:flex flex-col mt-16 px-5 ">
                    <button 
                        onClick={()=>logout()}
                        type="button"
                         className="py-3 rounded-lg cursor-pointer border border-red-600 hover:bg-gray-700 hover:text-red-500 transition ">
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-zinc-50 overflow-auto lg:pb-0 pb-24">
                <CartProvider>
                    {children}
                </CartProvider>
            </div>
        </div>
    )
}