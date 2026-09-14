"use client"
import { useCart } from '@/app/context/contextProvider';
import ProfileNavbar from '../../../../components/ProfileNavbar'
import { Anton, Pacifico } from 'next/font/google';
import Image from 'next/image'
import { FaHeart } from 'react-icons/fa6';
import AddtoCart from '@/components/AddtoCart';
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/navigation';
const anton = Anton({ subsets: ['latin'], weight: '400' });

const Favourite = () => {
    const { fav, removeSave, remove } = useCart()
    const [isSpinner, setisSpinner] = useState(true)
    const router = useRouter()

    useEffect(() => {
        setisSpinner(false)
    }, [])

    if (isSpinner) {
        return <>
            <div className='sticky top-0 w-full z-50'>
                <ProfileNavbar />
            </div>
            <Spinner />
        </>
    }
    return (
        <div>
            <div className='sticky top-0 w-full z-50'>
                <ProfileNavbar />
            </div>
            <div className='md:hidden p-5'>
                <h1 className={`${anton.className} text-3xl font-bold tracking-wide`}>Favourites</h1>
            </div>

            {
                fav.length === 0 ? (
                    <div className='flex flex-col items-center justify-center min-h-[65vh] text-center'>
                        <div className='w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center mb-6'>
                            <FaHeart className='text-5xl text-[#ED8F0C]' />
                        </div>

                        <h2 className={`${anton.className} text-3xl tracking-wide text-gray-800`}>
                            No Favourite Products Yet
                        </h2>

                        <p className='mt-3 text-gray-500 max-w-md leading-7'>
                            You haven't added any products to your favourites.
                            Browse our menu and tap the heart icon to save your favourite meals.
                        </p>
                    </div>
                ) : (
                    <div className='w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 p-5 '>
                        {
                            fav.map((each) => (
                                <div onClick={() => router.push(`/dashboard/menu/${each._id}`)} key={each._id} className='cursor-pointer bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4'>

                                    <div className='w-full h-40 md:h-44 lg:h-40 rounded-xl overflow-hidden'>
                                        <Image
                                            src={each.image}
                                            alt='shawar'
                                            height={500}
                                            width={500}
                                            className='w-full h-full object-cover hover:scale-105 transition duration-300'
                                        />
                                    </div>

                                    <div className='flex flex-col gap-2 text-center'>

                                        <h2 className={`${anton.className} text-lg md:text-xl tracking-wide text-gray-800`}>
                                            {each.title}
                                        </h2>

                                        <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>
                                            {each.price}
                                        </p>

                                        {/* ACTION BUTTONS */}
                                        <div className='flex flex-col gap-2 mt-2'>


                                            <AddtoCart id={each._id} />


                                            <button onClick={(e) => {
                                                e.stopPropagation()
                                                removeSave(each._id)
                                            }} className='cursor-pointer py-2.5 md:py-3 border border-red-400 text-red-500 rounded-lg text-sm md:text-base hover:bg-red-50 transition'>
                                                {
                                                    remove == each._id ? "Removing..." : 'Remove'
                                                }
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            ))
                        }

                    </div>
                )
            }
        </div>
    )
}

export default Favourite
