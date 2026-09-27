'use client'
import { fetch_businessInfo } from '@/app/utils/action';
import { Anton } from 'next/font/google';
import { useEffect, useState } from 'react';
const anton = Anton({ subsets: ['latin'], weight: '400' });
import { FaEnvelope, FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const Footer = () => {

    interface iNfo {
        businessPhone: string,
        businessEmail: string,
        businessAddress: {
            address: string,
            town: string,
            state: string
        },
        openingFrom: string,
        openingTo: string
    }

    const [info, setinfo] = useState<iNfo | null>(null)

    useEffect(() => {
        const ft = async () => {
            const res = await fetch_businessInfo()

            if (res.success && res.info) {
                setinfo(res.info || null)
            }
        }
        ft()
    }, [])

    return (
        <div>
            <footer className="w-screen bg-[#0B0F19] p-5 backdrop-blur-md ">

                <div className="w-full flex flex-col md:flex-row lg:flex-row justify-between gap-5 lg:px-20 p-5">

                    <div className="md:w-70 lg:w-70 flex flex-col gap-3">
                        <h1 className={`${anton.className} text-xl font-semibold text-[#ED8F0C]`}>CONTACT US</h1>

                        <p className="flex items-center gap-3 text-gray-100 capitalize">
                            <FaMapMarkerAlt className="text-[#ED8F0C]" />
                            {info?.businessAddress?.town}
                        </p>

                        <p className="flex items-center gap-3 text-gray-100">
                            <FaPhoneAlt className="text-[#ED8F0C]" />
                            {info?.businessPhone?.startsWith('234')
                                ? `+${info?.businessPhone}`
                                : info?.businessPhone
                            }
                        </p>

                        <p className="flex items-center gap-3 text-gray-100">
                            <FaEnvelope className="text-[#ED8F0C]" />
                            <a href={`mailto:${info?.businessEmail}`} className="hover:text-[#ED8F0C] text-[#FF4D2D]">
                                {info?.businessEmail}
                            </a>
                        </p>
                    </div>


                    <div className="md:w-70 lg:w-70 flex flex-col gap-3 text-gray-100">
                        <h1 className={`${anton.className} text-xl  font-semibold text-[#ED8F0C]`}>WORKING</h1>

                        <p>Monday {`${info?.openingFrom} - ${info?.openingTo}`}</p>
                        <p>Tuesday {`${info?.openingFrom} - ${info?.openingTo}`}</p>
                        <p>Wednesday {`${info?.openingFrom} - ${info?.openingTo}`}</p>
                        <p>Thursday {`${info?.openingFrom} - ${info?.openingTo}`}</p>
                        <p>Friday {`${info?.openingFrom} - ${info?.openingTo}`}</p>
                        <p>Saturday {`${info?.openingFrom} - ${info?.openingTo}`}</p>
                    </div>


                    <div className="md:w-70 lg:w-70 flex flex-col gap-5">
                        <h1 className={`${anton.className} text-xl font-semibold text-[#ED8F0C]`}>GET IN TOUCH</h1>

                        <div className="flex gap-5 text-2xl">

                            <a
                                href="https://www.facebook.com/share/1PR3UgAE5E/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaFacebookF className="text-[#ED8F0C] cursor-pointer hover:scale-110 transition" />
                            </a>

                            <a
                                href="https://www.instagram.com/austineskitchen?stkn=Yzl0dXExaWhvcDBx&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaInstagram className="text-[#ED8F0C] cursor-pointer hover:scale-110 transition" />
                            </a>

                            <a
                                href="https://wa.me/2347063317472?text=Hello%20Austin%20kitchen,%20I'd%20like%20to%20place%20an%20order"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp className="text-[#ED8F0C] cursor-pointer hover:scale-110 transition" />
                            </a>
                        </div>

                    </div>

                </div>

            </footer>
        </div>
    )
}

export default Footer
