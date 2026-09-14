"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { FaClock, FaHeart, FaHistory, FaHome } from "react-icons/fa";
import { GiHamburger } from "react-icons/gi";
import { CartProvider } from "../context/contextProvider";
import { signOut } from "../utils/action";
import { toast } from "react-toastify";


export default function DashboardLayout({ children, }: { children: ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()

    const logout = async () => {
        const res = await signOut()

        if (!res.success) {
            toast.error(res.message, {
                autoClose: 1500
            })

            return;
        }

        toast.success(res.message, {
            autoClose: 1500
        })
        router.push('/signin')
    }
    return (
        <div className="bg-zinc-50 w-screen h-screen lg:flex-row flex md:flex-col-reverse flex-col-reverse">

            <div className={`border-t shadow-2xl lg:border-t-0 lg:shadow-none w-full lg:w-62 fixed bottom-0 left-0 md:fixed lg:relative lg:bg-zinc-100 bg-[#1F2933] z-50 `}>

                <div className="relative lg:flex hidden items-center  w-full h-26 bg-[#1F2933]">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-20 w-32">
                        <Image
                            src="/img/logo.png"
                            alt="logo"
                            width={600}
                            height={600}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                <div className=" w-full h-fit p-5 flex lg:flex-col lg:space-y-3 justify-between text-gray-700 ">

                    <Link href='/dashboard'>
                        <div className={`${pathname == '/dashboard' && 'border border-[#ED8F0C]'} md:w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-[#ED8F0C] transition md:flex-col lg:flex-row`}>
                            <FaHome className="text-lg" />
                            <p className="hidden lg:block md:block font-medium">HOME</p>
                        </div>
                    </Link>

                    <Link href='/dashboard/menu'>
                        <div className={`${pathname == '/dashboard/menu' && 'border border-[#ED8F0C]'} flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-[#ED8F0C] transition md:flex-col lg:flex-row`}>
                            <GiHamburger className="text-lg" />
                            <p className="hidden lg:block md:block font-medium">MENU</p>
                        </div>
                    </Link>

                    <Link href='/dashboard/order-history'>
                        <div className={`${pathname == '/dashboard/order-history' && 'border border-[#ED8F0C]'} flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-[#ED8F0C] transition md:flex-col lg:flex-row`}>
                            <FaHistory className="text-lg" />
                            <p className="hidden lg:block md:block font-medium">ORDER HISTORY</p>
                        </div>
                    </Link>

                    <Link href='/dashboard/favourite'>
                        <div className={`${pathname == '/dashboard/favourite' && 'border border-[#ED8F0C]'} flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-[#ED8F0C] transition md:flex-col lg:flex-row`}>
                            <FaHeart className="text-lg" />
                            <p className="hidden lg:block md:block font-medium">FAVOURITES</p>
                        </div>
                    </Link>

                    <Link href='/dashboard/pending-orders'>
                        <div className={`${pathname == '/dashboard/pending-orders' && 'border border-[#ED8F0C]'} flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-[#ED8F0C] transition md:flex-col lg:flex-row`}>
                            <FaClock className="text-lg" />
                            <p className="hidden lg:block md:block font-medium">PENDING ORDERS</p>
                        </div>
                    </Link>

                </div>

                <div className="w-full hidden h-fit lg:flex flex-col lg:mt-14 mt-18 px-5 ">
                    <button
                        onClick={logout}
                        type="button"
                        className="py-3 rounded-lg cursor-pointer border border-red-600 hover:bg-gray-100 hover:text-red-500 transition ">
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto lg:pb-0 md:pb-26 pb-24">
                <CartProvider>
                    {children}
                </CartProvider>
            </div>


        </div>
    )
}