"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaFacebookF, FaInstagram, FaTimes, FaWhatsapp } from 'react-icons/fa'
import { FiMenu } from 'react-icons/fi'

const NavBar = () => {
    const [openMenu, setopenMenu] = useState(false)

    return (
        <div>
            <nav className="relative w-full h-20 bg-[#1F2933] backdrop-blur-md flex items-center px-5">
                <div className="flex items-center lg:gap-6 gap-3">
                    
                    <a
                        href="https://www.facebook.com/share/1PR3UgAE5E/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaFacebookF className="text-blue-500 lg:text:xl text-2xl cursor-pointer hover:scale-110 hover:text-blue-400 transition-all duration-300" />
                    </a>

                    <a
                        href="https://www.instagram.com/austineskitchen?stkn=Yzl0dXExaWhvcDBx&utm_source=qr"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaInstagram className="text-pink-500 lg:text:xl text-2xl cursor-pointer hover:scale-110 hover:text-pink-400 transition-all duration-300" />
                    </a>

                    <a
                        href="https://wa.me/2347063317472?text=Hello%20Austin%20kitchen,%20I'd%20like%20to%20place%20an%20order"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaWhatsapp className="text-green-500 lg:text:xl text-2xl cursor-pointer hover:scale-110 hover:text-green-400 transition-all duration-300" />
                    </a>
                </div>

                <div className={`${openMenu ? "hidden " : "absolute"} left-1/2 transform -translate-x-1/2 h-15 w-32`}>
                    <Image
                        src="/img/logo.png"
                        alt="logo"
                        loading='eager'
                        width={500}
                        height={500}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="ml-auto lg:flex items-center gap-4 md:hidden hidden">
                    <Link href="/about-us">
                        <p className="text-white font-medium hover:text-amber-400 transition-all duration-300">
                            ABOUT US
                        </p>
                    </Link>

                    <Link href="/menu">
                        <p className="text-white font-medium hover:text-amber-400 transition-all duration-300">
                            MENU
                        </p>
                    </Link>

                    <Link href="/signin">
                        <p className="text-white font-medium hover:text-amber-400 transition-all duration-300">
                            SIGNIN
                        </p>
                    </Link>

                    <Link href="/contact-us">
                        <p className="text-white font-medium hover:text-amber-400 transition-all duration-300">
                            CONTACT US
                        </p>
                    </Link>
                </div>

                <div className=" lg:hidden ml-auto">
                    <FiMenu onClick={() => setopenMenu(true)} className="text-2xl text-white cursor-pointer hover:scale-110 transition-all duration-300" />
                </div>

                <div className={`${openMenu ? "absolute" : 'hidden'} dark:bg-gray-800 w-70 md:w-100 min-h-screen top-0 bottom-0 right-0 bg-[#E47B02] text-white shadow-2xl z-50`}>
                    <nav className="px-5 w-full h-20 border-red-200 flex items-center">
                        {/* <div className="border h-14 w-20">
                          <Image
                              src="/img/logo.png"
                              alt="logo"
                              width={500}
                              height={500}
                              className="h-full w-full object-cover"
                          />
                      </div> */}

                        <div className="ml-auto">
                            <FaTimes onClick={() => setopenMenu(false)} className="text-2xl text-white cursor-pointer hover:scale-110 transition-all duration-300" />
                        </div>
                    </nav>

                    <div className="w-full  flex flex-col space-y-3 p-5 mt-5">
                        <Link href='/about-us'>
                            <p className="text-lg font-medium dark:text-gray-200">ABOUT-US</p>
                        </Link>

                        <Link href='/contact-us'>
                            <p className="text-lg font-medium dark:text-gray-200">CONTACT-US</p>
                        </Link>

                        <Link href='/menu'>
                            <p className="text-lg font-medium dark:text-gray-200">MENU</p>
                        </Link>
                    </div>


                    <div className='w-full flex flex-col items-center mt-20'>
                        <Link href='/signin ' >
                            <button className='py-3 px-20  rounded-xl border bg-transparent border-[#ED8F0C] text-lg font-bold'>
                                SiGNIN
                            </button>
                        </Link>
                    </div>

                </div>

            </nav >
        </div >
    )
}

export default NavBar
