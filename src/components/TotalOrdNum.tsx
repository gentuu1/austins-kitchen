"use client"
import { useCart } from '@/app/context/contextProvider'
import { FaShoppingBag } from 'react-icons/fa'

const TotalOrdNum = () => {
    const { toTalordNum } = useCart()
    return (

        <div className=' md:flex-1 w-full lg:h-28 md:h-36 h-34 bg-white shadow-sm rounded-xl items-center md:gap-5 lg:gap-3 gap-5 p-4 flex flex-col'>
            <div className='flex w-full justify-between items-center '>
                <div className='bg-[#ED8F0C]/20 p-3 rounded-full'>
                    <FaShoppingBag className='text-[#ED8F0C] text-lg' />
                </div>
                <p className='text-gray-600 md:text-xl font-semibold '>Total Orders</p>
            </div>

            <p className='text-2xl font-bold text-gray-800'>{toTalordNum <= 0 ? `0` : toTalordNum <= 9 ? `0${toTalordNum}` : `${toTalordNum}`}</p>
        </div>
    )
}

export default TotalOrdNum
