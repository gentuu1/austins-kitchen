import NavBar from '@/components/NavBar'
import Spinner from '@/components/Spinner'

const loading = () => {
    return (
        <>
            <div className="sticky top-0 z-50">
                <NavBar />
            </div>
            <Spinner />
        </>
    )
}

export default loading
