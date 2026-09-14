"use server"

import { cookies } from "next/headers"
import dbConnect from "./dbConnects"
import { userModel } from "../models/user"
import * as bcrypt from "bcrypt"
import { auth, encrypt, VerifyUser } from "./session"
import { redirect } from "next/navigation"
import cloudinary from "./cloudinary"
import { productModel } from "../models/product"
import { revalidatePath } from "next/cache"
import { allOrdItem, cartProduct, meNu } from "./type"
import { cartModel } from "../models/cart"
import { savedProductModel } from "../models/savedproduct"
import { orderModel } from "../models/order"
import { verifyOtpModel } from "../models/verifyOtp"
import { ImInsertTemplate } from "react-icons/im"
import { landingImageModel } from "../models/landingimages"
import { TbBackground } from "react-icons/tb"
import { ObjectId } from "mongoose"
const otpGenerator = require('otp-generator')
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.NODE_MAIL_PASS
    },
});


export const signUp = async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}) => {
    try {
        await dbConnect();

        data.email = data.email.toLowerCase().trim()
        data.firstName = data.firstName.toLowerCase().trim()
        data.lastName = data.lastName.toLowerCase().trim()

        const existing = await userModel.findOne({ email: data.email })
        if (existing) {
            return {
                success: false,
                message: "User already exist. Log In!"
            }
        }

        if (!data.email || !data.firstName || !data.lastName || !data.password) {
            return {
                success: false,
                message: 'All fields are mandatory'
            }
        }

        if (data.password.length < 8) {
            return {
                success: false,
                message: 'Password must be at least 8 characters'
            }
        }

        if (data.confirmPassword != data.password) {
            return {
                success: false,
                message: "Passwords do not match"
            }
        }
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(data.password, salt)

        const create = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashpassword,
            role: 'user'
        }

        const user = await userModel.create(create)

        const message = {
            from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
            to: user.email,
            subject: "Welcome to Austin Kitchen!",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                    Austin Kitchen
                </h1>
            </div>

            <p style="font-size: 18px; margin-top: 25px;">
                Hello ${user.firstName},
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
                Welcome to <strong>Austin Kitchen!</strong> 🎉
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
                We're happy to have you join us, and we truly appreciate you
                creating an account with Austin Kitchen.
            </p>

            <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd; text-align: center;">

                <p style="font-size: 24px; font-weight: bold; margin: 0; color: #1F2933;">
                    Welcome aboard! 🍽️
                </p>

                <p style="font-size: 15px; color: #666; margin-top: 10px; line-height: 1.5;">
                    Your account has been successfully created and you're all set to explore Austin Kitchen.
                </p>

            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                From delicious meals to convenient ordering and delivery,
                we're excited to have you as part of the Austin Kitchen community.
            </p>

            <div style="background-color: #ED8F0C; padding: 15px 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="font-size: 16px; font-weight: bold; color: #ffffff; margin: 0;">
                    Thank you for joining Austin Kitchen!
                </p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                We hope you enjoy your experience with us. We look forward to serving you!
            </p>

            <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
                <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
                    This is an automated welcome email. Please do not reply to this message.
                </p>

                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
                    © 2026 Austin Kitchen. All rights reserved.
                </p>
            </div>

        </div>
    `
        };

        try {
            await transporter.sendMail(message)
        } catch (err) {
            console.log(err)
        }



        const token = await encrypt({ _id: user._id.toString() })

        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            sameSite: 'lax',
            path: '/',
        })



        return { success: true, message: "Account successfully created" }
    } catch (error) {
        return {
            success: false,
            message: 'Something went wrong'
        }
    }

}

export const signIn = async (data: {
    email: string
    password: string
}) => {
    try {
        await dbConnect();

        data.email = data.email.toLowerCase().trim()

        if (!data.email || !data.password) {
            return {
                success: false,
                message: 'Both fields are required'
            }
        }

        const user = await userModel.findOne({ email: data.email })

        if (!user) {
            return {
                success: false,
                message: 'Invalid credentials'
            }
        }
        const role = user.role

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
            return {
                success: false,
                message: 'Invalid credentials'
            }
        }

        const token = await encrypt({ _id: user._id.toString() })
        const cookieStore = await cookies()

        cookieStore.set('token', token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            sameSite: 'lax',
            path: '/',
        })

        return { success: true, message: ' Successfully logged in', role }
    } catch (error) {
        return {
            success: false,
            message: " Something went wrong"
        }
    }

}

export const reqFgOtp = async (data: {
    email: string,
    newPassword: string
}) => {
    try {
        await dbConnect();

        data.email = data.email.toLowerCase().trim()
        data.newPassword = data.newPassword.trim()


        if (!data.email) return { success: false, message: "Email is required" }
        if (!data.newPassword) return { success: false, message: "New password is required" }
        if (data.newPassword.length <= 7) return { success: false, message: "Password must be atleast 8 characters" }

        const user = await userModel.findOne({ email: data.email });

        if (!user) return { success: false, message: "User not found!" }

        const hashpassword = await bcrypt.hash(data.newPassword, 10);

        const ExistOtp = await verifyOtpModel.findOne({
            email: data.email,
            type: "forgot-password"
        })

        if (ExistOtp) return { success: false, message: "Please wait before requesting another OTP." };



        const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        const hashedOtp = await bcrypt.hash(OTP, 10)



        const newOtp = await verifyOtpModel.create({
            email: data.email,
            newPassword: hashpassword,
            otp: hashedOtp,
            type: 'forgot-password'
        })

        const message = {
            from: `"Austin kitchen" <${process.env.NODE_MAIL}>`,
            to: data.email,
            subject: "Password Reset Verification Code",
            html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
      <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">Austin Kitchen</h1>
    </div>

    <p style="font-size: 18px; margin-top: 20px;">
      Hello,
    </p>

    <p style="font-size: 16px; line-height: 1.5;">
      We received a request to reset your password on <strong>Austin kitchen</strong>.
      Use the verification code below to continue with your password reset.
    </p>

    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd; text-align: center;">
      <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">${OTP}</p>
    </div>

    <p style="font-size: 16px; line-height: 1.5; color: #333;">
      This code will expire in 10 minutes. If you did not request a password reset, please ignore this email.
    </p>

    <p style="font-size: 14px; color: #666; text-align: center; margin-top: 40px;">
      © 2026 Austin Kitchen. All rights reserved.
    </p>
  </div>
  `,
        };

        try {
            await transporter.sendMail(message);

        } catch (err) {
            console.log(err);
            await newOtp.deleteOne()
            return { success: false, message: "Failed to send OTP email" };
        }

        return { success: true, message: "Otp sent to email" }


    } catch (error) {
        console.log(error);
        return { success: false, message: "Something went wrong" }
    }
}

