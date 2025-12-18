import React from 'react'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Categories from './pages/Categories'
import Trending from './pages/Trending'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
          
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App