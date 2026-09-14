import ProfileNavbar from '@/components/ProfileNavbar'
import Spinner from '@/components/Spinner'

const loading = () => {
    return <>
        <div className='sticky top-0 w-full z-50'>
        <ProfileNavbar />
        </div>
        <Spinner />
    </>
}

export default loading