export const confFgPassOtp = async (data: {
    email: string,
    newPassword: string,
    otp: string
}) => {
    try {
        await dbConnect();

        data.email = data.email.toLowerCase().trim();
        data.newPassword = data.newPassword.trim();
        data.otp = data.otp.trim();

        if (!data.email) return { success: false, message: "Email is required" }
        if (!data.newPassword) return { success: false, message: "New password is required" }
        if (data.newPassword.length <= 7) return { success: false, message: "New password must be at least 8 characters" }
        if (!data.otp) return { success: false, message: "OTP is required" }

        const user = await userModel.findOne({ email: data.email });

        if (!user) return { success: false, message: "User not found!" }

        const verifyOtp = await verifyOtpModel.findOne({
            email: data.email,
            type: 'forgot-password'
        })

        if (!verifyOtp) return { success: false, message: "Error verifying OTP" };

        const isMatch = await bcrypt.compare(data.otp, verifyOtp.otp)
        const isMatchpass = await bcrypt.compare(data.newPassword, verifyOtp.newPassword)

        if (!isMatch) return { success: false, message: 'Invalid OTP' }
        if (!isMatchpass) return { success: false, message: 'New password mismatch' }

        await userModel.findOneAndUpdate({ email: verifyOtp.email }, { password: verifyOtp.newPassword });

        await verifyOtp.deleteOne()

        return { success: true, message: "Password successfully changed" }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const signOut = async () => {
    try {

        const cookieStore = await cookies();
        cookieStore.delete("token")

        return {
            success: true,
            message: `You've successfully logged out`
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const addProduct = async (data: {
    title: string
    price: string
    description: string
    status: string
    image: string
}) => {
    try {

        const { success, user } = await VerifyUser()

        if (!success) {
            redirect('/signin')
        }
        await dbConnect()

        data.title = data.title.toLowerCase().trim()
        const price = Number(String(data.price).trim())
        data.description = data.description.toLowerCase().trim()
        data.status = data.status.toLowerCase().trim()

        if (!data.title || isNaN(price) || price <= 0 || !data.description || !data.image.trim() || !data.status) {
            return {
                success: false,
                message: 'All fields are required!'
            }
        }


        if (data.image) {
            const productImage = await cloudinary.uploader.upload(data.image, {
                folder: 'austinskitchen',
                transformation: [
                    { width: 500, height: 500, crop: 'fill' }
                ]
            })

            data.image = productImage?.secure_url
        }

        if (user.role !== "admin") {
            return {
                success: false,
                message: "You are not allowed!"
            }
        }

        const product = {
            price,
            title: data.title,
            description: data.description,
            status: data.status,
            image: data.image
        }

        const pr = await productModel.create(product)

        revalidatePath('/admin-dashboard/products')

        return {
            success: true,
            message: "Product added successfully"
        }


    } catch (error) {
        console.log('Product error', error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const fectchProduct = async () => {
    try {
        await dbConnect();

        const { success, user } = await VerifyUser();

        if (!success) {
            redirect('/signin')
        }

        if (user.role !== "admin") {
            redirect('/signin')
        }

        const products = await productModel.find().sort({ _id: -1 })

        const product = products.map(each => {

            return {
                _id: each._id.toString(),
                title: each.title,
                description: each.description,
                price: each.price,
                status: each.status,
                image: each.image,
                createdAt: each.createdAt,
                purchaseCount: each.purchaseCount,
                revenue: each.revenue
            }

        })

        return {
            products: product
        }


    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const editProduct = async (data: {
    _id: string
    title: string
    price: string
    description: string
    image: string
    status: string
}) => {
    try {
        await dbConnect();
        const { success, user } = await VerifyUser();

        if (!success) {
            redirect('/signin')
        }

        const _id = data._id
        data.title = data.title.toLowerCase().trim()
        const price = Number(String(data.price).trim())
        data.description = data.description.toLowerCase().trim()
        data.status = data.status.toLowerCase().trim()

        if (!_id) {
            return {
                success: false,
                message: "Product ID is missing"
            }
        }



        if (!data.title || isNaN(price) || price <= 0 || !data.description || !data.image.trim() || !data.status) {
            return {
                success: false,
                message: 'All fields are required!'
            }
        }

        if (data.image && data.image.startsWith("data:image")) {
            const productImage = await cloudinary.uploader.upload(data.image, {
                folder: 'austinskitchen',
                transformation: [
                    { width: 500, height: 500, crop: 'fill' }
                ]
            })

            data.image = productImage?.secure_url
        }

        if (user.role !== "admin") {
            return {
                success: false,
                message: "You are not allowed"
            }
        }

        const datatoUpdate = {
            title: data.title,
            price,
            description: data.description,
            image: data.image,
            status: data.status
        }

        const update = await productModel.findByIdAndUpdate(_id, datatoUpdate);

        if (!update) {
            return {
                success: false,
                message: `Error editing ${datatoUpdate.title}`
            }
        }

        if (datatoUpdate.status === 'inactive') {
            await cartModel.updateMany({}, {
                $pull: {
                    items: {
                        productId: _id
                    }
                }
            })

            await savedProductModel.deleteMany({ productId: _id })
        }

        revalidatePath('/admin-dashboard/products')
        return {
            success: true,
            message: `${datatoUpdate.title} successfully updated`
        }


    } catch (error) {
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const deleTeProduct = async (_id: string) => {
    try {
        await dbConnect();
        const { success, user } = await VerifyUser();

        if (!success) {
            redirect('/signin')
        }

        if (user.role !== "admin") {
            return {
                success: false,
                message: "You are not allowed!"
            }
        }

        if (!_id) {
            return {
                success: false,
                message: "Product is missing"
            }
        }

        const product = await productModel.findByIdAndDelete(_id);

        if (!product) {
            return {
                success: false,
                message: "Unable to delete product"
            }
        }

        await savedProductModel.deleteMany({ productId: _id })

        await cartModel.updateMany({}, {
            $pull: {
                items: {
                    productId: _id
                }
            }
        })

        revalidatePath('/admin-dashboard/products')
        return {
            success: true,
            message: `${product.title} successfully deleted`
        }



    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const menu = async () => {
    try {
        await dbConnect();

        const products = await productModel.find({ status: 'active' }).sort({ _id: -1 });

        const product: meNu[] = products.map((pro) => {
            return {
                _id: pro._id.toString(),
                title: pro.title,
                image: pro.image,
                price: pro.price
            }
        })

        return {
            success: true,
            product
        }

    } catch (error) {
        console.log(error)
        return {
            product: [],
            success: false,
            message: "Something went wrong"
        }
    }
}

export const mostPrch = async () => {
    try {
        await dbConnect();

        const bestSell = await productModel.find({ status: { $ne: 'inactive' } }).sort({ purchaseCount: -1 }).select('_id image price title').limit(4)

        const prds = bestSell.map((item) => ({
            _id: item._id.toString(),
            image: item.image,
            price: item.price,
            title: item.title
        }))
        return {
            products: prds
        }

    } catch (error) {
        console.log(error)
        return { success: false, products: [], message: "Something went wrong" }
    }
}

export const alsoLike = async () => {
    try {
        await dbConnect();

        const like = await productModel.find({ status: { $ne: 'inactive' } }).select('_id image price title').limit(10)
        const youmaylike = like.map((item) => ({
            _id: item._id.toString(),
            image: item.image,
            price: item.price,
            title: item.title
        }))
        return {
            items: youmaylike
        }


    } catch (error) {
        console.log(error)
        return { success: false, items: [], message: "Something went wrong" }
    }
}

export const addToCart = async (id: string) => {
    try {
        await dbConnect();
        const { success, user } = await VerifyUser();

        if (!success) {
            return { success: false, message: "Login required" }
        }

        if (user.role === "admin") {
            return {
                success: false,
                message: "Admin not allowed"
            }
        }

        const existPro = await productModel.findById(id);

        if (!existPro) {
            return {
                success: false,
                message: "Product not found"
            }
        }

        const cart = await cartModel.findOne({ userId: user._id })

        if (!cart) {
            await cartModel.create({
                userId: user._id,
                items: [
                    {
                        productId: id.toString(),
                        quantity: 1
                    }

                ]
            })

            return {
                success: true,
                message: `Product added to cart`
            }
        }


        const existingProduct = cart.items.find(
            (item: { productId: string, quantity: number }) => item.productId.toString() === id
        )
        if (existingProduct) {
            existingProduct.quantity++

            await cart.save()

            revalidatePath('/dashboard/menu')
            revalidatePath('/dashboard/cart-order')

            return {
                success: true,
                message: `Product quantity increased`
            }
        }


        cart.items.push({
            productId: id,
            quantity: 1
        });

        await cart.save()

        revalidatePath('/dashboard/menu')
        revalidatePath('/dashboard/cart-order')


        return {
            success: true,
            message: "Product added to cart"
        }



    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const fetchCart = async () => {
    try {
        await dbConnect();
        const { success, _id } = await auth();

        if (!success) {
            redirect('/signin')
        }

        const isCart = await cartModel.findOne({ userId: _id }).populate('items.productId');

        if (!isCart) {
            return {
                success: false,
                items: []
            }
        }

        const items = isCart.items.map((item: cartProduct) => {
            return {
                _id: item.productId._id.toString(),
                image: item.productId.image,
                title: item.productId.title,
                price: item.productId.price * item.quantity,
                quantity: item.quantity
            }
        })

        return {
            success: true,
            items
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const removeCartproduct = async (id: string) => {
    try {
        await dbConnect();
        const { success, _id } = await auth()

        if (!success) {
            redirect('/signin')
        };

        const cart = await cartModel.findOne({ userId: _id!.toString() });

        if (!cart) {
            return {
                success: false,
                message: 'Your cart is empty'
            }
        }

        const deletePro = cart.items.find((item: { productId: string, quantity: number }) =>
            item.productId.toString() == id.toString()
        )

        if (!deletePro) {
            return {
                success: false,
                message: 'Product not found in cart'
            }
        }

        cart.items = cart.items.filter((item: { productId: string, quantity: number }) =>
            item.productId.toString() !== id.toString()
        )

        await cart.save();
        revalidatePath('/dashboard/cart-order')

        return {
            success: true,
            message: "Product removed"
        }


    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const decreaseCartproduct = async (id: string) => {
    try {
        await dbConnect();

        const { success, _id } = await auth();

        if (!success) {
            redirect('/signin')
        }

        const cart = await cartModel.findOne({ userId: _id!.toString() });

        if (!cart) {
            return {
                success: false,
                message: "Your cart is empty"
            }
        }

        const decPro = cart.items.find((item: { productId: string, quantity: number }) =>
            item.productId.toString() === id.toString()
        )

        if (!decPro) {
            return {
                success: false,
                message: "Product not found"
            }
        }

        if (decPro.quantity > 1) {
            decPro.quantity--

            await cart.save()
            revalidatePath('/dashboard/cart-order')

            return {
                success: true,
                message: "Quantity decreased"
            }
        }

        cart.items = cart.items.filter((item: { productId: string, quantity: number }) =>
            item.productId.toString() !== id.toString()
        )

        await cart.save();
        revalidatePath('/dashboard/cart-order')
        return {
            success: true,
            message: "Product removed"
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }

}

export const increaseCartproduct = async (id: string) => {
    try {
        await dbConnect();

        const { success, _id } = await auth();

        if (!success) {
            redirect('/signin')
        }

        const cart = await cartModel.findOne({ userId: _id!.toString() });

        if (!cart) {
            return {
                success: false,
                message: "Your cart is empty"
            }
        }

        const incPro = cart.items.find((item: { productId: string, quantity: number }) =>
            item.productId.toString() === id.toString()
        )

        if (!incPro) {
            return {
                success: false,
                message: "Product not found"
            }
        }


        incPro.quantity++

        await cart.save()
        revalidatePath('/dashboard/cart-order')

        return {
            success: true,
            message: "Quantity increased"
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }

}

export const productSaved = async (id: string) => {
    try {
        await dbConnect();

        const { success, _id } = await auth()

        if (!success) {
            return {
                success: false,
                message: "Login required"
            }
        }

        const user = await userModel.findById(_id)
        if (!user) return { success: false, message: "Account not found" }
        if (user.role === 'admin') return { success: false, message: "Admin not allowed" }

        const product = await productModel.findById(id)

        if (!product) {
            return {
                success: false,
                message: "Product not found"
            }
        }

        const saved = await savedProductModel.findOne({
            userId: _id,
            productId: id
        })

        if (saved) {
            return {
                success: false,
                message: "Product has already been added to favourite"
            }
        }

        await savedProductModel.create({
            userId: _id,
            productId: id
        })

        return {
            success: true,
            message: "Product added to favourite"
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const fetchfav = async () => {
    try {
        await dbConnect();

        const { success, _id } = await auth()

        if (!success) {
            return {
                success: false,
                message: " Login required"
            }
        }

        const favProducts = await savedProductModel.find({ userId: _id }).populate("productId", "image price title")

        const favPro = favProducts.map(each => {
            const pro = {
                _id: each.productId._id.toString(),
                title: each.productId.title,
                image: each.productId.image,
                price: each.productId.price
            }

            return pro
        })

        return {
            success: true,
            favPro
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const removefav = async (id: string) => {
    try {
        await dbConnect();

        const { success, _id } = await auth();

        if (!success) {
            return {
                success: false,
                message: "Login required"
            }
        }

        const favPro = await savedProductModel.findOneAndDelete({ userId: _id, productId: id });

        if (!favPro) {
            return {
                success: false,
                message: "Product not found"
            }
        }

        return {
            success: true,
            message: "Product successfully removed"
        }


    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}


export const iniPayment = async (details: {
    state: string,
    address: string,
    town: string,
    phoneNumber: string,
    firstName: string,
    lastName: string,
}) => {
    try {
        await dbConnect()

        const { success, user } = await VerifyUser();

        if (!success) {
            return {
                success: false,
                message: "Login required"
            }
        }




        const cart = await cartModel.findOne({ userId: user._id }).populate("items.productId", "title  price image")

        if (!cart || cart.items.length === 0) {
            return {
                success: false,
                message: "Your cart is empty"
            }
        }
        const deliveryfee = 1000

        const totalAmount = cart.items.reduce((sum: number, item: any) => {
            return sum + item.productId.price * item.quantity
        }, 0) + deliveryfee



        if (!details.address || !details.state || !details.town || !details.phoneNumber || !details.firstName || !details.lastName) {
            return {
                success: false,
                message: "All fields are mandatory"
            }
        }

        const items = cart.items.map((item: any) => ({
            quantity: item.quantity,
            productId: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            image: item.productId.image
        }))

        const presvDetails = {
            items,
            userId: user._id,
            email: user.email,
            firstName: details.firstName,
            lastName: details.lastName,
            address: details.address,
            state: details.state,
            town: details.town,
            phoneNumber: details.phoneNumber,
            totalAmount,
            deliveryfee
        }

        const response = await fetch(
            "https://api.paystack.co/transaction/initialize",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.LIVE_PAY_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    amount: totalAmount * 100,
                    callback_url: "http://localhost:3000/dashboard/check-out/success",
                    metadata: {
                        presvDetails
                    }
                })
            }
        );

        const data = await response.json()

        if (!response.ok || !data.status) {
            return {
                success: false,
                message: data.message
            }
        }



        return {
            success: true,
            message: data.message,
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference
        }




    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something wemt wrong"
        }
    }
}

export const verifyPay = async (reference: string) => {
    try {
        await dbConnect();

        const { _id, success } = await auth();

        if (!success) {
            return {
                success: false,
                message: "Login required"
            }
        }

        if (!reference) {
            return {
                success: false,
                message: "Unauthorized transaction"
            }
        }

        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.LIVE_PAY_SECRET_KEY}`,
                }
            }
        );

        const data = await response.json()

        if (data.data.status !== 'success') {
            return {
                success: false,
                message: "Payment not successful"
            }
        }


        const details = data.data.metadata.presvDetails
        const datadetails = data.data

        if (details.userId.toString() !== _id!.toString()) return { success: false, message: "Unauthorized user detected!" };

        const existOrder = await orderModel.findOne({
            paymentReference: reference,
            userId: details.userId
        });

        if (existOrder) {
            return {
                _id: existOrder._id.toString(),
                totalAmount: existOrder.totalAmount,
                paymentStatus: existOrder.paymentStatus,
                status: existOrder.status,
                success: true,
                message: "Order Placed!"
            }
        }


        if (datadetails.amount !== details.totalAmount * 100) {
            const response = await fetch(
                "https://api.paystack.co/refund",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.LIVE_PAY_SECRET_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        transaction: datadetails.id
                    })

                },

            );

            const data = await response.json()

            if (!response.ok || !data.status) {
                return {
                    success: false,
                    message: data.message
                }
            }

            return {
                success: true,
                message: "Payment amount mismatch. Refund has been initiated"
            }
        };



        const order = await orderModel.create({
            userId: details.userId,
            items: details.items,
            totalAmount: details.totalAmount,
            deliveryfee: details.deliveryfee,
            paymentStatus: datadetails.status,
            status: "pending",
            deliveryAddress: {
                street: details.address,
                town: details.town,
                state: details.state
            },
            paymentReference: datadetails.reference,
            phoneNumber: details.phoneNumber
        })

        for (const item of details.items) {
            await productModel.findByIdAndUpdate(item.productId, {
                $inc: {
                    purchaseCount: item.quantity,
                    revenue: item.price * item.quantity
                }
            })
        }

        await userModel.findByIdAndUpdate(details.userId, {
            $inc: {
                amountSpent: details.totalAmount
            }
        })

        const admin = await userModel.findOne({
            role: 'admin'
        })

        if (admin) {
            const orderId = `#AK-${order._id.toString().slice(0, 8).toUpperCase()}`

            const message = {
                from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
                to: admin.email,
                subject: `New order ${orderId} has been placed`,
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                    <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                        Austin Kitchen
                    </h1>
                </div>

                <p style="font-size: 18px; margin-top: 25px;">
                    Hello,
                </p>

                <p style="font-size: 16px; line-height: 1.6;">
                    A new order has been successfully placed on
                    <strong>Austin Kitchen</strong>.
                </p>

                <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd;">

                    <p style="font-size: 14px; color: #888; margin: 0 0 8px; text-align: center;">
                        Order Id
                    </p>

                    <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px; color: #1F2933; text-align: center;">
                        ${orderId}
                    </p>

                    <p style="font-size: 22px; font-weight: bold; margin: 20px 0 0; color: #ED8F0C; text-align: center;">
                         New Order Placed
                    </p>

                </div>

                <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd;">

                    <p style="font-size: 15px; margin: 0 0 12px;">
                        <strong>Order total:</strong>
                        ₦${order.totalAmount.toLocaleString()}
                    </p>

                    <p style="font-size: 15px; margin: 0 0 12px;">
                        <strong>Payment status:</strong>
                        Successful
                    </p>

                    <p style="font-size: 15px; margin: 0 0 12px;">
                        <strong>Order status:</strong>
                        Pending
                    </p>

                    <p style="font-size: 15px; margin: 0;">
                        <strong>Payment reference:</strong>
                        ${order.paymentReference}
                    </p>

                </div>


                <div style="background-color: #ED8F0C; padding: 15px 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                    <p style="font-size: 16px; font-weight: bold; color: #ffffff; margin: 0;">
                        Please review the order in the admin dashboard.
                    </p>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #555;">
                    Please keep the order Id <strong>${orderId}</strong> for your records.
                </p>

                <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
                    <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
                        This is an automated order notification. Please do not reply to this message.
                    </p>

                    <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
                        © 2026 Austin Kitchen. All rights reserved.
                    </p>
                </div>

            </div>
        `
            }

            try {
                await transporter.sendMail(message)
            } catch (err) {
                console.log(err)
            }
        }


        await cartModel.findOneAndDelete({ userId: details.userId })
        revalidatePath('/admin-dashboard')
        revalidatePath('/admin-dashboard/orders')
        revalidatePath('/dashboard/order-history')

        return {
            _id: order._id.toString(),
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            status: order.status,
            success: true,
            message: "Order placed!"
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const orderHistory = async () => {
    try {
        await dbConnect();
        const { _id, success } = await auth();

        if (!success) {
            return {
                success: false,
                message: 'Login required'
            }
        }

        const user = await userModel.findById(_id);


        if (!user) {
            return {
                success: false,
                message: "Unauthorized user detected!"
            }
        }

        const order = await orderModel.find({ userId: _id }).sort({ createdAt: -1 });

        if (order.length === 0) return { success: true, orders: [] }

        const orders = order.map((item: any) => ({
            _id: item._id.toString(),
            userId: item.userId.toString(),
            items: item.items.map((i: any) => ({
                productId: i.productId.toString(),
                title: i.title,
                image: i.image,
                quantity: i.quantity,
                price: i.price
            })),
            totalAmount: item.totalAmount,
            createdAt: item.createdAt,
            status: item.status
        }))

        return {
            success: true,
            orders
        }


    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Something went wrong'
        }
    }
}

export const canOrd = async (id: string) => {
    try {
        await dbConnect();

        const { success, _id } = await auth();

        if (!success) return { success: false, message: "Login required" }

        const order = await orderModel.findById(id)

        if (!order) return { success: false, message: 'Order not found!' }

        if (order.userId.toString() !== _id?.toString()) return { success: false, message: "You're not allowed to cancel this order!" }

        if (order.status === "cancelled") {
            return {
                success: false,
                message: "Order has already been cancelled."
            }
        }

        if (order.status !== 'pending') return { success: false, message: 'This order has already been accepted and can no longer be cancelled.' }

        if (order.paymentStatus !== "success") {
            return {
                success: false,
                message: "This order does not have a successful payment to refund."
            };
        }

        if (!order.paymentReference) {
            return {
                success: false,
                message: "Payment reference is missing."
            };
        }

        const response = await fetch(
            "https://api.paystack.co/refund",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.LIVE_PAY_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    transaction: order.paymentReference
                })

            },
        );

        const data = await response.json();

        if (!response.ok || !data.status) return { success: false, message: data.message }

        for (const item of order.items) {
            await productModel.findByIdAndUpdate(item.productId, {
                $inc: {
                    revenue: -item.price * item.quantity,
                    purchaseCount: -item.quantity
                }
            })
        }

        await userModel.findByIdAndUpdate(_id, {
            $inc: {
                amountSpent: - order.totalAmount
            }
        })

        order.status = 'cancelled'
        order.paymentStatus = 'refunded'
        await order.save();

        const admin = await userModel.findOne({ role: 'admin' })

        if (admin) {
            const orderId = `#AK-${order._id.toString().slice(0, 8).toUpperCase()}`

            const message = {
                from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
                to: admin.email,
                subject: `Customer cancelled order ${orderId}`,
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                    <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                        Austin Kitchen
                    </h1>
                </div>

                <p style="font-size: 18px; margin-top: 25px;">
                    Hello,
                </p>

                <p style="font-size: 16px; line-height: 1.6;">
                    A customer has cancelled their
                    <strong>Austin Kitchen</strong> order.
                </p>

                <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd; text-align: center;">

                    <p style="font-size: 14px; color: #888; margin: 0 0 8px;">
                        Order Id
                    </p>

                    <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px; color: #1F2933;">
                        ${orderId}
                    </p>

                    <p style="font-size: 22px; font-weight: bold; margin: 20px 0 0; color: #C91737;">
                        ❌ Order Cancelled
                    </p>

                    <p style="font-size: 15px; color: #666; margin-top: 10px; line-height: 1.5;">
                        The customer cancelled this order before it was accepted.
                    </p>

                </div>

                <div style="background-color: #fff7ed; padding: 15px 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #fed7aa;">
                    <p style="font-size: 15px; font-weight: bold; color: #9a3412; margin: 0;">
                        Payment status: Refunded
                    </p>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #555;">
                    The customer's payment has been refunded and the order has been
                    marked as <strong>cancelled</strong> in the system.
                </p>

                <p style="font-size: 15px; line-height: 1.6; color: #555;">
                    Please keep the order Id <strong>${orderId}</strong>
                    for your records.
                </p>

                <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
                    <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
                        This is an automated order notification. Please do not reply to this message.
                    </p>

                    <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
                        © 2026 Austin Kitchen. All rights reserved.
                    </p>
                </div>

            </div>
        `
            }

            try {
                await transporter.sendMail(message)
            } catch (err) {
                console.log(err)
            }
        }

        revalidatePath(`/dashboard/order-history/${_id}`)
        revalidatePath('/dashboard')

        return { success: true, message: "Order cancelled successfully" }
    } catch (error) {
        console.log(error)
        return { success: false, message: 'Something went wrong' }
    }
}

export const receivedOrd = async (id: string) => {
    try {
        await dbConnect()
        const { success, _id } = await auth();


        if (!id) return { success: false, message: "Order ID not found" }

        if (!success) return { success: false, message: "Login Required" }

        const order = await orderModel.findOne({
            _id: id?.toString(),
            userId: _id?.toString()
        })

        if (!order) return { success: false, message: 'Order not found' }
        if (order.status === 'cancelled') return { success: false, message: "Order is cancelled" }
        if (order.status !== 'out-for-delivery') return { success: false, message: "Order is not out for delivery" }

        order.status = 'delivered'
        await order.save();

        const admin = await userModel.findOne({ role: 'admin' })

        if (admin) {
            const orderId = `#AK-${order._id.toString().slice(0, 8).toUpperCase()}`

            const message = {
                from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
                to: admin.email,
                subject: `Customer received order ${orderId}`,
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                    Austin Kitchen
                </h1>
            </div>

            <p style="font-size: 18px; margin-top: 25px;">
                Hello,
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
                The customer has confirmed that they received their
                <strong>Austin Kitchen</strong> order.
            </p>

            <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd; text-align: center;">

                <p style="font-size: 14px; color: #888; margin: 0 0 8px;">
                    Order Id
                </p>

                <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px; color: #1F2933;">
                    ${orderId}
                </p>

                <p style="font-size: 22px; font-weight: bold; margin: 20px 0 0; color: #15803d;">
                    ✅ Order Received
                </p>

                <p style="font-size: 15px; color: #666; margin-top: 10px; line-height: 1.5;">
                    The customer has marked this order as received.
                </p>

            </div>

            <div style="background-color: #f0fdf4; padding: 15px 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbf7d0;">
                <p style="font-size: 15px; font-weight: bold; color: #166534; margin: 0;">
                    Order status: Delivered
                </p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                The order is now marked as <strong>delivered</strong> in the Austin Kitchen system.
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                Please keep the order Id <strong>${orderId}</strong> for your records.
            </p>

            <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
                <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
                    This is an automated order notification. Please do not reply to this message.
                </p>

                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
                    © 2026 Austin Kitchen. All rights reserved.
                </p>
            </div>

        </div>
    `
            }

            try {
                await transporter.sendMail(message)
            } catch (err) {
                console.log(err)
            }
        }

        revalidatePath('/dashboard/order-history')
        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/order-history/${_id}`)

        return { success: true, message: "Order received" }

    } catch (error) {
        console.log(error);
        return { success: false, message: 'Something went wrong' }
    }
}

export const customers = async () => {
    try {
        await dbConnect();

        const { user, success } = await VerifyUser()

        if (!success) return { success: false, message: 'Login required' };

        if (user.role !== 'admin') return {
            customers: [],
            success: false,
            message: "You're not authorized!"
        }

        const users = await userModel.find({ role: 'user' }).sort({ _id: -1 }).select('_id amountSpent profilePic firstName lastName email')

        const cstMer = users.map((user) => ({
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            amountSpent: user.amountSpent,
            email: user.email,
            profilePic: user.profilePic
        }))

        return { success: true, cusTomers: cstMer }

    } catch (error) {
        console.log(error)
        return {
            customers: [],
            success: false,
            message: "Something went wrong"
        }
    }
}

export const allOrder = async () => {
    try {
        await dbConnect();

        const { success, user } = await VerifyUser()
        if (!success) return { success: false, message: "Login required" }

        if (user.role !== 'admin') return { success: false, message: " Only admin is allowed on this page", orders: [] }

        const allOrd = await orderModel.find().populate("userId", "lastName firstName").sort({ createdAt: -1 })

        const orders = allOrd.map((item) => ({
            _id: item._id.toString(),
            lastName: item.userId.lastName,
            firstName: item.userId.firstName,
            items: item.items.map((each: allOrdItem) => ({
                productId: each.productId.toString(),
                title: each.title,
                quantity: each.quantity
            })),
            totalAmount: item.totalAmount,
            paymentReference: item.paymentReference,
            status: item.status,
            createdAt: item.createdAt
        }))

        return {
            success: true, message: '', orders
        }
    } catch (error) {
        console.log(error)
        return { success: false, message: 'Something went wrong', orders: [] }
    }
}

export const admin_canOrd = async (_id: string) => {
    try {
        await dbConnect();
        const { user, success } = await VerifyUser()

        if (!success) return { success: false, message: "Login required" }
        if (user.role !== "admin") return { success: false, message: "You're not allowed!" }

        const order = await orderModel.findById(_id).populate('userId', 'email')

        if (!order) return { success: false, message: 'Order not found!' }

        if (order.status === "cancelled") {
            return {
                success: false,
                message: "Order has already been cancelled."
            }
        }

        if (order.status !== 'pending') return { success: false, message: 'This order has already been accepted and can no longer be cancelled.' }

        if (order.paymentStatus !== "success") {
            return {
                success: false,
                message: "This order does not have a successful payment to refund."
            };
        }

        if (!order.paymentReference) {
            return {
                success: false,
                message: "Payment reference is missing."
            };
        }

        const response = await fetch(
            "https://api.paystack.co/refund",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.LIVE_PAY_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    transaction: order.paymentReference
                })

            },
        );

        const data = await response.json();

        if (!response.ok || !data.status) return { success: false, message: data.message }

        for (const item of order.items) {
            await productModel.findByIdAndUpdate(item.productId, {
                $inc: {
                    revenue: -item.price * item.quantity,
                    purchaseCount: -item.quantity
                }
            })
        }

        await userModel.findByIdAndUpdate(order.userId, {
            $inc: {
                amountSpent: - order.totalAmount
            }
        })

        order.status = 'cancelled'
        order.paymentStatus = 'refunded'
        await order.save();

        const orderId = `#AK-${order._id.toString().slice(0, 8).toUpperCase()}`

        const message = {
            from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
            to: order.userId.email,
            subject: `Your Austin Kitchen order ${orderId} has been cancelled`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                    Austin Kitchen
                </h1>
            </div>

            <p style="font-size: 18px; margin-top: 25px;">
                Hello,
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
                We're sorry to let you know that your
                <strong>Austin Kitchen</strong> order has been
                <strong style="color: #C91737;">cancelled</strong>.
            </p>

            <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd; text-align: center;">

                <p style="font-size: 14px; color: #888; margin: 0 0 8px;">
                    Order Id
                </p>

                <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px; color: #1F2933;">
                    ${orderId}
                </p>

                <p style="font-size: 22px; font-weight: bold; margin: 20px 0 0; color: #C91737;">
                    Order Cancelled
                </p>

                <p style="font-size: 15px; color: #666; margin-top: 10px; line-height: 1.5;">
                    Your order could not be fulfilled and has been cancelled by Austin Kitchen.
                </p>

            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                Your payment has been <strong>refunded</strong>. The time it takes for the
                refunded amount to appear in your account may depend on your payment provider.
            </p>

            <div style="background-color: #fff7ed; padding: 15px 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #fed7aa;">
                <p style="font-size: 15px; font-weight: bold; color: #9a3412; margin: 0;">
                    Payment status: Refunded
                </p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                We apologize for the inconvenience. You can place another order any other time.
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                Please keep your order Id <strong>${orderId}</strong> for your records.
                If you have any questions about the cancellation or refund, provide this Id
                when contacting Austin Kitchen support.
            </p>

            <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
                <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
                    This is an automated order notification. Please do not reply to this message.
                </p>

                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
                    © 2026 Austin Kitchen. All rights reserved.
                </p>
            </div>

        </div>
    `,
        };

        try {
            await transporter.sendMail(message);
        } catch (err) {
            console.log(err);

            return {
                success: false,
                message: "Order was cancelled and refunded, but we couldn't send the notification email"
            };
        }

        revalidatePath('/admin-dashboard/orders')
        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/order-history/${_id}`)

        return { success: true, message: "Order cancelled successfully" }


    } catch (error) {
        console.log(error);
        return { success: false, message: "Something went wrong" }
    }
}

export const accept_order = async (_id: string) => {
    try {
        await dbConnect()

        if (!_id) return { success: false, message: "Order ID not found" }

        const { success, user } = await VerifyUser();
        if (!success) return { success: false, message: "Login required" }
        if (user.role !== "admin") return { success: false, message: "you're not allowed" }

        const order = await orderModel.findById(_id).populate("userId", 'email')
        if (!order) return { success: false, message: "Order not found" }

        if (order.status !== 'pending') return { success: false, message: 'This order can no longer be accepted.' }

        await orderModel.findByIdAndUpdate(_id, {
            status: 'confirmed'
        })


        const orderId = `#AK-${order._id.toString().slice(0, 8).toUpperCase()}`


        const message = {
            from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
            to: order.userId.email,
            subject: `Your Austin Kitchen order ${orderId} has been confirmed`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                    Austin Kitchen
                </h1>
            </div>

            <p style="font-size: 18px; margin-top: 25px;">
                Hello,
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
                Great news! Your <strong>Austin Kitchen</strong> order has been
                <strong>accepted and confirmed</strong>.
            </p>

            <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd; text-align: center;">

                <p style="font-size: 14px; color: #888; margin: 0 0 8px;">
                    Order Id
                </p>

                <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px; color: #1F2933;">
                    ${orderId}
                </p>

                <p style="font-size: 22px; font-weight: bold; margin: 20px 0 0; color: #1F2933;">
                    ✅ Order Confirmed
                </p>

                <p style="font-size: 15px; color: #666; margin-top: 10px; line-height: 1.5;">
                    We've accepted your order and will keep you updated as it moves through the delivery process.
                </p>

            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                You will receive another notification when your order is out for delivery.
            </p>

            <div style="background-color: #ED8F0C; padding: 15px 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="font-size: 16px; font-weight: bold; color: #ffffff; margin: 0;">
                    Thank you for ordering from Austin Kitchen!
                </p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                Please keep your order Id <strong>${orderId}</strong> for your records.
                If you have any questions about your order, provide this Id when contacting Austin Kitchen support.
            </p>

            <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
                <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
                    This is an automated order notification. Please do not reply to this message.
                </p>

                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
                    © 2026 Austin Kitchen. All rights reserved.
                </p>
            </div>

        </div>
    `
        }

        try {
            await transporter.sendMail(message)
        } catch (err) {
            console.log(err)

            return {
                success: false,
                message: "Order was accepted, but we couldn't send the notification email"
            }
        }

        revalidatePath('/admin-dashboard/orders')
        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/order-history/${_id}`)
        return { success: true, message: "Order accepted" }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const startpre_paring = async (_id: string) => {
    try {
        await dbConnect()

        if (!_id) return { success: false, message: "Order ID not found" }

        const { success, user } = await VerifyUser();
        if (!success) return { success: false, message: "Login required" }
        if (user.role !== "admin") return { success: false, message: "you're not allowed" }

        const order = await orderModel.findById(_id)
        if (!order) return { success: false, message: "Order not found" }

        if (order.status !== 'confirmed') return { success: false, message: "Order has not beeen accepted." }


        await orderModel.findByIdAndUpdate(_id, {
            status: 'preparing'
        })

        revalidatePath('/admin-dashboard/orders')
        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/order-history/${_id}`)
        return { success: true, message: "Order preparing" }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const mark_ready = async (_id: string) => {
    try {
        await dbConnect()

        if (!_id) return { success: false, message: "Order ID not found" }

        const { success, user } = await VerifyUser();
        if (!success) return { success: false, message: "Login required" }
        if (user.role !== "admin") return { success: false, message: "you're not allowed" }

        const order = await orderModel.findById(_id)
        if (!order) return { success: false, message: "Order not found" }

        if (order.status !== 'preparing') return { success: false, message: "Order is not currently being prepared." }


        await orderModel.findByIdAndUpdate(_id, {
            status: 'ready'
        })

        revalidatePath('/admin-dashboard/orders')
        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/order-history/${_id}`)
        return { success: true, message: "Order is ready" }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const mark_ofd = async (_id: string) => {
    try {
        await dbConnect()

        if (!_id) return { success: false, message: "Order ID not found" }

        const { success, user } = await VerifyUser();
        if (!success) return { success: false, message: "Login required" }
        if (user.role !== "admin") return { success: false, message: "you're not allowed" }

        const order = await orderModel.findById(_id).populate('userId', 'email')
        if (!order) return { success: false, message: "Order not found" }

        if (order.status !== 'ready') return { success: false, message: "This order is not yet ready." }


        await orderModel.findByIdAndUpdate(_id, {
            status: 'out-for-delivery'
        })

        const orderId = `#AK-${order._id.toString().slice(0, 8).toUpperCase()}`

        const message = {
            from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
            to: order.userId.email,
            subject: `Your Austin Kitchen order ${orderId} is out for delivery`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                    Austin Kitchen
                </h1>
            </div>

            <p style="font-size: 18px; margin-top: 25px;">
                Hello,
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
                Great news! Your <strong>Austin Kitchen</strong> order is now
                <strong>out for delivery</strong>.
            </p>

            <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd;">

                <p style="font-size: 14px; color: #888; margin: 0 0 8px; text-align: center;">
                    Order Id
                </p>

                <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px; color: #1F2933; text-align: center;">
                    ${orderId}
                </p>

                <p style="font-size: 22px; font-weight: bold; margin: 20px 0 0; color: #1F2933; text-align: center;">
                    🚴 Your order is on the way!
                </p>

                <p style="font-size: 15px; color: #666; margin-top: 10px; line-height: 1.5; text-align: center;">
                    Please keep an eye out for your delivery.
                </p>

            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                Once your order arrives, open your Austin Kitchen order page and click
                <strong>"I've received it"</strong> to confirm that your order has been delivered.
            </p>

            <div style="background-color: #ED8F0C; padding: 15px 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="font-size: 16px; font-weight: bold; color: #ffffff; margin: 0;">
                    Click "I've received it" after your order arrives
                </p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #555;">
                Please keep this order Id <strong>${orderId}</strong> for your records.
                If you have any issues with your delivery, you can provide this Id when contacting Austin Kitchen support.
            </p>

            <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
                <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
                    This is an automated order notification. Please do not reply to this message.
                </p>

                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
                    © 2026 Austin Kitchen. All rights reserved.
                </p>
            </div>

        </div>
    `,
        };

        try {
            await transporter.sendMail(message);
        } catch (err) {
            console.log(err);

            return {
                success: false,
                message: "Order was marked out for delivery, but we couldn't send the notification email"
            };
        }

        revalidatePath('/admin-dashboard/orders')
        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/order-history/${_id}`)
        return { success: true, message: "Order is out for delivery" }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const mark_delivered = async (_id: string) => {
    try {
        await dbConnect()

        if (!_id) return { success: false, message: "Order ID not found" }

        const { success, user } = await VerifyUser();
        if (!success) return { success: false, message: "Login required" }
        if (user.role !== "admin") return { success: false, message: "you're not allowed" }

        const order = await orderModel.findById(_id)
        if (!order) return { success: false, message: "Order not found" }

        if (order.status !== 'out-for-delivery') return { success: false, message: "This order is not out for delivery yet." }


        await orderModel.findByIdAndUpdate(_id, {
            status: 'delivered'
        })

        revalidatePath('/admin-dashboard/orders')
        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/order-history/${_id}`)
        return { success: true, message: "Order Delivered" }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const userProfile = async () => {
    try {
        await dbConnect();
        const { success, user } = await VerifyUser()
        if (!success) return { success: false, message: "Login required", uSer: null }

        const uSer = {
            _id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic,
            phoneNumber: user.phoneNumber,
            amountSpent: user.amountSpent
        }

        return {
            success: true,
            uSer,
            message: ''
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong",
            uSer: null
        }
    }
}

export const editProfile = async (data: {
    firstName: string,
    lastName: string,
    email: string,
    profilePic: string,
    phoneNumber: string,
    _id: string
}) => {
    try {
        await dbConnect();

        const { success, _id } = await auth()

        data.firstName = data.firstName.toLowerCase().trim()
        data.lastName = data.lastName.toLowerCase().trim()

        if (!success) return { success: false, message: "Login required" }
        if (!data._id.trim()) return { success: false, message: 'Id not found' }
        if (_id!.toString() !== data._id) return { success: false, message: 'Unauthorized user detected!' }

        if (!data.firstName || !data.lastName || !data.email) return { success: false, message: "All fields are required" }

        const user = await userModel.findOne({
            _id,
            email: data.email.toLowerCase().trim()
        })

        if (!user) return { success: false, message: 'User not found' }

        if (data.profilePic && data.profilePic.startsWith("data:image")) {
            const Image = await cloudinary.uploader.upload(data.profilePic, {
                folder: 'austinskitchen',
                transformation: [
                    { width: 500, height: 500, crop: 'fill' }
                ]
            })

            data.profilePic = Image?.secure_url
        }

        user.firstName = data.firstName
        user.lastName = data.lastName
        user.phoneNumber = data.phoneNumber
        user.profilePic = data.profilePic

        await user.save()

        revalidatePath('/dashboard/profile')

        return { success: true, message: 'Profile updated' }

    } catch (error) {
        console.log(error)
        return { success: false, message: 'Something went wrong' }
    }
}


export const delProfilePic = async (id: string) => {
    try {
        await dbConnect();

        const { success, _id } = await auth()

        if (!success) return { success: false, message: "Login required" }

        if (!id.trim()) return { success: false, message: 'ID not found' }

        if (_id?.toString().trim() !== id.trim()) return { success: false, message: 'Unauthorized user detected!' }

        const user = await userModel.findById(_id)

        if (!user) return { success: false, message: "Account not found" }

        user.profilePic = ''

        await user.save()

        revalidatePath('/dashboard/profile')
        return { success: true, message: "Profile picture deleted" }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const change_email = async (data: {
    newEmail: string,
    _id: string
}) => {
    try {
        await dbConnect()

        const newEmail = data.newEmail.trim().toLowerCase()

        const { _id, success } = await auth()
        if (!success) return { success: false, message: "Login required" }
        if (!data._id.trim()) return { success: false, message: "ID not found" }
        if (!newEmail) return { success: false, message: "New Email required" }

        if (_id?.toString() !== data._id) return { success: false, message: 'Unauthorized user detected' }

        const existingUser = await userModel.findOne({
            email: newEmail
        })

        if (existingUser) return {
            success: false,
            message: "This email is already associated with another account"
        }

        const existing = await verifyOtpModel.findOne({
            userId: _id.toString(),
            newEmail: newEmail
        })

        if (existing) {
            return { success: false, message: "A verification code was already sent. Please check your email or try again in 10 minutes." }
        }

        const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        const hashedOtp = await bcrypt.hash(OTP.trim(), 10)

        const newOtp = await verifyOtpModel.create({
            newEmail,
            userId: _id.toString(),
            otp: hashedOtp,
            type: 'email-change'
        })

        const message = {
            from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
            to: newOtp.newEmail,
            subject: "Email Change Verification Code",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
      <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
        Austin Kitchen
      </h1>
    </div>

    <p style="font-size: 18px; margin-top: 25px;">
      Hello,
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      We received a request to change the email address associated with your
      <strong>Austin Kitchen</strong> account.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      To verify your new email address and continue with the change, enter the
      verification code below:
    </p>

    <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd; text-align: center;">
      <p style="font-size: 30px; font-weight: bold; margin: 0; letter-spacing: 6px; color: #1F2933;">
        ${OTP}
      </p>
    </div>

    <p style="font-size: 15px; line-height: 1.6; color: #555;">
      This verification code will expire in <strong>10 minutes</strong>.
      For your security, do not share this code with anyone.
    </p>

    <p style="font-size: 15px; line-height: 1.6; color: #555;">
      If you did not request to change your email address, you can safely
      ignore this message. Your account email will not be changed without
      verification.
    </p>

    <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
      <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
        This is an automated security email. Please do not reply to this message.
      </p>

      <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
        © 2026 Austin Kitchen. All rights reserved.
      </p>
    </div>

  </div>
`,
        };

        try {
            await transporter.sendMail(message);

        } catch (err) {
            console.log(err);
            await newOtp.deleteOne()
            return { success: false, message: "Failed to send OTP email" };
        }

        return { success: true, message: 'Verification code sent to your new email address' }


    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const verify_emailotp = async (data: {
    _id: string,
    newEmail: string,
    otp: string
}) => {
    try {
        await dbConnect()
        const { success, _id } = await auth();
        if (!success) return { success: false, message: "Login required" }

        const newEmail = data.newEmail.toLowerCase().trim();
        if (!newEmail) return { success: false, message: 'Email address required' }
        if (!data._id.trim()) return { success: false, message: 'User ID not found' }
        if (!data.otp.trim()) return { success: false, message: 'Verification code required' }
        if (_id?.toString() !== data._id) return { success: false, message: 'Unauthorized user detected!' }

        const existingUser = await userModel.findOne({
            email: newEmail
        })

        if (existingUser) return {
            success: false,
            message: "This email is already associated with another account"
        }

        const otp = await verifyOtpModel.findOne({
            userId: _id.toString(),
            newEmail,
            type: 'email-change'
        })

        if (!otp) return { success: false, message: 'Verification code not found or expired. Please request a new code.' }

        const compareOtp = await bcrypt.compare(data.otp.trim(), otp.otp)

        if (!compareOtp) return { success: false, message: 'Invalid verification code. Please check the code and try again.' }

        const user = await userModel.findById(_id)

        if (!user) return { success: false, message: "User not found" }

        user.email = newEmail
        await user.save()

        await otp.deleteOne()

        return { success: true, message: "Your email address has been successfully updated" }

    } catch (error) {
        console.log(error)
        return { success: false, message: 'Something went wrong' }
    }
}


export const change_password = async (data: {
    _id: string
    password: string,
    newPassword: string,
    conNewpassword: string
}) => {
    try {
        await dbConnect()
        const { success, _id } = await auth()
        if (!success) return { success: false, message: 'Login required' }
        if (!data.password || !data.newPassword || !data.conNewpassword) return { success: false, message: 'All fields are required' }
        if (data.newPassword.length <= 7) return { success: false, message: 'Password must be at least 8 characters' }
        if (data.newPassword !== data.conNewpassword) return { success: false, message: "Passwords mismatch" }
        if (!data._id.trim()) return { success: false, message: 'User ID not found' }

        if (_id?.toString().trim() !== data._id.trim()) return { success: false, message: "Unauthorized user detected!" }

        const user = await userModel.findById(_id.toString())

        if (!user) return { success: false, message: "User account not found" }

        const isMatch = await bcrypt.compare(data.password, user.password)

        if (!isMatch) return { success: false, message: 'Incorrect current password ' }

        const isCurrent = await bcrypt.compare(data.newPassword, user.password)

        if (isCurrent) return { success: false, message: 'You cannot use current password' }

        const hashed = await bcrypt.hash(data.newPassword, 10)

        user.password = hashed

        await user.save()

        const message = {
            from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
            to: user.email,
            subject: "Your Austin Kitchen password was changed",
            html: `
            < div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;" >

                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                    <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                    Austin Kitchen
                    </ h1 >
                </div>

                < p style = "font-size: 18px; margin-top: 25px;" >
                Hello,
                </p>

                < p style = "font-size: 16px; line-height: 1.6;" >
                    Your < strong > Austin Kitchen </strong> account password has been successfully changed.
                </p>

                < div style = "background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd; text-align: center;" >
                    <p style="font-size: 18px; font-weight: bold; margin: 0; color: #1F2933;" >
                        Password successfully changed
                     </p>

                </div>

                < p style = "font-size: 15px; line-height: 1.6; color: #555;" >
                        You can now use your new password the next time you sign in to your account.
                </p>

                < p style = "font-size: 15px; line-height: 1.6; color: #555;" >
                 If you did not make this change, please secure your account immediately by contacting
                Austin Kitchen support.
                </p>

            < div style = "border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;" >
                <p style="font-size: 13px; color: #888; text-align: center; margin: 0;" >
                    This is an automated security email.Please do not reply to this message.
                </p>

                < p style = "font-size: 13px; color: #888; text-align: center; margin-top: 10px;" >
                    © 2026 Austin Kitchen.All rights reserved.
                 </p>
            </div>

            </div>
            `,

        };

        try {
            await transporter.sendMail(message);

        } catch (err) {
            console.log(err);
        }

        return { success: true, message: "Your password has been successfully updated" }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const del_account = async (id: string) => {
    try {
        await dbConnect();

        const { success, _id } = await auth();
        if (!success) return { success: false, message: 'Login required' }
        if (!id.trim()) return { success: false, message: 'ID not found' }
        if (_id?.toString().trim() !== id.trim()) return { success: false, message: "Unauthorized user detected!" }

        const user = await userModel.findById(_id)
        if (!user) return { success: false, message: 'User not found' }


        await savedProductModel.deleteMany({ userId: _id })
        await cartModel.findOneAndDelete({ userId: _id.toString() })

        user.firstName = 'isAlreadyDeleted'
        user.lastName = 'user'
        user.email = `deleted_${_id.toString().slice(0, 10)}@deleted.local`
        user.profilePic = ''
        user.password = '0 000 00 000'
        user.phoneNumber = ''

        await user.save()

        const cookieStore = await cookies();
        cookieStore.delete("token")

        return {
            success: true,
            message: `Account deleted`
        }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const admin_profile = async () => {
    try {
        await dbConnect()
        const { success, _id } = await auth();

        if (!success) return { success: false, message: "Login required", user: null }

        if (!_id) return { success: false, message: 'ID not found', user: null }

        const admin = await userModel.findById(
            _id
        )

        if (!admin) return { success: false, message: "Account not found", user: null }

        if (admin.role !== 'admin') return { success: false, message: "You're not allowed!", user: null }

        const user = {
            _id: admin._id.toString(),
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role,
            profilePic: admin.profilePic,
            phoneNumber: admin.phoneNumber
        }
        return {
            success: true,
            message: '',
            user
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong",
            user: null
        }
    }
}

export const editAdmin_Profile = async (data: {
    _id: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    profilePic: string
}) => {
    try {
        await dbConnect();
        const { success, _id } = await auth();

        data.firstName = data.firstName.toLowerCase().trim()
        data.lastName = data.lastName.toLowerCase().trim()

        if (!success) return { success: false, message: "Login required" }
        if (!data._id) return { success: false, message: 'ID not found' }
        if (_id!.toString() !== data._id) return { success: false, message: 'Unauthorized user detected!' }
        if (!data.firstName || !data.lastName) return { success: false, message: "First name and last name are required" }

        if (data.profilePic && data.profilePic.startsWith('data:image')) {
            const Image = await cloudinary.uploader.upload(data.profilePic, {
                folder: 'austinskitchen',
                transformation: [
                    { width: 500, height: 500, crop: 'fill' }
                ]
            })

            data.profilePic = Image?.secure_url
        }

        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: 'Unauthorized user detected!' }

        admin.firstName = data.firstName
        admin.lastName = data.lastName
        admin.profilePic = data.profilePic
        admin.phoneNumber = data.phoneNumber

        await admin.save()

        return {
            success: true,
            message: 'Profile updated'
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Somethimg went wrong"
        }
    }
}

export const deladmin_ProfilePic = async (id: string) => {
    try {
        await dbConnect();

        const { success, _id } = await auth()

        if (!success) return { success: false, message: "Login required" }

        if (!id.trim()) return { success: false, message: 'ID not found' }

        if (_id?.toString().trim() !== id.trim()) return { success: false, message: 'Unauthorized user detected!' }

        const admin = await userModel.findOne({ _id, role: 'admin' })

        if (!admin) return { success: false, message: "Account not found" }

        admin.profilePic = ''

        await admin.save()

        return { success: true, message: "Profile picture deleted" }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const changeadmin_Password = async (data: {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}) => {
    try {
        await dbConnect();

        const { _id, success } = await auth()
        if (!success) return { success: false, message: 'Login required' }
        if (!data.currentPassword) return { success: false, message: "Password required" }
        if (!data.newPassword) return { success: false, message: "New password required" }
        if (data.newPassword.length <= 7) return { success: false, message: "Password must be at least 8 characters" }
        if (!data.confirmPassword) return { success: false, message: "Confirm password required" }
        if (data.newPassword !== data.confirmPassword) return { success: false, message: "Password mismatch" }


        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: "Account not found" }


        const isCurrent = await bcrypt.compare(data.currentPassword, admin.password)
        if (!isCurrent) return { success: false, message: 'Incorrect current password' }

        const isPassword = await bcrypt.compare(data.newPassword, admin.password)
        if (isPassword) return { success: false, message: "New password can not be the same as your current password" }

        const hashesPassword = await bcrypt.hash(data.newPassword, 10)

        admin.password = hashesPassword

        await admin.save();

        const message = {
            from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
            to: admin.email,
            subject: "Your Austin Kitchen password was changed",
            html: `
            < div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;" >

                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                    <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                    Austin Kitchen
                    </ h1 >
                </div>

                < p style = "font-size: 18px; margin-top: 25px;" >
                Hello,
                </p>

                < p style = "font-size: 16px; line-height: 1.6;" >
                    Your < strong > Austin Kitchen </strong> account password has been successfully changed.
                </p>

                < div style = "background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd; text-align: center;" >
                    <p style="font-size: 18px; font-weight: bold; margin: 0; color: #1F2933;" >
                        Password successfully changed
                     </p>

                </div>

                < p style = "font-size: 15px; line-height: 1.6; color: #555;" >
                        You can now use your new password the next time you sign in to your account.
                </p>

                < p style = "font-size: 15px; line-height: 1.6; color: #555;" >
                 If you did not make this change, please secure your account immediately by contacting
                Austin Kitchen support.
                </p>

            < div style = "border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;" >
                <p style="font-size: 13px; color: #888; text-align: center; margin: 0;" >
                    This is an automated security email.Please do not reply to this message.
                </p>

                < p style = "font-size: 13px; color: #888; text-align: center; margin-top: 10px;" >
                    © 2026 Austin Kitchen.All rights reserved.
                 </p>
            </div>

            </div>
            `,

        };

        try {
            await transporter.sendMail(message);

        } catch (err) {
            console.log(err);
        }

        return {
            success: true,
            message: 'Password updated'
        }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const changeAdmin_email = async (newEmail: string) => {
    try {
        await dbConnect()

        newEmail = newEmail.trim().toLowerCase()

        const { _id, success } = await auth()
        if (!success) return { success: false, message: "Login required" }
        if (!newEmail) return { success: false, message: "New Email required" }

        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: "you're not allowed" }

        const existingUser = await userModel.findOne({
            email: newEmail
        })

        if (existingUser) return {
            success: false,
            message: "This email is already associated with another account"
        }

        const existing = await verifyOtpModel.findOne({
            userId: _id!.toString(),
            newEmail: newEmail,
            type: 'email-change'
        })

        if (existing) {
            return { success: false, message: "A verification code was already sent. Please check your email or try again in 10 minutes." }
        }

        const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        const hashedOtp = await bcrypt.hash(OTP.trim(), 10)

        const newOtp = await verifyOtpModel.create({
            newEmail,
            userId: _id!.toString(),
            otp: hashedOtp,
            type: 'email-change'
        })

        const message = {
            from: `"Austin Kitchen" <${process.env.NODE_MAIL}>`,
            to: newOtp.newEmail,
            subject: "Email Change Verification Code",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
      <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
        Austin Kitchen
      </h1>
    </div>

    <p style="font-size: 18px; margin-top: 25px;">
      Hello,
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      We received a request to change the email address associated with your
      <strong>Austin Kitchen</strong> account.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      To verify your new email address and continue with the change, enter the
      verification code below:
    </p>

    <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd; text-align: center;">
      <p style="font-size: 30px; font-weight: bold; margin: 0; letter-spacing: 6px; color: #1F2933;">
        ${OTP}
      </p>
    </div>

    <p style="font-size: 15px; line-height: 1.6; color: #555;">
      This verification code will expire in <strong>10 minutes</strong>.
      For your security, do not share this code with anyone.
    </p>

    <p style="font-size: 15px; line-height: 1.6; color: #555;">
      If you did not request to change your email address, you can safely
      ignore this message. Your account email will not be changed without
      verification.
    </p>

    <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
      <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
        This is an automated security email. Please do not reply to this message.
      </p>

      <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
        © 2026 Austin Kitchen. All rights reserved.
      </p>
    </div>

  </div>
`,
        };

        try {
            await transporter.sendMail(message);

        } catch (err) {
            console.log(err);
            await newOtp.deleteOne()
            return { success: false, message: "Failed to send OTP email" };
        }

        return { success: true, message: 'Verification code sent to your new email address' }


    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const verifyAdmin_otp = async (data: { newEmail: string, otp: string }) => {
    try {
        await dbConnect();

        const newEmail = data.newEmail.toLowerCase().trim()
        if (!newEmail) return { success: false, message: 'New email is required' }
        if (!data.otp) return { success: false, message: 'Verification code required' }

        const { success, _id } = await auth()

        if (!success) return { success: false, message: "Login required" }

        const existingUser = await userModel.findOne({
            email: newEmail
        })

        if (existingUser) return {
            success: false,
            message: "This email is already associated with another account"
        }

        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: "you're not allowed" }


        const otp = await verifyOtpModel.findOne({
            userId: _id!.toString(),
            newEmail,
            type: 'email-change'
        })

        if (!otp) return { success: false, message: 'Verification code not found or expired. Please request a new code.' }

        const compareOtp = await bcrypt.compare(data.otp, otp.otp)
        if (!compareOtp) return { success: false, message: 'Invalid verification code' }

        admin.email = newEmail

        await admin.save()
        await otp.deleteOne()

        return {
            success: true,
            message: 'Email address updated'
        }


    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}


export const deleteAdmin_account = async () => {
    try {
        await dbConnect();
        const { success, _id } = await auth()

        if (!success) return { success: false, message: 'Login required' }

        const adminS = await userModel.find({
            role: 'admin'
        })

        if (adminS.length < 2) return { success: false, message: "You’re the only admin. You cannot delete your account." }

        const admin = await userModel.findOne({
            _id
        })

        if (!admin) return { success: false, message: "Account not found" }
        if (admin.role !== 'admin') return { success: false, message: "You're not allowed" }


        admin.firstName = 'isAlreadyDeleted'
        admin.lastName = 'admin'
        admin.email = `deleted_${_id!.toString().slice(0, 10)}@deleted.local`
        admin.profilePic = ''
        admin.password = '00 000 0000'
        admin.phoneNumber = ''
        admin.role = 'user'

        await admin.save()

        const cookieStore = await cookies()

        cookieStore.delete('token')

        return { success: true, message: "Admin account deleted" }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const fetchLandingImages = async () => {
    try {
        await dbConnect()

        const { success, _id } = await auth()
        if (!success) return { success: false, message: "Login required", iMages: null }

        const imgs = await landingImageModel.findOne()

        if (!imgs) {
            return {
                success: false,
                message: "Landing image record not found",
                iMages: null
            }
        }

        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: "Admin account not found" }

        const iMages = {
            mainLanding: {
                image: imgs.mainLanding.image || ''
            },
            productDisplay: imgs.productDisplay.map((product: { _id: ObjectId, title: string, image: string }) => ({
                _id: product._id.toString(),
                title: product.title,
                image: product.image
            })),
            whyPeopleDisplay: {
                image: imgs.whyPeopleDisplay.image || ''
            },
            bottomLanding: {
                image: imgs.bottomLanding.image || ''
            }
        }

        return {
            success: true,
            message: '',
            iMages
        }
    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong", iMages: null }
    }
}

export const addMainlandingImg = async (image: string) => {
    try {
        await dbConnect();
        const { _id, success } = await auth()
        if (!success) return { success: false, message: "Login required" }
        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: 'Admin account not found' }

        const landIngImg = await landingImageModel.findOne()

        if (!landIngImg) {
            return {
                success: false,
                message: "Landing image record not found"
            }
        }

        if (landIngImg?.mainLanding.image) return {
            success: false,
            message: 'Main landing image already exist'
        }

        if (!image) return { success: false, message: "No image selected" }

        const Image = await cloudinary.uploader.upload(image, {
            folder: 'austinskitchen'
        })

        image = Image?.secure_url


        landIngImg.mainLanding.image = image
        landIngImg.mainLanding.publicId = Image?.public_id

        await landIngImg.save()

        revalidatePath('/')
        return { success: true, message: "Main landing image added" }
    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const deleteMainLandingImg = async () => {
    try {
        await dbConnect();
        const { success, _id } = await auth();

        if (!success) return { success: false, message: "Login required" }

        const admin = await userModel.findOne({ _id, role: 'admin' })

        if (!admin) return { success: false, message: "Admin account not found" }

        const imgs = await landingImageModel.findOne()

        if (!imgs) {
            return {
                success: false,
                message: "Landing image record not found"
            }
        }

        if (!imgs.mainLanding.image) {
            return {
                success: false,
                message: "Main landing picture not available"
            }
        }

        const publicId = imgs.mainLanding.publicId

        imgs.mainLanding.image = ''

        await cloudinary.uploader.destroy(publicId)

        await imgs.save()
        revalidatePath('/')
        return { success: true, message: "Main landing picture deleted" }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

export const addDisplayProduct = async (data: { image: string, title: string }) => {
    try {
        await dbConnect();

        const { success, _id } = await auth();
        if (!success) return { success: false, message: "Login required" }

        const admin = await userModel.findById(_id)

        if (!admin) return { success: false, message: "Admin account not found" }

        if (admin.role !== 'admin') return { success: false, message: "You're not allowed" }
        if (!data.image) return { success: false, message: "No image selected" }
        if (!data.title.trim()) return { success: false, message: "Product title is required" }
        const landingimages = await landingImageModel.findOne()

        if (!landingimages) {
            return {
                success: false,
                message: "Landing image record not found"
            }
        }

        if (landingimages.productDisplay.length >= 4) return { success: false, message: 'You can only add 4 display product' }

        const uploadedImg = await cloudinary.uploader.upload(data.image, {
            folder: 'austinskitchen',
            background_removal: 'cloudinary_ai:fine_edges',
            format: 'png'
        })

        console.log(uploadedImg)
        const image = uploadedImg?.secure_url
        const publicId = uploadedImg?.public_id



        landingimages.productDisplay.push({ image, title: data.title.trim(), publicId })
        await landingimages.save()
        revalidatePath('/')
        return { success: true, message: "Display product added" }
    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const deletedisplayPic = async (id: string) => {
    try {
        await dbConnect();

        const { success, _id } = await auth();

        if (!success) return { success: false, message: 'Login required' }

        if (!id) return { success: false, message: 'ID not found' };

        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: 'Admin account not found' }

        const landingImages = await landingImageModel.findOne()

        if (!landingImages) {
            return {
                success: false,
                message: "Landing image record not found"
            }
        }
        const deleteImage = landingImages.productDisplay.find(
            (dis: { _id: string, image: string, title: string, publicId: string }) => dis._id.toString() == id.toString()
        )

        if (!deleteImage) return { success: false, message: 'Image not found' }

        if (!deleteImage.publicId) return { success: false, message: 'Image public Id not found' }

        landingImages.productDisplay = landingImages.productDisplay.filter(
            (dis: { _id: string, image: string, title: string }) => dis._id.toString() !== id.toString()
        )


        await cloudinary.uploader.destroy(deleteImage.publicId)

        await landingImages.save()
        revalidatePath('/')
        return { success: true, message: "Display image deleted" }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const whyPeoplePic = async (image: string) => {
    try {
        await dbConnect();
        const { success, _id } = await auth();

        if (!success) return { success: false, message: 'Login required' }
        if (!image) return { success: false, message: "No image selected" }

        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: "Admin account not found" }

        const landingImages = await landingImageModel.findOne()

        if (!landingImages) return { success: false, message: "Landing image record not found" }

        if (landingImages.whyPeopleDisplay.image) return { success: false, message: "One image is already added" }

        const uploadedImg = await cloudinary.uploader.upload(image, {
            folder: 'austinkitchen'
        })

        landingImages.whyPeopleDisplay.image = uploadedImg?.secure_url
        landingImages.whyPeopleDisplay.publicId = uploadedImg?.public_id

        await landingImages.save()

        revalidatePath('/')
        return { success: true, message: "Why people love us image added" }
    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const deletewhypeople = async () => {
    try {
        await dbConnect();
        const { success, _id } = await auth();

        if (!success) return { success: false, message: "Login required" };

        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: "Admin account not found" }

        const landingImages = await landingImageModel.findOne()

        if (!landingImages) return { success: false, message: 'Landing image record not found' }
        if (!landingImages.whyPeopleDisplay.image) return { success: false, message: 'Image not found or has been deleted' }
        if (!landingImages.whyPeopleDisplay.publicId) return { success: false, message: 'Image not found or has been deleted' }

        const public_id = landingImages.whyPeopleDisplay.publicId
        landingImages.whyPeopleDisplay.image = ''
        landingImages.whyPeopleDisplay.publicId = ''

        await cloudinary.uploader.destroy(public_id)

        await landingImages.save()

        revalidatePath('/')

        return { success: true, message: "Why people love use image deleted" }
    } catch (error) {
        console.log(error)
        return { success: false, mesage: 'Something went wrong' }
    }
}

export const addbottomPic = async (image: string) => {
    try {
        await dbConnect();
        const { success, _id } = await auth();

        if (!success) return { success: false, message: 'Login required' }
        if (!image) return { success: false, message: "No image selected" }

        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: "Admin account not found" }

        const landingImages = await landingImageModel.findOne()

        if (!landingImages) return { success: false, message: "Landing image record not found" }

        if (landingImages.bottomLanding.image) return { success: false, message: "One image is already added" }

        const uploadedImg = await cloudinary.uploader.upload(image, {
            folder: 'austinkitchen'
        })

        landingImages.bottomLanding.image = uploadedImg?.secure_url
        landingImages.bottomLanding.publicId = uploadedImg?.public_id

        await landingImages.save()

        revalidatePath('/')
        return { success: true, message: "Bottom landing image added" }
    } catch (error) {
        console.log(error)
        return { success: false, message: "Something went wrong" }
    }
}

export const deletebottompic = async () => {
    try {
        await dbConnect();
        const { success, _id } = await auth();

        if (!success) return { success: false, message: "Login required" };

        const admin = await userModel.findOne({
            _id,
            role: 'admin'
        })

        if (!admin) return { success: false, message: "Admin account not found" }

        const landingImages = await landingImageModel.findOne()

        if (!landingImages) return { success: false, message: 'Landing image record not found' }
        if (!landingImages.bottomLanding.image) return { success: false, message: 'Image not found or has been deleted' }
        if (!landingImages.bottomLanding.publicId) return { success: false, message: 'Image not found or has been deleted' }

        const public_id = landingImages.bottomLanding.publicId
        landingImages.bottomLanding.image = ''
        landingImages.bottomLanding.publicId = ''

        await cloudinary.uploader.destroy(public_id)

        await landingImages.save()

        revalidatePath('/')

        return { success: true, message: "Bottom landing image deleted" }
    } catch (error) {
        console.log(error)
        return { success: false, mesage: 'Something went wrong' }
    }
}

export const contactUs = async (data: {
    firstName: string,
    lastName: string,
    email: string,
    subject: string,
    message: string
}) => {
    try {
        await dbConnect();

        data.email = data.email.toLowerCase().trim()

        if (!data.email || !data.firstName.trim() || !data.lastName.trim() || !data.subject.trim() || !data.message.trim()) return { success: false, message: 'All fields are required' }

        const admin = await userModel.findOne({
            role: 'admin'
        })

        if (!admin) return { success: false, message: 'For some reasons, admin currently can not be reached' }

        const message = {
            from: `"${data.firstName} ${data.lastName}" <${data.email}>`,
            to: admin.email,
            subject: data.subject,
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5; color: #333;">

        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
            <h1 style="margin: 0; font-size: 28px; color: #ED8F0C;">
                Austin Kitchen
            </h1>
            <p style="margin: 8px 0 0; color: #777;">
                Contact Us Message
            </p>
        </div>

        <p style="font-size: 18px; margin-top: 25px;">
            Hello Admin,
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
            You have received a new message from the Austin Kitchen contact form.
        </p>

        <div style="background-color: #ffffff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #ddd;">

            <p style="font-size: 15px; margin: 0 0 12px;">
                <strong>First Name:</strong> ${data.firstName}
            </p>

            <p style="font-size: 15px; margin: 0 0 12px;">
                <strong>Last Name:</strong> ${data.lastName}
            </p>

            <p style="font-size: 15px; margin: 0 0 12px;">
                <strong>Email:</strong> ${data.email}
            </p>

            <p style="font-size: 15px; margin: 0 0 12px;">
                <strong>Subject:</strong> ${data.subject}
            </p>

            <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px;">
                <p style="font-size: 15px; font-weight: bold; margin: 0 0 10px;">
                    Message:
                </p>

                <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 0;">
                    ${data.message}
                </p>
            </div>

        </div>

        <div style="border-top: 1px solid #ddd; margin-top: 35px; padding-top: 20px;">
            <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
                This message was sent through the Austin Kitchen contact form.
            </p>

            <p style="font-size: 13px; color: #888; text-align: center; margin-top: 10px;">
                © 2026 Austin Kitchen. All rights reserved.
            </p>
        </div>

    </div>
`,

        };

        try {
            await transporter.sendMail(message);

        } catch (err) {
            console.log(err);
            return {
                success: false,
                message: 'Message could not be sent'
            }
        }

        return { success: true, message: 'Message sent' }
    } catch (error) {
        console.log(error)
        return { success: false, message: 'Something went wrong' }
    }
}
