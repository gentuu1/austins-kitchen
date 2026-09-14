import { Anton } from 'next/font/google';
const anton = Anton({ subsets: ['latin'], weight: '400' });
import { FaEnvelope, FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
    return (
        <div>
            <footer className="w-screen bg-[#0B0F19] p-5 backdrop-blur-md ">

                <div className="w-full flex flex-col md:flex-row lg:flex-row justify-between gap-5 lg:px-20 p-5">

                    <div className="md:w-70 lg:w-70 flex flex-col gap-3">
                        <h1 className={`${anton.className} text-xl font-semibold text-[#ED8F0C]`}>CONTACT US</h1>

                        <p className="flex items-center gap-3 text-gray-100">
                            <FaMapMarkerAlt className="text-[#ED8F0C]" />
                            IBADAN
                        </p>

                        <p className="flex items-center gap-3 text-gray-100">
                            <FaPhoneAlt className="text-[#ED8F0C]" />
                            +2347063317472
                        </p>

                        <p className="flex items-center gap-3 text-gray-100">
                            <FaEnvelope className="text-[#ED8F0C]" />
                            <a href="mailto:austinkitechen@gmail.com" className="hover:text-[#ED8F0C] text-[#FF4D2D]">
                                austinkitechen@gmail.com
                            </a>
                        </p>
                    </div>


                    <div className="md:w-70 lg:w-70 flex flex-col gap-3 text-gray-100">
                        <h1 className={`${anton.className} text-xl  font-semibold text-[#ED8F0C]`}>WORKING</h1>

                        <p>Monday 10am – 10pm</p>
                        <p>Tuesday 10am - 10pm</p>
                        <p>Wednesday 10am – 10pm</p>
                        <p>Thursday 10am – 10pm</p>
                        <p>Friday 10am – 10pm</p>
                        <p>Saturday 10am – 10pm</p>
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
