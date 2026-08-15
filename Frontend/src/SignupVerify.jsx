import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 function SignupVerify() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60); //resend otp timer
    const [flag, setFlag] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL
    
    //resend otp timer
    useEffect(() => {
    if (resendTimer <= 0) return;
    
    const timer = setInterval(() => {
      setResendTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    
    return () => clearInterval(timer);
    }, [resendTimer]);
    //resend otp timer

    const sendOtp = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${API_URL}/api/account/register/resendotp/`, {email});
        console.log(response.data);
        console.log("resent-otp")
        
        toast.success('OTP has been sent', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setFlag(false);
        setResendTimer(60);
        
      } catch (error) {
        setFlag(true);
        console.log('Error sending OTP');
      }
    };
    
    const verify= async(e)=>{
        e.preventDefault();
        const data={
          email: email, 
          otp: otp
        }
        try {
          const response = await axios.post(`${API_URL}/api/account/register/verifyotp/`, data);
          console.log(response.data);

          if(otp){
          if(response.status === 200){
          console.log("verified")
          navigate('/Login');
          }
        } else {
          setError('enter otp')
        }
          
        } catch (error) {
          toast.error('Invalid OTP', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          
          console.log('Error verifying OTP');
        }  
    }

  return (
    <>
    <h2 className='verify-h2'>Verifying Email</h2>
    <div className='container5'>
        <label className='otp-label'>Enter an OTP sent to your Registered Email Address</label>
        <input type="number" className='i1' placeholder='enter . . .' value={otp} onChange={(e)=> setOtp(e.target.value)}/>
        <button type='submit' className='LButton2' disabled={resendTimer > 0} onClick={sendOtp}> {resendTimer > 0 ? `Resend OTP (${resendTimer}s)`: 'Resend OTP' }</button>
        <button type='submit' className='LButton2' disabled={!otp.trim() || flag} onClick={verify}>Verify</button>
        <p className='error'>{error}</p>
        <ToastContainer />

    </div>
    </>
  )
}

export default SignupVerify;
