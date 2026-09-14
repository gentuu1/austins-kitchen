'use client'
import  { ReactNode } from 'react'
import { CartProvider } from '../context/contextProvider'

function RootLayt({ children, }: { children: ReactNode }) {
  return (
    <div>
        <CartProvider>
                            {children}
                        </CartProvider>
    </div>
  )
}

export default RootLayt
