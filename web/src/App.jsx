import { BrowserRouter, Routes, Route } from 'react-router'
import { Suspense, lazy } from 'react'

const Loading = lazy(() => import('./components/Loading'));
const Homepage = lazy(() => import('./pages/home/Homepage'));
const About = lazy(() => import('./pages/home/About'))
const Contact = lazy(() => import('./pages/home/Contact'))
const Hero = lazy(() => import('./pages/home/Hero'))
const Developer = lazy(() => import('./pages/home/Developer'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Rest = lazy(() => import('./pages/auth/Rest'))
const Notfound = lazy(() => import('./components/Notfound.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={
          <Suspense fallback={<Loading />}>  {/* ✅ Fixed */}
            <Homepage />
          </Suspense>
        }
        />
        <Route path='/About' element={
          <Suspense fallback={<Loading />}>  {/* ✅ Fixed */}
            <About />
          </Suspense>
        } />
        <Route path='/Contact' element={
          <Suspense fallback={<Loading />}>  {/* ✅ Fixed */}
            <Contact />
          </Suspense>
        } />
        <Route path='/Hero' element={
          <Suspense fallback={<Loading />}>  {/* ✅ Fixed */}
            <Hero />
          </Suspense>
        } />
        <Route path='/Developer' element={
          <Suspense fallback={<Loading />}>  {/* ✅ Fixed */}
            <Developer />
          </Suspense>
        } />
        <Route path='/Login' element={
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        } />
        <Route path='/Register' element={
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        } />
        <Route path='/Rest' element={
          <Suspense fallback={<Loading />}>
            <Rest />
          </Suspense>
        } />
        <Route path='*' element={<Notfound />} />
        <Route path='/lazy' element={<Loading/>}/>
      </Routes>

    </BrowserRouter>
  )
}
export default App