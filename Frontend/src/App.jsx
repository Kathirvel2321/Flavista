import Home from './pages/Home'
import Categories from './pages/Categories'
import Trending from './pages/Trending'
import Offers from './pages/Offers'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home1 from './pages/Home1'
import FoodDetails from './pages/FoodDetails'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import TopRestaurants from './pages/TopRestaurants.jsx'
import AllRestaurants from './pages/AllRestaurants.jsx'
import RestaurantMenu from './pages/RestaurantMenu.jsx'
import Footer from './pages/Footer.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import MyOrders from './pages/MyOrders.jsx'
import CategoryFoods from './pages/CategoryFoods.jsx'
import LazyLoadSection from './LazyLoadSection.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<>
          <Home /> 
          <LazyLoadSection>
            <Categories />
          </LazyLoadSection>
          <LazyLoadSection>
            <Trending />
          </LazyLoadSection>
          <LazyLoadSection>
            <TopRestaurants />
          </LazyLoadSection>
          <Footer />

          </>
        } />
        
        <Route path="/offers" element={<Offers />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path='/track-order' element={<OrderTracking />} />
        <Route path='/restaurants' element={<AllRestaurants />} />
        <Route path='/restaurant/:id' element={<RestaurantMenu />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/myorders' element={<MyOrders />} />
        <Route path='/category/:category' element={<CategoryFoods />} />
        <Route path='/Home1' element={<Home1 />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/resetpassword/:resetToken' element={<ResetPassword />} />
        <Route path='/track-order/:id' element={<OrderTracking />} />
        
         
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App