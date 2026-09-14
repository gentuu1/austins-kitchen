'use client'

import { deleTeProduct, editProduct } from "@/app/utils/action";
import { deletePro, proDuct } from "@/app/utils/type";
import { useFormik } from "formik";
import * as yup from 'yup'
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";

const Del_Edit = ({ _id, title, description, image, createdAt, price, status, purchaseCount, revenue,}: proDuct) => {
    const [openEditproduct, setopenEditproduct] = useState(false);
     const [openproduct, setopenproduct] = useState <proDuct | null>(null);
    const [prev, setprev] = useState('')
    const [openDeleteproduct, setopenDeleteproduct] = useState(false);
    const [deletepro, setdeletepro] = useState<deletePro | null>(null);
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    

     const deLete = async()=>{
            startTransition(async()=>{
                if(!deletepro?._id){
                    return
                }else{
                    const res = await deleTeProduct(deletepro?._id);
    
                    if(!res.success){
                        toast.error(res.message)
                        return
                    }
    
                    toast.success(res.message, {
                        autoClose : 2000
                    })
                    
                    router.push('/admin-dashboard/products')
                    setopenDeleteproduct(false)
                }
            })
        }

        const cancelDEl = ()=>{
            setdeletepro({ _id: '', title: '' })
            setopenDeleteproduct(false)
            router.refresh()
        } 


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
        
            const editFormik = useFormik ({
                initialValues: {
                    _id : '',
                    title: '',
                    price: '',
                    description: '',
                    image: '',
                    status: ''
                },
        
                onSubmit: (values) => {
                    startTransition(async () => {
                        const res = await editProduct(values);
        
                        if(!res.success){
                            toast.error(res.message, {
                                autoClose : 2000
                            })
                            return
                        }
        
                        toast.success(res.message, {autoClose : 2000})

                        router.refresh()
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

           const cancelEdit = () =>{
                setopenEditproduct(false)
                router.refresh()
            }


    

    return (
        <div>
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
                            onClick={() => cancelDEl()}
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
                            onClick={() =>cancelEdit()}
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


            <div className="flex flex-col md:flex-row mt-5 gap-5">
                <button onClick={() => {
                    setopenEditproduct(true)
                    setopenproduct({ _id, title, description, image, createdAt, price, status, purchaseCount, revenue })
                }}
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0565FD] hover:bg-[#5492f5] text-white font-semibold py-3 px-5 rounded-xl transition cursor-pointer"
                >
                    Edit Product
                </button>

                <button
                    onClick={
                        () => {
                        setopenDeleteproduct(true)
                        setdeletepro({ _id: _id.toString(), title: title })
                        }
                     }
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 transition hover:bg-red-400 bg-red-500 text-white py-3 rounded-xl cursor-pointer"
                >
                    Delete
                </button>
            </div>

        </div>
    )
}

export default Del_Edit
