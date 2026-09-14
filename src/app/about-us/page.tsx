"use client"
import { useEffect, useRef, useState } from "react"
import { Anton, Lora, Pacifico } from 'next/font/google';
const anton = Anton({ subsets: ['latin'], weight: '400' });
const pacifico = Pacifico({ subsets: ['latin'], weight: '400' });
const lora = Lora({ subsets: ['latin'] });
import { Montserrat } from 'next/font/google';
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import Spinner from "@/components/Spinner";

const montserrat = Montserrat({ subsets: ['latin'], weight: ['600', '700', '800'] });
const Page = () => {
    const [isSpinner, setisSpinner] = useState(true)

    type Props = {
        end: number,
        suffix: string
    }

    useEffect(() => { setisSpinner(false) }, [])


    const Counter = ({ end, suffix = "" }: Props) => {
        const [count, setCount] = useState(0)
        const [started, setStarted] = useState(false)
        const ref = useRef(null)

        //  Detect when element enters screen


        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !started) {
                        setStarted(true)
                    }
                },
                { threshold: 0.5 }
            )

            if (ref.current) {
                observer.observe(ref.current)
            }

            return () => observer.disconnect()
        }, [started])

        //  Run counting animation
        useEffect(() => {
            if (!started) return

            let current = 0
            const duration = 1500
            const increment = end / (duration / 16)

            const timer = setInterval(() => {
                current += increment

                if (current >= end) {
                    setCount(end)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(current))
                }
            }, 16)

            return () => clearInterval(timer)
        }, [started, end])


        return (
            <span ref={ref}>
                {count.toLocaleString()}{suffix}
            </span>
        )
    }

    if (isSpinner) {
        return <>
            <div className="sticky top-0 z-50">
                <NavBar />
            </div>
            <Spinner />
        </>
    }


    return (
        <div className='min-h-screen min-w-screen'>
            <div className="sticky top-0 z-50">
                <NavBar />
            </div>

            <section className="w-full min-h-100 bg-[#FFFFFF]/95 backdrop-blur-xl mt-5">
                <div className="w-full flex flex-col h-30 items-center justify-center space-y-3">
                    <h1 className={`${anton.className} text-center md:text-5xl text-4xl tracking-tight`}>
                        ABOUT-US
                    </h1>

                    <p className={`text-center text-sm tracking-tight`}>
                        <a className='underline hover:text-[#ED8F0C]' href="/">Home</a>/About
                    </p>
                </div>


                <div className=' md:w-[90%] w-full m-auto p-5 '>
                    <div className='w-full'>
                        <h1 className={`${anton.className} text-[#3E4C59] text-2xl font-light tracking-tight`}>
                            OUR MISSION
                        </h1>

                        <p className={`${pacifico.className} text-xl text-[#ED8F0C]`}>
                            Our Story
                        </p>

                        <h1 className={`${anton.className} text-3xl mt-10 font-light tracking-tight  max-w-70`}>
                            The story about
                            Austine's kitchen foods
                        </h1>

                        <p className="text-[#3E4C59] text-lg font-semibold italic transform mt-5  md:max-w-3xl">

                            Austine's kitchen foods is a dynamic and innovative food company specializing in freshly made shawarma, smoothies,milkshakes, and parfaits. Established in February 2016, serving the public—both male and female, youngand old. Our mission is to provide delicious, high-quality food and beverages in a hygienic and welcoming environment.
                        </p>


                        <div className='w-full flex md:flex-row flex-col  h-fit mt-10'>
                            <div className='md:w-[50%] w-full h-fit'>
                                <h1 className={`${anton.className} text-[#3E4C59] text-2xl font-light tracking-tight`}>
                                    OUR VISION
                                </h1>

                                <p className="text-[#3E4C59] text-lg font-semibold transform mt-5  max-w-90 text-center">
                                    What sets Austine's kitchen foods apart from the competition is our unwavering commitment to freshness and hygiene. All our products are freshly made in a clean and hygienic environment, ensuring that our customers receive the best possible food and beverage experience.
                                </p>
                            </div>

                            <div className='md:w-[50%] w-full pl-5 h-fit'>
                                <h1 className={`${anton.className} text-[#3E4C59] text-2xl font-light tracking-tight`}>
                                    OUR MISSION
                                </h1>

                                <p className="text-[#3E4C59] text-lg font-semibold italic transform mt-4 tracking-tight md:max-w-70 ">
                                    To consistently deliver high quality,
                                    mouth-watering food and
                                    beverages that delightour
                                    customers, while fostering a
                                    c u l t u r e o f i n n o v a t i o n ,
                                    sustainability, and community
                                    engagement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <section className='mb-5 w-[90%] md:py-15 py-10 rounded-lg flex md:flex-row flex-col justify-center items-center space-y-10 md:space-y-0 md:space-x-10 m-auto bg-[#ED8F0C] mt-10 text-white'>

                    <div className=' flex flex-col items-center'>
                        <h1 className={`${montserrat.className} text-5xl font-bold`}>
                            <Counter end={5000} suffix="+" />
                        </h1>
                        <p className="text-white text-lg tracking-wide">
                            SATISFIED CUSTOMERS
                        </p>
                    </div>
                    <div className='  flex flex-col items-center'>
                        <h1 className={`${montserrat.className} text-5xl font-bold`}>
                            <Counter end={9} suffix="+" />
                        </h1>
                        <p className="text-white text-lg tracking-wide">Years Of Experience</p>
                    </div>
                    <div className=' flex flex-col items-center'>
                        <h1 className={`${montserrat.className} text-5xl font-bold`}>
                            <Counter end={100} suffix="%" />
                        </h1>
                        <p className="text-white text-lg tracking-wide">Fresh & Tasty</p>
                    </div>


                </section>
            </section>

            <Footer />
        </div>
    )
}

export default Page
