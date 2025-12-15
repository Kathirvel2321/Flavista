import React from 'react'
import Home from './pages/Home'
import Explore from './pages/Explore'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<>
          <Home /> 
          <Explore />
          </>
        } />
          
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App