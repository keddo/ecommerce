import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Admin from "./pages/Admin"
import { useUserStore } from "./stores/useUserStore"
import { useCartStore } from "./stores/useCartStore"
import { useEffect } from "react"
import Category from "./pages/Category"
import PurchaseCancel from "./pages/PurchaseCancel"
import PurchaseSuccess from "./pages/PurchaseSuccess"
import Cart from "./pages/Cart"


function App() {
 const { user, checkAuth, checkingAuth } = useUserStore();
 const {getCartItems} = useCartStore();
 useEffect(() => {checkAuth}, [checkAuth]);
 useEffect(() => {
  if(!user) return;
  getCartItems();
 }, [getCartItems, user])
  return (
    <>
     <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2  w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]"/>
            </div>

            <div className="relative z-50 pt-20">
              <Navbar/>
              <Routes>
                 <Route path="/" element={<Home/>}/>
                 <Route path='/signup' element={ <Signup />  } />
					       <Route path='/login' element={<Signin />} />
                 <Route
                  path='/secret-dashboard'
                  element={user?.role === "admin" ? <Admin /> : <Navigate to='/login' />}
                />
                <Route path='/category/:category' element={<Category />} />
                <Route path='/cart' element={user ? <Cart /> : <Navigate to='/login' />} />
                <Route
                  path='/purchase-success'
                  element={user ? <PurchaseSuccess /> : <Navigate to='/login' />}
                />
                <Route path='/purchase-cancel' element={user ? <PurchaseCancel /> : <Navigate to='/login' />} />
              </Routes>
            </div>
        </div>
     </div>
    </>
  )
}

export default App
