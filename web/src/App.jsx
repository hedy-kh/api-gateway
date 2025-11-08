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
const Unauthorized = lazy(() => import('./pages/Unauthorized.jsx'));
const Dashboard = lazy(() =>import ('./pages/admin/Dashboard.jsx'));
const Otp = lazy(()=>import('./pages/auth/Otp.jsx'))
const Notfound = lazy(() => import('./components/Notfound.jsx'))
import AuthProvider from './hooks/useAuth.jsx';
import { ProtectedRoute } from './hooks/Protected.jsx';
function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route index element={<Suspense fallback={<Loading />}><Homepage /></Suspense>} />
        <Route path='/Login' element={<Suspense fallback={<Loading />}><Login /></Suspense>} />
        <Route path='/Register' element={<Suspense fallback={<Loading />}><Register /></Suspense>}/>
        <Route path='/About' element={<Suspense fallback={<Loading />}> <About /></Suspense>} />
        <Route path='/Contact' element={<Suspense fallback={<Loading />}>  <Contact /></Suspense>}/>
        <Route path='/Hero' element={<Suspense fallback={<Loading />}>  <Hero /></Suspense>}/>
        <Route path='/otp' element={<Suspense fallback={<Loading />}><Otp/></Suspense>}/>
        <Route path='/Unauthorized'element={<Suspense fallback={<Loading/>}><Unauthorized/></Suspense>}/>
        <Route path='/Rest' element={<Suspense fallback={<Loading />}><Rest /></Suspense>}/>
        <Route path='*' element={<Notfound />} />
          <Route path='/lazy' element={<Loading />} />
          <Route path='/Developer'
            element={
              <ProtectedRoute>
              <Suspense fallback={<Loading />}>
              <Developer />
                </Suspense>
                </ProtectedRoute>
                }
          />
          <Route path='/Dashboard' element={<Suspense fallback={<Loading/>}>
           <Dashboard/>
          </Suspense>}/>
      </Routes>
      </BrowserRouter>
      </AuthProvider>
  )
}
export default App