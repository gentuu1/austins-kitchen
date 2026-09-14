import { Anton } from 'next/font/google';
import Image from 'next/image'
import ProfileNavbar from '../../../../components/ProfileNavbar';
import { meNu } from '@/app/utils/type';
import AddtoCart from '@/components/AddtoCart';
import { menu } from '@/app/utils/action';
import Favourite from '@/components/Favourite';
import Link from 'next/link';
import dbConnect from '@/app/utils/dbConnects';
import { auth } from '@/app/utils/session';
import { redirect } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
const anton = Anton({ subsets: ['latin'], weight: '400' });

const Menu = async ({ searchParams }: { searchParams: Promise<{ search?: string }> }) => {

  const { search } = await searchParams

  await dbConnect()

  const { success: suc } = await auth()

  if (!suc) {
    redirect('/menu')
  }


  const { product, success } = await menu()


  let products: meNu[] = []

  if (success && product) {
    products = product
  }

  if (search) {
    products = product.filter(
      pro => pro.title.toString().trim().toLowerCase().includes(search.toString().trim().toLowerCase())
    )
  }









  return (
    <div>
      <div className='sticky top-0 w-full z-50'>
        <ProfileNavbar />
      </div>

      {
        products.length === 0 && (
          <div className="w-full py-20 px-5 flex flex-col items-center justify-center text-center gap-3">
            <FaSearch className="text-4xl text-gray-300" />

            <h2 className={`${anton.className} text-2xl text-gray-700`}>
              No Products Found
            </h2>
          </div>
        )
      }

      <section className=' w-full mt-5 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 p-5 '>
        {
          products.length !== 0 && products.map((each) => (
            <div key={each._id} className='relative bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4'>


              <div className='absolute top-4 right-4 z-20'>
                <Favourite id={each._id} />
              </div>


              <Link href={`/dashboard/menu/${each._id}`}>
                <div className='w-full h-40 md:h-44 lg:h-40 rounded-xl overflow-hidden'>
                  <Image
                    src={each.image}
                    alt='image'
                    loading='eager'
                    height={500}
                    width={500}
                    className='w-full h-full object-cover hover:scale-105 transition duration-300'
                  />
                </div>
              </Link>


              <div className='flex flex-col gap-2 text-center'>

                <Link href={`/dashboard/menu/${each._id}`}>
                  <div className='flex flex-col gap-2 text-center'>
                    <h2 className={`${anton.className} text-lg md:text-xl tracking-wide text-gray-800`}>
                      {each.title}
                    </h2>

                    <p className={`${anton.className} text-lg md:text-xl text-[#ED8F0C] tracking-wide`}>
                      ₦{(each.price).toLocaleString()}
                    </p>
                  </div>

                </Link>

                <div className='flex flex-col'>
                  <AddtoCart id={each._id.toString()} />
                </div>

              </div>
            </div>
          ))
        }
      </section>
    </div>
  )
}

export default Menu
