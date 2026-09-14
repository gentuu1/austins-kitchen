"use client"

import { addbottomPic, addDisplayProduct, addMainlandingImg, deletebottompic, deletedisplayPic, deleteMainLandingImg, deletewhypeople, fetchLandingImages, whyPeoplePic } from '@/app/utils/action'
import Spinner from '@/components/Spinner'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState, useTransition } from 'react'
import { FaSearch, FaSpinner } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { toast } from 'react-toastify'

interface img {
    mainLanding: {
        image : string
    },
    productDisplay: {
        _id: string
        title: string
        image: string
    }[],
    whyPeopleDisplay: {
        image: string
    },
    bottomLanding: {
        image: string
    }
}

const Page = () => {
    const [OpenMainModal, setOpenMainModal] = useState(false)
    const [openProductModal, setOpenProductModal] = useState(false)
    const [openWhyModal, setOpenWhyModal] = useState(false)
    const [openBottomModal, setOpenBottomModal] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [isSpinner, setisSpinner] = useState(true)
    const [allImages, setallImages] = useState<img | null>(null)
    const [mainImg, setmainImg] = useState('')
    const [whyImg, setwhyImg] = useState('')
    const [bottomImg, setbottomImg] = useState('')
    const [Loading, setLoading] = useState('')
    const [deleteWHyLo, setdeleteWhyLo] = useState(false)
    const [deleteBottomLo, setdeleteBottomLo] = useState(false)


    const fetchImages = async () => {
        const res = await fetchLandingImages()

        if (!res.success) {
            toast.error(res.message, {
                autoClose: 2000
            })
            setisSpinner(false)
            return
        }

        setallImages(res.iMages || null)
        setisSpinner(false)
    }
    useEffect(() => {
        fetchImages()
    }, [])

    const add_mainImg = async () => {
        startTransition(async () => {
            if (!mainImg) return;

            const res = await addMainlandingImg(mainImg)

            if (!res.success) {
                toast.error(res.message, {
                    autoClose: 2000
                })
                return
            }

            await fetchImages()
            toast.success(res.message, {
                autoClose: 2000
            })
            setOpenMainModal(false)
        })
    }

    const handleMainImg = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
            setmainImg('')
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            const image = reader.result as string
            setmainImg(image)
        }

        reader.readAsDataURL(file)
    }

    const deleteMainpic = async () => {
        startTransition(async () => {
            const res = await deleteMainLandingImg()

            if (!res.success) {
                toast.error(res.message, {
                    autoClose: 2000
                })
                return
            }

            await fetchImages()
            toast.success(res.message, {
                autoClose: 2000
            })

        })
    }

    const useformik = useFormik({
        initialValues: {
            image: '',
            title: ''
        },

        onSubmit: (values) => {
            startTransition(async () => {
                const res = await addDisplayProduct(values)
                if (!res.success) {
                    toast.error(res.message, {
                        autoClose: 2000
                    })
                    return
                }

                await fetchImages()
                useformik.resetForm()
                toast.success(res.message, {
                    autoClose: 2000
                })
                setOpenProductModal(false)
            })
        },

        validationSchema: yup.object({
            image: yup.string().required('Image is required'),
            title: yup.string().required('Title is required')
        })
    })


    const handledisPlaypro = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
            useformik.setFieldValue('image', '')
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            const image = reader.result as string
            useformik.setFieldValue('image', image)
        }

        reader.readAsDataURL(file)
    }

    const delete_displayproImg = async (id: string) => {
        if (!id) return
        setLoading(id)
        const res = await deletedisplayPic(id)
        if (!res.success) {
            toast.error(res.message, {
                autoClose: 2000
            })
            setLoading('')
            return
        }

        toast.success(res.message, {
            autoClose: 2000
        })
        await fetchImages()
        setLoading('')
        return
    }

    const handleWhyPeoleLoveImg = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
            setwhyImg('')
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            const image = reader.result as string
            setwhyImg(image)
        }

        reader.readAsDataURL(file)
    }

    const addWhyPeople = async () => {
        startTransition(async () => {
            if (!whyImg) return

            const res = await whyPeoplePic(whyImg)

            if (!res.success) {
                toast.error(res.message, {
                    autoClose: 2000
                })
                return
            }

            await fetchImages()
            toast.success(res.message, {
                autoClose: 2000
            })

            setwhyImg('')
            setOpenWhyModal(false)
        })
    }

    const delete_why = async () => {
        startTransition(async () => {
            setdeleteWhyLo(true)
            const res = await deletewhypeople()

            if (!res.success) {
                toast.error(res.message, { autoClose: 2000 })
                setdeleteWhyLo(false)
                return
            }

            await fetchImages()
            toast.success(res.message, { autoClose: 2000 })
            setdeleteWhyLo(false)
        })
    }

    const handleBottomLandingImg = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
            setbottomImg('')
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            const image = reader.result as string
            setbottomImg(image)
        }

        reader.readAsDataURL(file)
    }

    const addBottomlanding = async () => {
        startTransition(async () => {
            if (!bottomImg) return

            const res = await addbottomPic(bottomImg)

            if (!res.success) {
                toast.error(res.message, {
                    autoClose: 2000
                })
                return
            }

            await fetchImages()
            toast.success(res.message, {
                autoClose: 2000
            })

            setbottomImg('')
            setOpenBottomModal(false)
        })
    }

    const delete_bottom = async () => {
        startTransition(async () => {
            setdeleteBottomLo(true)
            const res = await deletebottompic()

            if (!res.success) {
                toast.error(res.message, { autoClose: 2000 })
                setdeleteBottomLo(false)
                return
            }

            await fetchImages()
            toast.success(res.message, { autoClose: 2000 })
            setdeleteBottomLo(false)
        })
    }



    if (isSpinner) {
        return (
            <>
                <Spinner />
            </>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 p-5 md:px-8">

            <section className="flex flex-col gap-10">

                {/* MAIN LANDING IMAGE */}
                <div className="flex flex-col gap-5">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Main Landing Image
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Image displayed on the main landing section
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenMainModal(true)}
                            className="bg-[#ED8F0C] text-white px-6 py-3 rounded-lg hover:bg-[#d77f08] transition"
                        >
                            Add Image
                        </button>
                    </div>

                    <div className="w-full md:w-80 p-5 space-y-4 shadow-sm bg-white rounded-lg">

                        <div className="w-full h-40 overflow-hidden rounded-xl">
                            {
                                allImages?.mainLanding.image && (
                                    <Image
                                        src={allImages?.mainLanding.image}
                                        alt="Main landing"
                                        height={400}
                                        width={400}
                                        className="h-full w-full object-cover"
                                    />
                                )
                            }

                            {
                                !allImages?.mainLanding.image && (
                                    <div className='h-full w-full flex justify-center items-center'>
                                        <h1>add image</h1>
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex justify-end">
                            <button
                                disabled={isPending}
                                onClick={deleteMainpic}
                                className="cursor-pointer text-red-500 border border-red-200 hover:bg-red-50 px-6 py-2 rounded-lg transition flex justify-center items-center"
                            >
                                {
                                    isPending ? (<FaSpinner size={15} className='animate-spin' />) : 'Delete'
                                }
                            </button>
                        </div>

                    </div>
                </div>


                <div className="flex flex-col gap-5">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Product Display
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Products displayed on the landing page
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenProductModal(true)}
                            className="bg-[#ED8F0C] text-white px-6 py-3 rounded-lg hover:bg-[#d77f08] transition"
                        >
                            Add Product
                        </button>
                    </div>


                    {
                        (allImages?.productDisplay?.length ?? 0) === 0 && (
                            <div className='flex justify-center items-center py-10'>
                                <h1 className='text-3xl font-bold  text-gray-800'>No display product available</h1>
                            </div>
                        )
                    }


                    {
                        (allImages?.productDisplay?.length ?? 0) > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                                {
                                    allImages?.productDisplay.map((dis) => (
                                        <div key={dis._id.toString()} className="p-4 bg-white rounded-lg shadow-sm space-y-3">

                                            <div className="w-full h-40 overflow-hidden rounded-xl">
                                                <Image
                                                    src={dis.image}
                                                    alt={dis.title}
                                                    height={300}
                                                    width={300}
                                                    loading='eager'
                                                    unoptimized
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <h2 className="font-semibold text-gray-800 capitalize">
                                                {dis.title}
                                            </h2>

                                            <button
                                                disabled={Loading === dis._id.toString()}
                                                onClick={() => delete_displayproImg(dis._id.toString())}
                                                className="cursor-pointer text-red-500 border border-red-200 hover:bg-red-50 px-5 py-2 rounded-lg transition"
                                            >
                                                {
                                                    Loading === dis._id.toString() ? (<FaSpinner size={15} className='animate-spin' />) : "Delete"
                                                }
                                            </button>

                                        </div>
                                    ))
                                }

                            </div>
                        )
                    }
                </div>


                {/* WHY PEOPLE LOVE US */}
                <div className="flex flex-col gap-5">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Why People Love Us Image
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Image displayed in the Why People Love Us section
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenWhyModal(true)}
                            className="bg-[#ED8F0C] text-white px-6 py-3 rounded-lg hover:bg-[#d77f08] transition"
                        >
                            Add Image
                        </button>
                    </div>

                    <div className="w-full md:w-80 p-5 space-y-4 shadow-sm bg-white rounded-lg">

                        <div className="w-full h-40 overflow-hidden rounded-xl">
                            {
                                allImages?.whyPeopleDisplay?.image ? (
                                    <Image
                                        src={allImages.whyPeopleDisplay.image}
                                        alt="Why people love us"
                                        height={400}
                                        width={400}
                                        loading="eager"
                                        unoptimized
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex justify-center items-center">
                                        <h1>Add image</h1>
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex justify-end">
                            <button
                                disabled={deleteWHyLo}
                                onClick={() => delete_why()}
                                className="cursor-pointer flex justify-center items-center text-red-500 border border-red-200 hover:bg-red-50 px-6 py-2 rounded-lg transition"
                            >
                                {
                                    deleteWHyLo ? (<FaSpinner size={15} className='animate-spin' />) : "Delete"
                                }
                            </button>
                        </div>

                    </div>
                </div>


                {/* BOTTOM LANDING IMAGE */}
                <div className="flex flex-col gap-5">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Bottom Landing Image
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Image displayed at the bottom of the landing page
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenBottomModal(true)}
                            className="bg-[#ED8F0C] text-white px-6 py-3 rounded-lg hover:bg-[#d77f08] transition"
                        >
                            Add Image
                        </button>
                    </div>

                    <div className="w-full md:w-80 p-5 space-y-4 shadow-sm bg-white rounded-lg">

                        <div className="w-full h-40 overflow-hidden rounded-xl">
                            {
                                allImages?.bottomLanding?.image ? (
                                    <Image
                                        src={allImages.bottomLanding.image}
                                        alt="Bottom landing"
                                        height={800}
                                        width={800}
                                        loading="eager"
                                        unoptimized
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex justify-center items-center">
                                        <h1>Add image</h1>
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex justify-end">
                            <button
                                disabled={deleteBottomLo}
                                onClick={() => delete_bottom()}
                                type='button'
                                className="text-red-500 border border-red-200 hover:bg-red-50 px-6 py-2 rounded-lg transition"
                            >
                                {
                                    deleteBottomLo ? (<FaSpinner size={15} className='animate-spin' />) : "Delete"
                                }
                            </button>
                        </div>

                    </div>
                </div>

            </section>

            {OpenMainModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

                    <div className="w-full max-w-md bg-white rounded-xl p-6">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                Add Main Landing Image
                            </h2>

                            <button
                                onClick={() => setOpenMainModal(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <MdClose size={25} />
                            </button>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Image
                                </label>

                                <input
                                    onChange={handleMainImg}
                                    type="file"
                                    accept="image/*"
                                    className="w-full border rounded-lg p-3"
                                />
                            </div>

                            <button
                                disabled={isPending}
                                onClick={() => add_mainImg()}
                                className="flex justify-center items-center w-full bg-[#ED8F0C] text-white py-3 rounded-lg"
                            >
                                {
                                    isPending ? (<FaSpinner size={15} className='animate-spin' />) : 'Add Image'
                                }
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {openProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

                    <div className="w-full max-w-md bg-white rounded-xl p-6">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                Add Product Display
                            </h2>

                            <button
                                onClick={() => setOpenProductModal(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <MdClose size={25} />
                            </button>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Product Title
                                </label>

                                <div className='flex flex-col gap-1'>
                                    <input
                                        onChange={useformik.handleChange}
                                        value={useformik.values.title}
                                        name='title'
                                        type="text"
                                        placeholder="Enter product title"
                                        className="w-full border rounded-lg p-3 outline-none focus:border-[#ED8F0C]"
                                    />
                                    {
                                        useformik.errors.title && (
                                            <small className='text-red-500 text-sm tracking-tight'>{useformik.errors.title}</small>
                                        )
                                    }
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Product Image
                                </label>

                                <div>
                                    <input
                                        onChange={handledisPlaypro}
                                        type="file"
                                        accept="image/*"
                                        className="w-full border rounded-lg p-3"
                                    />
                                    {
                                        useformik.errors.image && (
                                            <small className='text-red-500 text-sm tracking-tight'>{useformik.errors.image}</small>
                                        )
                                    }
                                </div>
                            </div>

                            <button
                                disabled={isPending}
                                onClick={() => useformik.handleSubmit()}
                                className="w-full bg-[#ED8F0C] hover:bg-[#d39a4a] text-white py-3 rounded-lg flex justify-center items-center transition"
                            >
                                {
                                    isPending ? (<FaSpinner size={15} className='animate-spin' />) : 'Add'
                                }
                            </button>

                        </div>

                    </div>
                </div>
            )}


            {openWhyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

                    <div className="w-full max-w-md bg-white rounded-xl p-6">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                Add Why People Love Us Image
                            </h2>

                            <button
                                onClick={() => setOpenWhyModal(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <MdClose size={25} />
                            </button>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Image
                                </label>

                                <input
                                    onChange={handleWhyPeoleLoveImg}
                                    type="file"
                                    accept="image/*"
                                    className="w-full border rounded-lg p-3"
                                />
                            </div>

                            <button
                                onClick={() => addWhyPeople()}
                                className="cursor-pointer flex justify-center items-center w-full bg-[#ED8F0C] text-white py-3 rounded-lg"
                            >
                                {
                                    isPending ? (<FaSpinner size={15} className='animate-spin' />) : 'Add image'
                                }
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {openBottomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

                    <div className="w-full max-w-md bg-white rounded-xl p-6">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                Add Bottom Landing Image
                            </h2>

                            <button
                                onClick={() => setOpenBottomModal(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <MdClose size={25} />
                            </button>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Image
                                </label>

                                <input
                                    onChange={handleBottomLandingImg}
                                    type="file"
                                    accept="image/*"
                                    className="w-full border rounded-lg p-3"
                                />
                            </div>

                            <button
                            type='button'
                                disabled={isPending}
                                onClick={()=>addBottomlanding()}
                                className="flex justify-center items-center w-full bg-[#ED8F0C] text-white py-3 rounded-lg"
                            >
                                {
                                    isPending ? (<FaSpinner size={15} className='animate-spin' />) : "Add image"
                                }
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}

export default Page