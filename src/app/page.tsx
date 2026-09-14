import { Anton, Pacifico } from "next/font/google";
import NavBar from "../components/NavBar";
import Image from "next/image";
import { GiHamburger } from "react-icons/gi";
import { MdOutlineFastfood } from "react-icons/md";
import { FaClock, FaMapMarkerAlt, FaMotorcycle, FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";
import Footer from "../components/Footer";
import {  mostPrch } from "./utils/action";
import { landingImageModel } from "./models/landingimages";
const anton = Anton({ subsets: ['latin'], weight: '400' });
const pacifico = Pacifico({ subsets: ['latin'], weight: '400' });

const Home = async () => {
  const items = await mostPrch()

  const images = await landingImageModel.findOne()



  return (
    <div className="w-screen h-screen bg-zinc-50">
      <div className="sticky top-0 z-50">
        <NavBar />

      </div>

      <header
        style={{
          backgroundImage: `url(${images?.mainLanding.image})`
        }}
        className="w-full h-125 bg-cover bg-center flex flex-col lg:text-start md:text-start text-center space-y-8 p-5 lg:pl-10">
        <h2 className={`${pacifico.className} lg:text-5xl md:text-5xl text-4xl text-[#ED8F0C] tracking-tight max-w-150`}>
          WE ARE READY TO SERVE
        </h2>

        <h2 className={`${anton.className} max-w-100 lg:text-8xl md:text-8xl text-6xl text-white font-semibold tracking-wide`}>
          FRESH &  DELICIOUS
        </h2>


        <Link href='/dashboard/menu'>
          <button className={`${anton.className} m-auto lg:m-0 md:m-0 w-30 bg-[#ED8F0C] py-3 text-white text-lg mt-5 cursor-pointer`}>
            ORDER NOW
          </button>
        </Link>

      </header>

      <section className="w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 space-y-5 md:space-x-4 md:px-4 p-5">
       {
        images.productDisplay.map((dis : {_id : string, image : string, title : string})=>(
          <div key={dis._id.toString()} className="h-80 md:h-85 lg:h-80 flex items-center bg-gray-100 flex-col gap-5 py-3 rounded-2xl hover:border-y-0 hover:border border-[#ED8F0C] hover:scale-105 transition-all duration-300">
            <div className="w-[50%] lg:w-[60%] md:w-[60%] h-60">
              <Image
                src={dis?.image}
                alt={dis?.title}
                height={500}
                width={500}
                loading="eager"
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>

            <h3 className="text-2xl lg:text-xl md:text-3xl md:mt-3 lg:mt-0 font-semibold">{dis.title}</h3>
          </div>
        ))
      }
      </section>


      <article className=" w-full flex flex-col md:flex-col gap-5 lg:flex-row lg:items-center lg:space-x-5 md:space-x-0 py-10 lg:justify-center ">
        <div className="overflow-hidden lg:w-[45%] md:w-[90%] w-[90%] m-auto md:m-auto lg:m-0 h-60 md:h-100 rounded-2xl">
          <Image
            src={images.whyPeopleDisplay.image}
            alt='whypeopleloveus'
            height={500}
            width={500}
            loading="eager"
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>

        <div className="lg:w-[45%] w-full h-130 md:h-100 bg-gray-50 shadow-sm lg:h-110 rounded-sm md:pt-2 p-2">
          <h2 className="font-semibold text-2xl tracking-tight ml-2">
            Why People Choose Us?
          </h2>

          <main className="w-full flex flex-col space-y-4 mt-5 px-5">

            <div className="flex gap-4  items-center p-4 rounded-xl border border-gray-100 shadow-sm ">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaMotorcycle className="text-[#ED8F0C] text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">Convenient and Reliable</h3>
                <p className="text-gray-500 text-sm">
                  Whether you dine in, take out, or order delivery, our service is convenient,
                  fast, and reliable.
                </p>
              </div>
            </div>


            <div className="flex gap-4 items-center p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="bg-orange-100 p-3 rounded-lg">
                <MdOutlineFastfood className="text-[#ED8F0C] text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">Variety of Options</h3>
                <p className="text-gray-500 text-sm">
                  From hearty meals to light snacks, we offer a wide range of options
                  to suit every taste and craving.
                </p>
              </div>
            </div>


            <div className="flex gap-4 items-center p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="bg-orange-100 p-3 rounded-lg">
                <GiHamburger className="text-[#ED8F0C] text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">Eat Burger</h3>
                <p className="text-gray-500 text-sm">
                  Our chickens are grilled to perfection, with juicy patties and
                  flavorful toppings that make every bite delicious.
                </p>
              </div>
            </div>

          </main>
        </div>
      </article>

      <div className="lg:w-[90%] w-[95%] lg:h-20 bg-gray-100 flex flex-col md:flex-row lg:flex-row m-auto rounded-3xl overflow-hidden">

        <div className="flex-1 flex items-center justify-center gap-3 py-5 md:border-r">
          <div className="bg-orange-100 p-3 rounded-full">
            <FaClock className="text-[#ED8F0C]" />
          </div>

          <div className="text-center md:text-left">
            <p className="font-semibold">Today 10:00am - 10:00pm</p>
            <p className="text-gray-500 text-sm">Working time</p>
          </div>
        </div>


        <div className="flex-1 flex items-center justify-center gap-3 py-5 md:border-r">
          <div className="bg-orange-100 p-3 rounded-full">
            <FaMapMarkerAlt className="text-[#ED8F0C]" />
          </div>

          <div className="text-center md:text-left">
            <p className="font-semibold">IBADAN, OYO, NIGERIA.</p>
            <p className="text-gray-500 text-sm">Our Location</p>
          </div>
        </div>


        <div className="flex-1 flex items-center justify-center gap-3 py-5">
          <div className="bg-orange-100 p-3 rounded-full">
            <FaPhoneAlt className="text-[#ED8F0C]" />
          </div>

          <div className="text-center md:text-left">
            <p className="font-semibold">08169659532</p>
            <p className="text-gray-500 text-sm">Phone Number And WhatsApp</p>
          </div>
        </div>

      </div>

      <section className=" w-full lg:p-10 md:p-10 p-3 bg-[#FFFFFF]/95 backdrop-blur-xl mt-10">

        <div className="w-full flex flex-col h-70 items-center justify-center space-y-6">
          <h1 className={`${pacifico.className} text-center text-3xl text-[#ED8F0C] font-bold`}>
            ...RIGHT PLACE, DELICIOUS TASTE
          </h1>

          <h1 className={`${anton.className} text-center md:text-5xl text-4xl tracking-tight font-bold`}>
            SOME OF OUR BEST SELLERS
          </h1>

          <h4 className={`${anton.className} text-center text-2xl text-[#3E4C59] tracking-tight font-normal`}>
            PURE DELIGHT IN EVERY BITE
          </h4>
        </div>


        <div className="gap-5 w-full h-fit grid lg:grid-cols-2  grid-cols-1 md:p-5 mt-3">

          {
            items.products.map((item) => (
              <div key={item._id} className="border md:py-10 py-7 lg:gap-5 md:gap-5 gap-5  items-center justify-center flex md:min-h-72 lg:min-h-70 h-60 bg-white shadow-2xl border-gray-300 rounded-2xl hover:border-[#ED8F0C] hover:scale-105 transition-all duration-400">
                <Link href={`/menu/${item._id}`} className="overflow-hidden rounded-2xl lg:h-[85%] md:h-[85%] h-[80%]  lg:w-[40%] md:w-[40%] w-[45%]" >
                  <div className="  overflow-hidden">
                    <Image
                      src={item.image}
                      alt={'products'}
                      height={500}
                      width={500}
                      className="h-full w-full object-cover "
                    />
                  </div>
                </Link>

                <Link href={`/menu/${item._id}`} className="items-center md:w-[45%] w-[50%] ">
                  <div className="md:h-[90%] h-[95%] flex flex-col gap-2 lg:gap-3 md:gap-3 justify-center">
                    <h1 className={`${anton.className} text-2xl font-light text-[#3E4C59] tracking-wide`}>
                      {item.title}
                    </h1>

                    <p className={`${anton.className} text-xl font-light text-[#ED8F0C] tracking-wide`}>
                      ₦{(item.price).toLocaleString()}
                    </p>

                    <div className="border-b-2 border-[#ED8F0C] w-fit h-fit pb-3">
                      <Link href={`/menu/${item._id}`} >
                        <p className={`${anton.className} text-lg font-light hover:text-[#ED8F0C] tracking-wide`}>
                          ORDER NOW
                        </p>
                      </Link>
                    </div>
                  </div>
                </Link>
              </div>

            ))
          }
        </div>

      </section>

      <header
        style={{ backgroundImage: `url(${images?.bottomLanding.image})` }}
        className="w-full lg:h-150 md:h-150 h-125 bg-[url('/img/asun.jpg')] bg-cover bg-center flex flex-col text-center items-center justify-center space-y-8 p-10">
        <h2 className={`${pacifico.className} lg:text-3xl md:text-3xl text-2xl text-[#ED8F0C] tracking-tight`}>
          FRESHY MADE
        </h2>


        <h2 className={`${anton.className}md:max-w-150 md:text-7xl text-5xl text-white font-bold tracking-tight`}>
          ORDER YOUR FAVORITE DELICACIES
        </h2>

        <Link href='/menu'>
          <button className={`${anton.className} m-auto lg:m-0 md:m-0 w-30 hover:scale-105 bg-[#ED8F0C] py-3 text-white text-lg mt-5 cursor-pointer`}>
            OUR MENU
          </button>
        </Link>

      </header>

      <Footer />
    </div>
  );
}

export default Home


