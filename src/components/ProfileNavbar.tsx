"use client"
import { useCart } from '@/app/context/contextProvider'
import { product } from '@/app/utils/type'
import { useFormik } from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { FaSearch, FaSpinner, FaTimes } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'

const ProfileNavbar = () => {
    const [openCart, setopenCart] = useState(false);
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const { decRease, user_pro, subTotal, cart } = useCart()

    const search = (value: string) => {
        const params = new URLSearchParams(searchParams.toString().trim())

        if (!value) {
            params.delete('search')
        } else {
            params.set('search', value.trim().toLowerCase().toString())
        }

        router.push(params.toString() ? `/dashboard/menu?${params.toString()}` : '/dashboard/menu')
    }

    const searchFormik = useFormik({
        initialValues: {
            search: ''
        },
        onSubmit: (values) => {
            startTransition(() => {
                search(values.search)
            })
        }
    })
    return (
        <div >
            <nav className='relative lg:bg-zinc-50 bg-[#1F2933] border-b border-neutral-300 w-full  lg:h-20 h-30 flex justify-end items-center gap-2 px-5 shadow-sm z-50'>

                {
                    pathname == '/dashboard/menu' && (
                        <div className={`absolute left-2 flex items-center h-10 md:h-11 bg-white rounded-full shadow-sm border border-neutral-200 overflow-hidden`}>

                            <input
                                onChange={searchFormik.handleChange}
                                value={searchFormik.values.search}
                                name='search'
                                type="text"
                                placeholder='Search menu...'
                                className='w-36 md:w-48 lg:w-56 h-full px-3 text-sm md:text-base outline-none bg-transparent placeholder:text-gray-400'
                            />

                            <button onClick={() => searchFormik.handleSubmit()} type='button' className='h-full w-10 md:w-11 flex items-center justify-center bg-[#ED8F0C] hover:bg-[#e07c00] transition cursor-pointer'>
                                <div className='bg-white/20 p-2 rounded-full flex items-center justify-center '>
                                    {
                                        isPending ? (<FaSpinner className="text-sm text-white animate-spin" />) : (<FaSearch className="text-white text-sm" />)
                                    }
                                </div>
                            </button>

                        </div>
                    )
                }

                {
                    pathname !== '/dashboard/menu' && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 lg:hidden">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden">
                                <Image
                                    src="/img/logo.png"
                                    alt="Austin Kitchen"
                                    width={700}
                                    height={700}
                                    loading='eager'
                                    className="w-full h-full object-cover scale-125"
                                />
                            </div>
                        </div>
                    )
                }

                <div className='flex items-center p-3 hover:text-[#ED8F0C] cursor-pointer transition-all duration-300 lg:text-black text-white '>
                    <FaCartShopping onClick={() => setopenCart(true)} className="md:text-2xl text-medium " />
                    <p onClick={() => setopenCart(true)} className='md:text-2xl font-medium '>/₦{(subTotal).toLocaleString()}</p>
                </div>

                <Link href='/dashboard/profile'>
                    <div className='size-14 rounded-full overflow-hidden cursor-pointer '>
                        <Image
                            src={user_pro?.profilePic || "/img/profileimage.jpg"}
                            alt='profile'
                            loading="eager"
                            height={500}
                            width={500}
                            className='h-full w-full object-cover shrink-0'
                        />
                    </div>
                </Link>

                <div className={`${openCart ? 'fixed' : 'hidden'} pb-20 lg:pb-10 bg-white  h-screen w-full md:w-130 lg:w-120  md:right-0 md:left-auto left-0 top-0 overflow-y-scroll`}>
                    <nav className='w-full h-24 bg-[#1F2933] flex justify-between items-center px-4 sticky top-0'>
                        <h2 className='text-white text-2xl font-bold'>CART</h2>

                        <FaTimes onClick={() => setopenCart(false)} className='text-2xl cursor-pointer text-white' />
                    </nav>

                    <div className='w-full h-fit flex flex-col p-4 md:p-5 space-y-3'>

                        {
                            cart.length !== 0 && cart.map((each: product) => (
                                <div key={each._id} className='min-h-24 flex items-center gap-3 border-b rounded-lg p-2 md:p-3'>

                                    <div className='w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden shrink-0'>
                                        <Image
                                            src={each.image}
                                            alt='shawar'
                                            loading="eager"
                                            height={500}
                                            width={500}
                                            className='h-full w-full object-cover'
                                        />
                                    </div>

                                    <div className='flex-1 flex flex-col justify-center gap-1'>
                                        <h3 className='text-base md:text-lg font-semibold tracking-wide truncate'>
                                            {each.title}
                                        </h3>

                                        <p className='text-[#ED8F0C] text-lg md:text-xl font-medium'>
                                            <span className='mr-1 text-gray-400 text-sm'>{each.quantity} x</span>
                                            ₦{(each.price).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className='flex items-center justify-center'>
                                        <FaTimes onClick={() => decRease(each._id)} className='text-base md:text-lg cursor-pointer hover:text-red-500 transition' />
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <main className=' w-full h-fit mt-5'>
                        <div className='border-y border-neutral-300 w-full flex justify-between p-5 items-center'>
                            <h1 className='font-bold text-2xl '>SUBTOTAL:</h1>
                            <h1 className='font-bold text-2xl text-[#ED8F0C]'>₦{(subTotal).toLocaleString()}</h1>
                        </div>

                        <div className='w-full flex flex-col gap-5  p-5 '>
                            <Link className='w-full flex flex-col' href='/dashboard/cart-order'>
                                <button className='cursor-pointer py-3  bg-neutral-200 text-lg hover:bg-gray-100 transition rounded-lg'>
                                    VIEW CART
                                </button>
                            </Link>


                            <button
                                disabled={cart.length === 0}
                                onClick={() => router.push('/dashboard/check-out')}
                                className={`${cart.length === 0 ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer hover:bg-[#e1af69] bg-[#ED8F0C]'} py-3 text-white text-lg transition rounded-lg`}>
                                CHECKOUT
                            </button>
                        </div>
                    </main>

                </div>
            </nav>
        </div>
    )
}

export default ProfileNavbar
