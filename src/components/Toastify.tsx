import { Bounce, Slide, ToastContainer } from "react-toastify"


const Toastify = () => {
  return (

          <div>
             <>
                  <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick={false}
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"
                      transition={Slide}
                  />
             </>
          </div>
   
   
   
  )
}

export default Toastify
