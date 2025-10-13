import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Homepage from './pages/home/Homepage'
import About from './pages/home/About'
import Contact from './pages/home/Contact'
import Hero from './pages/home/Hero'
import Developer from './pages/home/Developer'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Rest from './pages/auth/Rest'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path='/About' element={<About />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/Hero' element={<Hero />} />
        <Route path='/Developer' element={<Developer />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/Rest' element={<Rest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
