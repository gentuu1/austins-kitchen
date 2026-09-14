'use client'
import { FaNairaSign } from 'react-icons/fa6'

const TotalRev = () => {
    
  return (

          <div className='md:flex-1 w-full lg:h-28 md:h-36 h-34 bg-white shadow-sm rounded-xl items-center lg:gap-3 gap-5 p-4 flex flex-col'>
              <div className='flex w-full  justify-between items-center '>
                  <div className='bg-[#ED8F0C]/20 p-3 rounded-full'>
                      <FaNairaSign className='text-[#ED8F0C] text-lg' />
                  </div>
                  <p className='text-gray-600 md:text-xl font-semibold '>Total Revenue</p>
              </div>

              <p className='text-2xl font-bold text-gray-800'>0</p>
          </div>

  )
}

export default TotalRev
