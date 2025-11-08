import React, { useState } from 'react'
import './Register.css';
import { data, Link, useNavigate } from 'react-router-dom'; 
import BaseUrl from "../../config/Base";
import { FaEye } from "react-icons/fa6";
import { IoEyeOffSharp } from "react-icons/io5";

export default function Register() {
  const [formData, setFromData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword:'',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const navigate = useNavigate();
  
  const registerUser = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData || 'registration failed');
      }
      await res.json();
      navigate('/otp', {
        state: {
          email: formData.email
        }
      })
    } catch (error) {
      console.log(error);
      setError(error.message)
    } finally {
      setLoading(false)
      setFromData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword:''
      })
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFromData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  
  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.confirmPassword || !formData.password) {
      setError('all fileds are required');
      return;
    }
    if (formData.password.length < 8) {
      setError('password length more than 8 char');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('password and confirm password are not equal');
      return
    }
    registerUser();
  }
  
  return (
    <div className='Register-container'>
      <div className="Register-form">
        <div className="Register-title">Welcome </div>
        <div className="Register-subtitle">Create account</div>
        
        <div className="Register-input-container Register-ic1">
          <input id="firstName" className="Register-input" type="text" value={formData.firstName} onChange={handleChange} name='firstName' placeholder=" " />
          <div className="Register-cut"></div>
          <label htmlFor="firstName" className="Register-placeholder">firstname</label>
        </div>
        
        <div className="Register-input-container Register-ic1">
          <input id="lastName" className="Register-input" type="text" value={formData.lastName} onChange={handleChange} name='lastName' placeholder=" " />
          <div className="Register-cut"></div>
          <label htmlFor="lastName" className="Register-placeholder">lastname</label>
        </div>
        
        <div className="Register-input-container Register-ic1">
          <input id="email" className="Register-input" type="email" value={formData.email} onChange={handleChange} name='email' placeholder=" " />
          <div className="Register-cut"></div>
          <label htmlFor="email" className="Register-placeholder">Email</label>
        </div>       
        
        <div className="Register-input-container Register-ic2">
          <input id="password" className="Register-input" type={visible?'text':"password"} name='password' value={formData.password} onChange={handleChange} placeholder=" " />
          <div className='Register-icone' onClick={()=>setVisible(!visible)}>
            {!visible?<FaEye/>:<IoEyeOffSharp/>}
          </div>
          <div className="Register-cut"></div>
          <label htmlFor="password" className="Register-placeholder">Password</label>
        </div>
        
        <div className="Register-input-container Register-ic2">
          <input id="confirmPassword" className="Register-input" type={visible2?'text':'password'} name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder=" " />
          <div className='Register-icone' onClick={()=>setVisible2(!visible2)}>
            {!visible2?<FaEye/>:<IoEyeOffSharp/>}
          </div>
          <div className="Register-cut"></div>
          <label htmlFor="confirmPassword" className="Register-placeholder">confirm password</label>
        </div>      
        
        <button type="submit" className="Register-submit" onClick={handleSubmit}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="Register-social-divider">
          <span>OR</span>
        </div>
        
        <div className="Register-social-buttons">
          <button 
            className="Register-social-btn Register-google" 
            type="button"
          >
            <span className="Register-icon">G</span>
            Continue with Google
          </button>
          
          <button 
            className="Register-social-btn Register-facebook" 
            type="button"
          >
            <span className="Register-icon">f</span>
            Continue with Facebook
          </button>
        </div>
        
        <div className="Register-signup-link">
          Don't have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}