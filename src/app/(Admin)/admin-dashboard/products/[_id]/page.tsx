    import { productModel } from "@/app/models/product";
    import dbConnect from "@/app/utils/dbConnects";
    import { VerifyUser } from "@/app/utils/session"
import Del_Edit from "@/components/Del_Edit";
    import { Anton } from "next/font/google";
    import Image from "next/image";
    import Link from "next/link";
    import { redirect } from "next/navigation"


    const anton = Anton({ subsets: ['latin'], weight: '400' });


    const Page = async ({ params }: { params: { _id: string } }) => {
        await dbConnect();

        const { _id } = await params

        const { user, success } = await VerifyUser()

        if (!success) redirect('/signin')

        if (user.role !== 'admin') redirect('/dashboard')

        const product = await productModel.findById(_id);

        if (!product) redirect('/admin-dashboard/products')

        return (
            <div className="min-h-screen bg-zinc-50">

                <section className="w-full max-w-7xl mx-auto px-5 py-8">

                    <Link
                        href="/admin-dashboard/products"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#ED8F0C] transition mb-6"
                    >
                        ← Back to products
                    </Link>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        <div className="">

                            <div className=" w-full aspect-square rounded-3xl overflow-hidden bg-orange-50">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    height={300}
                                    width={300}
                                    loading='eager'
                                    priority
                                    className="object-cover size-full"
                                />
                            </div>

                        </div>


                        {/* RIGHT — Product Details */}
                        <div className="flex flex-col justify-center">

                            <p className="text-sm font-medium text-[#ED8F0C] uppercase tracking-wider mb-3">
                                Austin Kitchen
                            </p>

                            <h1 className={`${anton.className} text-4xl md:text-5xl text-gray-800 tracking-wide`}>
                                {product.title}
                            </h1>

                            <p className={`${anton.className} text-3xl text-[#ED8F0C] mt-6`}>
                                ₦{product.price.toLocaleString()}
                            </p>

                            <p className="text-gray-500 leading-7 mt-5 max-w-xl">
                                {product.description}
                            </p>

                            <div className="flex items-center gap-3 mt-6">
                                <span className="text-sm text-gray-500">
                                    Status
                                </span>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${product.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {product.status}
                                </span>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm text-gray-500">
                                    Created
                                </p>

                                <p className="text-gray-700">
                                    {product.createdAt.toLocaleDateString()}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-white rounded-xl p-5 shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        Revenue
                                    </p>

                                    <p className={`${anton.className} text-2xl text-[#ED8F0C] mt-2`}>
                                        ₦{product.revenue.toLocaleString()}
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl p-5 shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        Purchase Count
                                    </p>

                                    <p className={`${anton.className} text-2xl text-[#ED8F0C] mt-2`}>
                                        {String(product.purchaseCount).padStart(2, "0")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Del_Edit _id={product._id.toString()} title={product.title} description={product.description} image={product.image} createdAt={product.createdAt} price={product.price} status={product.status} purchaseCount={product.purchaseCount} revenue={product.revenue} />

                </section>

            </div>
        )
    }

    export default Page
