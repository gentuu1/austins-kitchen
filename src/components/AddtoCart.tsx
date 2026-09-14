"use client"
import { useCart } from '@/app/context/contextProvider'
import { addToCart } from '@/app/utils/action'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'

interface iD {
    id: string
}

const AddtoCart = ({ id }: iD) => {
   
    

    const { add , adding} = useCart()

    const added = async (id: string) => {
       
            add(id)
        
    }
    return (
        <div>
            <div className='w-full flex flex-col'>
                <button disabled={adding === id} onClick={(e) => {
                    e.stopPropagation()
                    added(id)
                }} className='cursor-pointer mt-2 py-2.5 md:py-3 bg-[#ED8F0C] text-white rounded-lg text-sm md:text-base hover:bg-[#e07c00] transition duration-200 flex justify-center items-center'>
                    {
                        adding === id ? (<FaSpinner className="text-lg animate-spin" />) : "Add to cart"
                    }
                </button>
            </div>
        </div>
    )
}

export default AddtoCart
