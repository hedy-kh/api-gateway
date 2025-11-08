import React, { useState } from 'react'
import './Login.css';
import { Link } from 'react-router-dom'; 
import {useAuth} from '../../hooks/useAuth'
import { FaEye } from "react-icons/fa6";
import { IoEyeOffSharp } from "react-icons/io5";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password:'',
  })
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { auth, login } = useAuth();

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };
  
  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
  };

  return (
    <div className='Login-container'>
      <div className="Login-form">
        <div className="Login-title">Welcome</div>
        <div className="Login-subtitle">Login to your account</div>
        
        <div className="Login-input-container Login-ic1">
          <input id="email" className="Login-input" type="email" placeholder=" " />
          <div className="Login-cut"></div>
          <label htmlFor="email" className="Login-placeholder">Email</label>
        </div>
        
        <div className="Login-input-container Login-ic2">
          <input id="password" className="Login-input" type={visible?'text':'password'} placeholder=" " />
          <div className='Login-icone' onClick={()=>setVisible(!visible)}>
            {visible?<IoEyeOffSharp/>:<FaEye/>}
          </div>
          <div className="Login-cut"></div>
          <label htmlFor="password" className="Login-placeholder">Password</label>
        </div>
        
        <button type="submit" className="Login-submit">Login</button>

        <div className="Login-social-divider">
          <span>OR</span>
        </div>
        
        <div className="Login-social-buttons">
          <button 
            className="Login-social-btn Login-google" 
            onClick={handleGoogleLogin}
            type="button"
          >
            <span className="Login-icon">G</span>
            Continue with Google
          </button>
          
          <button 
            className="Login-social-btn Login-facebook" 
            onClick={handleFacebookLogin}
            type="button"
          >
            <span className="Login-icon">f</span>
            Continue with Facebook
          </button>
        </div>

        <div className="Login-signup-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  )
}