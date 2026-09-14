import ProfileNavbar from '../../../components/ProfileNavbar'
import dbConnect from '@/app/utils/dbConnects';
import { VerifyUser } from '@/app/utils/session';
import { redirect } from 'next/navigation';
import FavNumber from '@/components/FavNumber';
import PendNum from '@/components/PendNum';
import TotalOrdNum from '@/components/TotalOrdNum';
import RecOrds from '@/components/RecOrds';

const Dashboard = async() => {
            
            await dbConnect();

            const { success, user } = await VerifyUser();

            if (!success) {
                redirect('/signin')
            }

    return (
        <div>
            <div className='sticky top-0 w-full z-50'>
                           <ProfileNavbar />
                       </div>

            <div className='p-5'>
                <h1 className='text-3xl font-bold '>Welcome back! {user.firstName + " " + user.lastName}</h1>
            </div>

            <section className='w-full flex md:flex-row flex-col gap-5 px-5 md:py-3 p-5 items-center mt-5 md:mt-10 lg:mt-10'>

                <TotalOrdNum/>
                  <FavNumber/> 
                  <PendNum/> 

                {/* <div className=' md:flex-1 w-full lg:h-28 md:h-36 h-34 bg-white shadow-sm rounded-xl items-center md:gap-5 lg:gap-3 gap-5 p-4 flex flex-col'>
                    <div className='flex w-full  justify-between items-center '>
                        <div className='bg-[#ED8F0C]/20 p-3 rounded-full'>
                            <FaHeart className='text-[#ED8F0C] text-lg' />
                        </div>
                        <p className='text-gray-600 md:text-xl font-semibold '>Favourites</p>
                    </div>

                    <p className='text-2xl font-bold text-gray-800'>0</p>
                </div> */}


              

            </section>


           <RecOrds/>
        </div>
    )
}

export default Dashboard
