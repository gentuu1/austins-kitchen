"use client"
import { useCart } from '@/app/context/contextProvider'
import { FaHeart, FaSpinner } from 'react-icons/fa'

interface iD {
    id : string
}

const Favourite = ({id} : iD) => {
    const {save, saVing} = useCart()
    return (
        <div className=''>
            <button disabled={ saVing === id} onClick={()=>save(id)} className='group cursor-pointer size-11 rounded-full bg-gray-100 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95'>
                {
                    saVing === id  ? (<FaSpinner className="text-gray-400 text-xl animate-spin" />): <FaHeart className = 'text-gray-400 text-xl group-hover:text-[#ED8F0C] transition-all duration-300' />
                }
            </button>
        </div>
    )
}

export default Favourite
