
"use client"
import { useFormik } from 'formik'
import * as yup from "yup"
import { Anton } from 'next/font/google'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState, useTransition } from 'react'
import { BsPatchCheckFill } from 'react-icons/bs'
import { FaArrowDown, FaAward, FaSearch, FaSpinner } from 'react-icons/fa'
import { HiOutlineCurrencyDollar, HiShoppingCart } from 'react-icons/hi'
import { MdClose, MdDelete, MdEdit } from 'react-icons/md'
import { addProduct, deleTeProduct, editProduct, fectchProduct } from '@/app/utils/action'
import { toast } from 'react-toastify'
import Spinner from '@/components/Spinner'
import { useRouter, useSearchParams } from 'next/navigation'
import { deletePro, proDuct } from '@/app/utils/type'
const anton = Anton({ subsets: ['latin'], weight: '400' })

const Products = () => {
    const [openAddproduct, setopenAddproduct] = useState(false);
    const [openEditproduct, setopenEditproduct] = useState(false);
    const [openDeleteproduct, setopenDeleteproduct] = useState(false);
    const [deletepro, setdeletepro] = useState<deletePro | null>(null);
    const [openproduct, setopenproduct] = useState<proDuct | null>(null);
    const [prev, setprev] = useState('')
    const [isPending, startTransition] = useTransition()
    const [allProducts, setallProducts] = useState<proDuct[]>([])
    const [allfiltered, setallfiltered] = useState<proDuct[]>([])
    const [isLoading, setisLoading] = useState(true)
    const [isSearch, setisSearch] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const search = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (!value.trim()) {
            params.delete('search')
        } else {
            params.set('search', value.trim())
        }

        router.push(params.toString() ? `/admin-dashboard/products?${params.toString()}` : `/admin-dashboard/products`)
    }

    const searchFormik = useFormik({
        initialValues: {
            search: ''
        },

        onSubmit: (values) => {
            setisSearch(true)

            search(values.search.trim())
            setisSearch(false)
        }
    })

    useEffect(() => {
        const search = searchParams.get("search")

        if (!search) {
            setallfiltered(allProducts)
            return
        }

        const searchProduct = allProducts.filter(
            pro =>
                pro.title.toLowerCase().includes(search.toLowerCase()) ||
                pro._id.toString().includes(search) ||
                pro.status.toLowerCase().includes(search.toLowerCase())
        )



        setallfiltered(searchProduct)

    }, [searchParams, allProducts])

    const fetchProd = async () => {
        const product = await fectchProduct()

        setallProducts(product.products || [])

        setallfiltered(product.products || [])
    }

    const activeProducts = allProducts.filter(product => product.status === 'active')
    const inactiveProducts = allProducts.filter(product => product.status === 'inactive')

    const leastSold: proDuct | null = allProducts.length > 0 ? allProducts.reduce((least, product) => {
        return least.purchaseCount > product.purchaseCount ? product : least
    }) : null;

    const highestSold: proDuct | null = allProducts.length > 0 ? allProducts.reduce((highest, product) => {
        return highest.purchaseCount < product.purchaseCount ? product : highest
    }) : null;

    const highestRev: proDuct | null = allProducts.length > 0 ? allProducts.reduce((highest, lowest) => {
        return highest.revenue > lowest.revenue ? highest : lowest
    }) : null


    useEffect(() => {
        const fp = async () => {
            await fetchProd()
            setisLoading(false)
        }

        fp()

    }, [])



    const handleProductImg = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            setprev('')
            formik.setFieldValue("image", '')
            formik.setFieldTouched("image", true)
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const image = reader.result as string
            setprev(image)
            formik.setFieldValue("image", image)
        }

        reader.readAsDataURL(file)
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            price: '',
            description: '',
            image: '',
            status: ''
        },

        onSubmit: (values) => {
            startTransition(async () => {

                const res = await addProduct(values);

                if (!res.success) {
                    toast.error(res.message, {
                        autoClose: 2000
                    })

                    return;
                }

                toast.success(res.message, {
                    autoClose: 2000
                })

                await fetchProd()
                setprev('')
                setopenAddproduct(false)
            })
        },

        validationSchema: yup.object({
            title: yup.string().required("Required"),
            price: yup.string().required('Required'),
            description: yup.string().required("Required"),
            image: yup.string().required("Required"),
            status: yup.string().required("Required")
        })
    })


    useEffect(() => {
        if (!openproduct) return;

        setprev(openproduct.image)
        editFormik.setValues({
            _id: openproduct?._id,
            title: openproduct.title,
            price: String(openproduct.price),
            description: openproduct.description,
            image: openproduct.image,
            status: openproduct.status
        })


    }, [openproduct])

    const handleEditImg = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            setprev('')
            editFormik.setFieldValue("image", '')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const image = reader.result as string
            setprev(image)
            editFormik.setFieldTouched("image", true)
            editFormik.setFieldValue("image", image)
        }

        reader.readAsDataURL(file)
    }

    const editFormik = useFormik({
        initialValues: {
            _id: '',
            title: '',
            price: '',
            description: '',
            image: '',
            status: ''
        },

        onSubmit: (values) => {
            startTransition(async () => {
                const res = await editProduct(values);

                if (!res.success) {
                    toast.error(res.message, {
                        autoClose: 2000
                    })
                    return
                }

                toast.success(res.message, { autoClose: 2000 })

                await fetchProd()
                setprev('')
                setopenEditproduct(false)
            })
        },

        validationSchema: yup.object({
            _id: yup.string().required("Required"),
            title: yup.string().required("Required"),
            price: yup.string().required('Required'),
            description: yup.string().required("Required"),
            image: yup.string().required("Required"),
            status: yup.string().required("Required")
        })
    })

    const deLete = async () => {
        startTransition(async () => {
            if (!deletepro?._id) {
                return
            } else {
                const res = await deleTeProduct(deletepro?._id);

                if (!res.success) {
                    toast.error(res.message)
                    return
                }

                toast.success(res.message, {
                    autoClose: 2000
                })

                await fetchProd();
                setopenDeleteproduct(false)
            }
        })
    }

    if (isLoading) {
        return (
            <>
                <Spinner />
            </>
        )
    }


    return (
        <div className='relative'>

            <div className={`${openDeleteproduct ? 'fixed inset-0' : 'hidden'} overflow-y-scroll border h-screen w-full flex items-center bg-black/60 z-50 `}>

                <div className='z-50 lg:w-[50%] md:w-[80%] w-[98%] h-fit p-2 bg-white rounded-lg m-auto'>
                    <div className='flex flex-col items-center leading-tight'>
                        <h1 className='text-xl font-bold text-center text-[#E7000B]'>Delete Product</h1>

                        <p className="text-sm md:text-base text-gray-700 mb-6 text-center">
                            Are you sure you want to delete {deletepro?.title}? <br />
                            <span className="font-semibold text-red-600">This action cannot be undone.</span>
                        </p>
                    </div>



                    <div className="flex flex-col sm:flex-row justify-center gap-4">

                        <button
                            onClick={() => {
                                setdeletepro({ _id: '', title: '' })
                                setopenDeleteproduct(false)
                            }}
                            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-2xl hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>


                        <button
                            onClick={deLete}
                            className="flex-1 bg-[#C91737] text-white font-semibold py-2 px-4 rounded-2xl hover:bg-red-700 transition flex justify-center items-center"
                        >
                            {
                                isPending ? (<FaSpinner className="text-lg animate-spin" />) : "Delete"
                            }
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${openEditproduct ? 'fixed inset-0' : 'hidden'} overflow-y-scroll border h-screen w-full flex items-center bg-black/60 z-50 `}>

                <div className='z-50 lg:w-[50%] md:w-[80%] w-[98%] h-fit p-2 bg-white rounded-lg m-auto'>
                    <div className='flex justify-between'>
                        <h1 className='text-xl font-bold'>Edit {openproduct?.title}</h1>

                        <button
                            onClick={() => setopenEditproduct(false)}
                            className=" text-2xl hover:text-red-500 cursor-pointer"
                        >
                            <MdClose />
                        </button>
                    </div>

                    <div className='flex gap-2 md:gap-5 mt-5'>
                        <div className='flex flex-col md:w-[50%] w-[49%]'>
                            <p className='lg:text-sm text-lg font-semibold'>Title</p>

                            <div className='flex flex-col leading-tight'>
                                <input
                                    onChange={editFormik.handleChange}
                                    onBlur={editFormik.handleBlur}
                                    value={editFormik.values.title}
                                    name='title'
                                    type="text"
                                    placeholder='e.g. shawarma'
                                    className='border outline-none rounded-sm p-3 text-sm  h-10 hover:border focus:border-[#ED8F0C] focus:outline-none'
                                />

                                {
                                    editFormik.errors.title && editFormik.touched.title && (
                                        <small className='text-red-500 text-sm'>{editFormik.errors.title}</small>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex flex-col md:w-[50%] w-[49%]'>
                            <p className='lg:text-sm text-lg font-semibold'>Price</p>

                            <div className='flex flex-col leading-tight'>
                                <input
                                    onChange={editFormik.handleChange}
                                    onBlur={editFormik.handleBlur}
                                    value={editFormik.values.price}
                                    name='price'
                                    type="number"
                                    placeholder='e.g. 1000'
                                    className='border  outline-none rounded-sm p-3 text-sm  h-10 hover:border focus:border-[#ED8F0C] focus:outline-none'
                                />
                                {
                                    editFormik.errors.price && editFormik.touched.price && (
                                        <small className='text-red-500 text-sm'>{editFormik.errors.price}</small>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col mt-2'>
                        <p className='lg:text-sm text-lg font-semibold'>Description</p>

                        <div className='flex flex-col leading-tight'>
                            <textarea
                                onChange={editFormik.handleChange}
                                onBlur={editFormik.handleBlur}
                                value={editFormik.values.description}
                                name="description"
                                rows={4}
                                placeholder='Description'
                                className='p-2 outline-none border focus:border-[#ED8F0C] focus:outline-none rounded-sm  '
                            ></textarea>
                            {
                                editFormik.errors.description && editFormik.touched.description && (
                                    <small className='text-red-500 text-sm'>{editFormik.errors.description}</small>
                                )
                            }
                        </div>
                    </div>

                    <div className=' mt-3'>
                        <div className='flex gap-5 '>
                            <input
                                onChange={handleEditImg}
                                type="file"
                                id="editimage"
                                className="hidden"
                            />

                            <div className='flex flex-col leading-tight'>
                                <label
                                    htmlFor="editimage"
                                    className="overflow-hidden lg:size-30 size-40 lg:border border-2  border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#ED8F0C] transition-all duration-300"
                                >
                                    {
                                        prev && (
                                            <Image
                                                src={prev}
                                                alt='prev'
                                                height={500}
                                                width={500}
                                                className='h-full w-full object-cover rounded-sm shrink-0'
                                            />
                                        )
                                    }
                                    {
                                        !prev && (
                                            <>
                                                <div className="size-12 rounded-full bg-[#ED8F0C]/10 flex items-center justify-center">
                                                    <span className="text-3xl text-[#ED8F0C]">+</span>
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        Upload Image
                                                    </p>

                                                </div>
                                            </>
                                        )
                                    }
                                </label>
                                {
                                    editFormik.errors.image && editFormik.touched.image && (
                                        <small className='text-red-500 text-sm'>{editFormik.errors.image}</small>
                                    )
                                }

                            </div>

                            <div className='flex flex-col'>
                                <p className='lg:text-sm text-lg font-semibold'>Status</p>

                                <div className='flex flex-col leading-tight'>
                                    <label className=' flex gap-2 p-2 cursor-pointer '>
                                        <input
                                            onChange={editFormik.handleChange}
                                            onBlur={editFormik.handleBlur}
                                            type="radio"
                                            name="status"
                                            value='active'
                                        />

                                        <p className='lg:text-sm text-lg'>Active</p>
                                    </label>

                                    <label className='flex gap-2 p-2 cursor-pointer '>
                                        <input
                                            onChange={editFormik.handleChange}
                                            onBlur={editFormik.handleBlur}
                                            type="radio"
                                            name="status"
                                            value='inactive'
                                        />

                                        <p className='lg:text-sm text-lg text-red-500'>Inactive</p>
                                    </label>

                                    {
                                        editFormik.errors.status && editFormik.touched.status && (
                                            <small className='text-red-500 text-sm'>{editFormik.errors.status}</small>
                                        )
                                    }
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className='flex flex-col mt-5 lg:w-[70%] m-auto'>
                        <button type='button' onClick={() => editFormik.handleSubmit()} className='flex justify-center bg-[#0565FD] hover:bg-[#5492f5] text-white text-[16px] py-2  rounded-xl cursor-pointer transition duration-300'>
                            {

                                isPending ? (
                                    <FaSpinner className="text-lg animate-spin" />
                                ) : ' Edit'

                            }
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${openAddproduct ? 'fixed inset-0' : 'hidden'} overflow-y-scroll border h-screen w-full flex items-center bg-black/60 z-50 `}>

                <div className='z-50 lg:w-[50%] md:w-[80%] w-[98%] h-fit p-2 bg-white rounded-lg m-auto'>
                    <div className='flex justify-between'>
                        <h1 className='text-xl font-bold'>Product information</h1>

                        <button
                            onClick={() => setopenAddproduct(false)}
                            className=" text-2xl hover:text-red-500 cursor-pointer"
                        >
                            <MdClose />
                        </button>
                    </div>

                    <div className='flex gap-2 md:gap-5 mt-5'>
                        <div className='flex flex-col md:w-[50%] w-[49%]'>
                            <p className='lg:text-sm text-lg font-semibold'>Title</p>

                            <div className='flex flex-col leading-tight'>
                                <input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.title}
                                    name='title'
                                    type="text"
                                    placeholder='e.g. shawarma'
                                    className='border outline-none rounded-sm p-3 text-sm  h-10 hover:border focus:border-[#ED8F0C] focus:outline-none'
                                />

                                {
                                    formik.errors.title && formik.touched.title && (
                                        <small className='text-red-500 text-sm'>{formik.errors.title}</small>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex flex-col md:w-[50%] w-[49%]'>
                            <p className='lg:text-sm text-lg font-semibold'>Price</p>

                            <div className='flex flex-col leading-tight'>
                                <input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price}
                                    name='price'
                                    type="number"
                                    placeholder='e.g. 1000'
                                    className='border  outline-none rounded-sm p-3 text-sm  h-10 hover:border focus:border-[#ED8F0C] focus:outline-none'
                                />
                                {
                                    formik.errors.price && formik.touched.price && (
                                        <small className='text-red-500 text-sm'>{formik.errors.price}</small>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col mt-2'>
                        <p className='lg:text-sm text-lg font-semibold'>Description</p>

                        <div className='flex flex-col leading-tight'>
                            <textarea
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.description}
                                name="description"
                                rows={4}
                                placeholder='Description'
                                className='p-2 outline-none border focus:border-[#ED8F0C] focus:outline-none rounded-sm  '
                            ></textarea>
                            {
                                formik.errors.description && formik.touched.description && (
                                    <small className='text-red-500 text-sm'>{formik.errors.description}</small>
                                )
                            }
                        </div>
                    </div>

                    <div className=' mt-3'>
                        <div className='flex gap-5 '>
                            <input
                                onChange={handleProductImg}
                                type="file"
                                id="image"
                                className="hidden"
                            />

                            <div className='flex flex-col leading-tight'>
                                <label

                                    htmlFor="image"
                                    className="overflow-hidden lg:size-30 size-40 lg:border border-2  border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#ED8F0C] transition-all duration-300"
                                >
                                    {
                                        prev && (
                                            <Image
                                                src={prev}
                                                alt='prev'
                                                height={500}
                                                width={500}
                                                className='h-full w-full object-cover rounded-sm shrink-0'
                                            />
                                        )
                                    }
                                    {
                                        !prev && (
                                            <>
                                                <div className="size-12 rounded-full bg-[#ED8F0C]/10 flex items-center justify-center">
                                                    <span className="text-3xl text-[#ED8F0C]">+</span>
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        Upload Image
                                                    </p>

                                                </div>
                                            </>
                                        )
                                    }
                                </label>
                                {
                                    formik.errors.image && formik.touched.image && (
                                        <small className='text-red-500 text-sm'>{formik.errors.image}</small>
                                    )
                                }

                            </div>

                            <div className='flex flex-col'>
                                <p className='lg:text-sm text-lg font-semibold'>Status</p>

                                <div className='flex flex-col leading-tight'>
                                    <label className=' flex gap-2 p-2 cursor-pointer '>
                                        <input
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            type="radio"
                                            name="status"
                                            value='active'
                                        />

                                        <p className='lg:text-sm text-lg'>Active</p>
                                    </label>

                                    <label className='flex gap-2 p-2 cursor-pointer '>
                                        <input
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            type="radio"
                                            name="status"
                                            value='inactive'
                                        />

                                        <p className='lg:text-sm text-lg text-red-500'>Inactive</p>
                                    </label>

                                    {
                                        formik.errors.status && formik.touched.status && (
                                            <small className='text-red-500 text-sm'>{formik.errors.status}</small>
                                        )
                                    }
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className='flex flex-col mt-5 lg:w-[70%] m-auto'>
                        <button type='button' onClick={() => formik.handleSubmit()} className='flex justify-center bg-[#0565FD] hover:bg-[#5492f5] text-white text-[16px] py-2  rounded-xl cursor-pointer transition duration-300'>
                            {

                                isPending ? (
                                    <FaSpinner className="text-lg animate-spin" />
                                ) : ' Add'

                            }
                        </button>
                    </div>
                </div>
            </div>

            <div className='md:hidden w-full px-5 py-4 mb-7 content-center'>
                <h1 className='text-3xl font-bold'>Products</h1>
            </div>

            <section className='w-full md:p-10 p-3'>
                <nav className=' w-full grid lg:grid-cols-5 md:grid-cols-3 md:p-3 md:gap-5 gap-3 grid-cols-2 h-fit bg-[#FFFFFF]/30 rounded-lg shadow-md'>

                    <div className='min-h-20 md:min-h-14 flex items-center gap-2'>
                        <div className='size-8 rounded-lg shrink-0 flex flex-col justify-center items-center  bg-[#23CA47]'>
                            <FaAward className='text-white text-lg' />
                        </div>

                        <div className=' leading-tight'>
                            <small className='text-[13px] md:text-[10px] text-[#747378]'> Most Sold</small>
                            <p className=' text-[14px] mt-0 line-clamp-2 font-medium'>{highestSold?.title}</p>
                        </div>
                    </div>

                    <div className='min-h-20 md:min-h-14 flex items-center gap-2'>
                        <div className='size-8 rounded-lg bg-[#4408E8] shrink-0  flex flex-col justify-center items-center '>
                            <HiOutlineCurrencyDollar className='text-white text-lg' />
                        </div>

                        <div className=' leading-tight'>
                            <small className='text-[13px] md:text-[10px] text-[#747378]'> Highest Revenue</small>
                            <p className=' text-[14px] mt-0 line-clamp-2 font-medium'>{highestRev?.title}</p>
                        </div>
                    </div>

                    <div className='min-h-20 md:min-h-14 flex items-center gap-2'>
                        <div className='size-8 rounded-lg bg-[#FD4538] shrink-0 flex flex-col justify-center items-center'>
                            <FaArrowDown className='text-white text-lg' />
                        </div>

                        <div className=' leading-tight'>
                            <small className='text-[13px] md:text-[10px] text-[#747378]'> Least Sold</small>
                            <p className=' text-[14px] mt-0 line-clamp-2 font-medium'>{leastSold?.title}</p>
                        </div>
                    </div>

                    <div className='min-h-20 md:min-h-14 flex  items-center gap-2'>
                        <div className='size-8 rounded-lg shrink-0 flex flex-col justify-center items-center  bg-[#23CA47]'>
                            <BsPatchCheckFill className='text-white text-lg' />
                        </div>

                        <div className='leading-tight'>
                            <small className='text-[13px] md:text-[10px] text-[#747378]'> Active</small>
                            <p className=' text-[14px] mt-0 line-clamp-2 font-medium'>{activeProducts.length}</p>
                        </div>
                    </div>

                    <div className='min-h-20 md:min-h-14 flex  items-center gap-2'>
                        <div className='size-8 rounded-lg bg-[#FF7B30] shrink-0 flex flex-col justify-center items-center '>
                            <HiShoppingCart className='text-white text-lg' />
                        </div>

                        <div className=' leading-tight'>
                            <small className='text-[13px] md:text-[10px] text-[#747378]'>Inactive</small>
                            <p className=' text-[14px] mt-0 line-clamp-2 font-medium'>{inactiveProducts.length}</p>
                        </div>
                    </div>

                </nav>


                <section className='px-2 w-full h-fit m-auto rounded-lg bg-white mt-10'>
                    <div className='w-full flex md:flex-row md:justify-between flex-col gap-2 p-2'>
                        <div className="md:w-70 overflow-hidden md:h-8 h-10 rounded-2xl flex  items-center border border-gray-400">
                            <input
                                onChange={searchFormik.handleChange}
                                value={searchFormik.values.search}
                                name='search'
                                className='flex-1 outline-0 md:h-8 h-10 text-sm text-gray-500 px-2'
                                placeholder='Search'
                                type="text" />

                            <button type='button' onClick={() => searchFormik.handleSubmit()} className='size-10 md:size-8 transition-all duration-300 rounded-full hover:bg-[#ED8F0C]/30 bg-[#ED8F0C]/20 text-[#ED8F0C] flex flex-col items-center justify-center cursor-pointer'>
                                {
                                    isSearch ? (<FaSpinner size={15} className='animate-spin' />) : (<FaSearch size={15} />)
                                }
                            </button>
                        </div>

                        {/* <Link href='/admin-dashboard/addproduct'> */}
                        <button onClick={() => setopenAddproduct(true)} className='bg-[#0565FD] hover:bg-[#5492f5] text-white text-[16px] py-2 md:px-4 rounded-2xl cursor-pointer transition duration-300'>
                            Add product
                        </button>
                        {/* </Link> */}
                    </div>

                    {
                        allfiltered.length === 0 && (
                            <div className="w-full py-10 px-5 flex flex-col items-center justify-center text-center gap-3">
                                <FaSearch className="text-4xl text-gray-300" />

                                <h2 className={`${anton.className} text-2xl text-gray-700`}>
                                    No Products Found
                                </h2>
                            </div>
                        )
                    }

                    {
                        allfiltered.length !== 0 && (
                            <table className='border-collapse mt-10 w-full bg-zinc-50 shadow-md rounded-xl overflow-hidden'>
                                <thead className='h-8 bg-gray-50 md:table-header-group hidden' >
                                    <tr className=' text-left text-gray-600 text-sm tracking-wide'>
                                        <th className='pl-2'>
                                            Product
                                        </th>
                                        <th>
                                            Created At
                                        </th>
                                        <th>
                                            Status
                                        </th>
                                        <th>
                                            Amount
                                        </th>
                                        <th>

                                        </th>

                                    </tr>
                                </thead>

                                <tbody >
                                    {
                                        allfiltered.map((pro) => (

                                            <tr onClick={() => router.push(`/admin-dashboard/products/${pro._id}`)} key={pro._id} className='cursor-pointer border-gray-300 hover:bg-gray-50 transition bg-white shadow-sm flex flex-col md:table-row md:p-0 p-4 gap-2 md:gap-0 border-b '>
                                                <td className=' flex md:gap-2  items-center justify-between md:justify-start md:p-4 '>
                                                    <div className='size-10 rounded-full overflow-hidden'>
                                                        <Image
                                                            src={pro.image}
                                                            alt='product'
                                                            height={500}
                                                            width={500}
                                                            className='w-ful h-full object-cover'
                                                        />
                                                    </div>

                                                    <div className='leading-tight'>
                                                        <h1 className='text-lg md:text-[16px] text-[18px] font-semibold text-gray-600'>
                                                            {pro.title}
                                                        </h1>
                                                        <p className='text-gray-600 text-[14px] md:text-[12px]'>{(pro._id.toString().slice(0, 10))}</p>
                                                    </div>
                                                </td>

                                                <td className='flex md:table-cell justify-between py-4'>
                                                    <h2 className='md:hidden text-[22px] text-bold'>
                                                        Date
                                                    </h2>

                                                    <p className='text-gray-500 text-[18px] md:text-[16px]'>{pro.createdAt.toLocaleDateString()}</p>
                                                </td>

                                                <td className='flex md:table-cell justify-between py-4'>
                                                    <h2 className='md:hidden text-[22px] text-bold'>
                                                        Status
                                                    </h2>


                                                    <div className='flex gap-1 items-center'>
                                                        <BsPatchCheckFill className={`${pro.status === 'inactive' ? 'text-red-500' : "text-[#23CA47]"} text-sm`} />
                                                        <p className={`${pro.status === 'inactive' ? 'text-red-500' : "text-[#23CA47]"}  text-[18px] md:text-[16px]`}>{pro.status}</p>
                                                    </div>
                                                </td>

                                                <td className='flex md:table-cell justify-between py-4'>
                                                    <h1 className='md:hidden text-[22px] text-bold'>
                                                        Amount
                                                    </h1>

                                                    <p className={`${anton.className} text-lg text-[18px] md:text-[16px] text-[#ED8F0C] tracking-wide`}>
                                                        ₦{(pro.price).toLocaleString()}
                                                    </p>
                                                </td>

                                                <td className='flex md:table-cell justify-between py-4 '>
                                                    <h1 className='md:hidden text-[22px] text-bold'>
                                                        Action
                                                    </h1>

                                                    <div className='flex gap-1'>
                                                        <button onClick={(e) => {
                                                            e.stopPropagation();
                                                            setopenEditproduct(true)
                                                            setopenproduct(pro)
                                                        }} className='p-1.5 bg-gray-200 shadow-2xl rounded-lg cursor-pointer'>
                                                            < MdEdit className='text-lg text-[#0662FD]' />
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setopenDeleteproduct(true)
                                                                setdeletepro({ _id: pro._id, title: pro.title })
                                                            }}
                                                            className='p-1.5 bg-gray-200 shadow-2xl rounded-lg cursor-pointer '>
                                                            < MdDelete className='text-lg text-[#F6473F]' />
                                                        </button>
                                                    </div>
                                                </td>


                                            </tr>
                                        ))
                                    }

                                </tbody>

                            </table>
                        )
                    }
                </section>
            </section>


        </div>
    )
}

export default Products
