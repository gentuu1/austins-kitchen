'use client'
import { Anton } from 'next/font/google';
import Image from 'next/image'
import { meNu } from '@/app/utils/type';
import AddtoCart from '@/components/AddtoCart';
import { menu } from '@/app/utils/action';
import Favourite from '@/components/Favourite';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
const anton = Anton({ subsets: ['latin'], weight: '400' });

const MeNu = () => {

    const [products, setproducts] = useState<meNu[]>([])
    const [isSpinner, setisSpinner] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            const { product, success } = await menu()

            if (success && product) {
                setproducts(product)
            }

            setisSpinner(false)
        }

        fetch()
    }, []);

    if (isSpinner) {
        return <>
            <div className="sticky top-0 z-50">
                <NavBar />
            </div>
            <Spinner />
        </>
    }

    return (
        <div>
            <div className="sticky top-0 z-50">
                <NavBar />
            </div>

            <div className="w-full flex flex-col my-5 items-center justify-center space-y-3">
                <h1 className={`${anton.className} text-center md:text-5xl text-4xl tracking-tight`}>
                    OUR-MENU
                </h1>

                <p className={`text-center text-sm tracking-tight`}>
                    <a className='underline hover:text-[#ED8F0C]' href="/">Home</a>/Our-menu
                </p>

            </div>

            <section className=' w-full  grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 p-5 '>
                {
                    products.length !== 0 && products.map((each) => (
                        <div key={each._id} className='relative bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4'>


                            <div className='absolute top-4 right-4 z-20'>
                                <Favourite id={each._id} />
                            </div>


                            <Link href={`/menu/${each._id}`}>
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

                                <Link href={`/menu/${each._id}`}>
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

export default MeNu
