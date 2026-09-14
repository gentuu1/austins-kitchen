import { productModel } from "@/app/models/product";
import { alsoLike } from "@/app/utils/action";
import dbConnect from "@/app/utils/dbConnects";
import { auth } from "@/app/utils/session";
import AddtoCart from "@/components/AddtoCart";
import Favourite from "@/components/Favourite";
import ProfileNavbar from "@/components/ProfileNavbar"
import { Anton } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const anton = Anton({ subsets: ['latin'], weight: '400' });

const Productdetails = async ({ params }: { params: { _id: string } }) => {
  await dbConnect()
  const { _id } = await params;

  const { items } = await alsoLike()

  const { success } = await auth()

  if (!success) {
    redirect(`/menu/${_id}`)
  }

  const product = await productModel.findOne({
    _id,
    status: 'active'
  })

  // if (!product) {
  //   redirect('/dashboard/menu')
  // }

  return (
    <div className="min-h-screen">

      <div className="sticky top-0 z-50">
        <ProfileNavbar />
      </div>

      <section className="w-full max-w-7xl mx-auto px-5 py-8">

        {/* Back */}
        <Link
          href="/dashboard/menu"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#ED8F0C] transition mb-6"
        >
          ← Back to menu
        </Link>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          <div className="">

            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-orange-50">

              <Image
                src={product.image}
                alt={product.title}
                height={300}
                width={300}
                loading='eager'
                // fill  
                priority
                className="object-cover size-full"
              />

              <div className='absolute top-4 right-4 z-20'>
                <Favourite id={product._id.toString()} />
              </div>

            </div>

            {/* Small information */}
            {/* <div className="grid grid-cols-3 gap-3 mt-4">

              <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                <p className="text-xs text-gray-400">
                  Category
                </p>

                <p className="text-sm font-medium text-gray-700 mt-1">
                  Fast Food
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                <p className="text-xs text-gray-400">
                  Preparation
                </p>

                <p className="text-sm font-medium text-gray-700 mt-1">
                  15–20 min
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                <p className="text-xs text-gray-400">
                  Availability
                </p>

                <p className="text-sm font-medium text-green-600 mt-1">
                  Available
                </p>
              </div>

            </div> */}

          </div>


          {/* RIGHT — Product Details */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-medium text-[#ED8F0C] uppercase tracking-wider mb-3">
              Austin Kitchen
            </p>

            <h1 className={`${anton.className} text-4xl md:text-5xl text-gray-800 tracking-wide`}>
              {product.title}
            </h1>

            <div className="flex items-center gap-3 mt-4">

              <div className="flex items-center gap-1 text-yellow-500">
                ★★★★★
              </div>

              <span className="text-sm text-gray-500">
                4.8
              </span>

            </div>

            <p className={`${anton.className} text-3xl text-[#ED8F0C] mt-6`}>
              ₦{product.price.toLocaleString()}
            </p>

            <p className="text-gray-500 leading-7 mt-5 max-w-xl">
              {product.description}
            </p>



            <div className="border-t border-gray-200 my-7" />

            <AddtoCart id={product._id.toString()} />


            
            <div className="grid grid-cols-2 gap-4 mt-5">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  🚴
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Fast Delivery
                  </p>

                  <p className="text-xs text-gray-400">
                    Delivered to your door
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Freshly Prepared
                  </p>

                  <p className="text-xs text-gray-400">
                    Made fresh for you
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>


        <div className="mt-16 border-t border-gray-200 pt-10">

          <h2 className={`${anton.className} text-2xl text-gray-800`}>
            About this meal
          </h2>

          <p className="text-gray-500 leading-7 max-w-3xl mt-3">
            {product.description}
          </p>

        </div>



        <div className="mt-14">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className={`${anton.className} text-2xl text-gray-800`}>
                You might also like
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                More meals you may enjoy
              </p>
            </div>

            <Link
              href="/dashboard/menu"
              className="text-sm font-medium text-[#ED8F0C] hover:underline"
            >
              View menu
            </Link>

          </div>

          <section className="w-full flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {
              items?.length !== 0 && items?.map((each) => (
                <div key={each._id} className='flex-none relative min-w-70 md:w-75 bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4'>


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

      </section>

    </div>
  )
}

export default Productdetails
