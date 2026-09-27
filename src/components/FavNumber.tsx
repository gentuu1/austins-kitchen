"use client"
import { useCart } from '@/app/context/contextProvider'
import { FaHeart } from 'react-icons/fa'

const FavNumber = () => {
    const {favNumber} = useCart()
    return (
        <div className=' md:flex-1 w-full lg:h-28 md:h-36 h-34 bg-white dark:bg-[#1A1C22] shadow-sm rounded-xl items-center md:gap-5 lg:gap-3 gap-5 p-4 flex flex-col'>
            <div className='flex w-full  justify-between items-center '>
                <div className='bg-[#ED8F0C]/20 p-3 rounded-full'>
                    <FaHeart className='text-[#ED8F0C] text-lg' />
                </div>
                <p className='text-gray-600 md:text-xl font-semibold dark:text-gray-300'>Favourites</p>
            </div>

            <p className='text-2xl font-bold text-gray-800 dark:text-white'>{favNumber <= 0 ? `0` : favNumber <= 9 ? `0${favNumber}` : `${favNumber}`}</p>
        </div>

    )
}

export default FavNumber
