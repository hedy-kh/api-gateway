import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './Otp.css'
import BaseUrl from '../../config/Base';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

export default function Otp() {
  const location = useLocation();
  const { email } = location.state || {};
  const [otp, setOtp] = useState(['', '', '', '']);
  const [sendTime, setSendTime] = useState(120);
  const [success, setSuccess] = useState(null);
  const inputRefs = useRef([]);
  const timerRef = useRef(null); 
  const navigate = useNavigate();
  
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const savedEndTime = localStorage.getItem('otpEndTime');
    let endTime;
    if (savedEndTime) {
      endTime = parseInt(savedEndTime, 10);
      const initialRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setSendTime(initialRemaining);
    } else {
      endTime = Date.now() + 120 * 1000;
      localStorage.setItem('otpEndTime', endTime);
      setSendTime(120);
    }
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setSendTime(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        localStorage.removeItem('otpEndTime');
      }
    }, 1000);
  };
  
  useEffect(() => {
    if (!email) {
      navigate('/login')
    }
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [email,navigate]);
  
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);    
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };
  
  const handleReset = () => {
    localStorage.removeItem('otpEndTime');
    const newEndTime = Date.now() + 120 * 1000;
    localStorage.setItem('otpEndTime', newEndTime);
    startTimer();
    setOtp(['','','','']);
  }
  
  const handleSubmit = async() => {
    try {
      const res = await fetch(`${BaseUrl}/auth/verifyaccount`, {
        method: 'POST',
        headers: {
          'content-type':'application/json'
        },
        body: JSON.stringify({email, otp: otp.join('')}),
      })
      if (!res.ok) throw new Error('otp verification failed');
      const result = await res.json();
      setSuccess('success');
      setTimeout(() => {
        navigate('/login')
      }, 2000);
      console.log(result);
    } catch (error) {
      console.log(error);
      setSuccess('error');
    } finally {
      setSuccess(null);
    }
  }
  return (
    <>
      {success === null ?
        <div className='Otp-otpContainer'>
          <div className='Otp-container'>
            <p>Please verify your account</p>
            <div className='Otp-otpForm'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type='text'
                  inputMode='numeric'
                  maxLength='1'
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            <button onClick={handleSubmit} disabled={otp.some(digit=>digit==='')}>Verify</button>
            {sendTime > 0 ?
              <p style={{ color: 'white', margin: 0 }}> Resend in {sendTime} s </p> :
              <p className='Otp-aLink' onClick={handleReset}>Resend verification code?</p>
            }
          </div>
        </div> :
        <div className='Otp-SuccessIndicator'>
          <p>{success === 'success' ? 'account verified you can login' : 'error'} </p>
          <Loading/>
        </div>
      }
    </>
  )
}