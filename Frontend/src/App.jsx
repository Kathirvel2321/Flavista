import React from 'react'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Categories from './pages/Categories'
import Trending from './pages/Trending'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FoodDetails from './pages/FoodDetails'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<>
          <Home /> 
          <Categories />
          <Trending />
          

          </>
        } />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
         
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App