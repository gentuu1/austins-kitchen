import React from 'react'

const Spinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ED8F0C] border-t-transparent" />
        </div>
    )
}

export default Spinner
