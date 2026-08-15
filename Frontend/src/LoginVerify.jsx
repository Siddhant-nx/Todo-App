import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 function LoginVerify() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0); //resend otp timer
    const [flag, setFlag] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
            
            if (!emailRegex.test(email)) {
                setError('Invalid email');
                return;
            } else {
                setError('');
            }
             const response = await axios.post(`${API_URL}/api/account/forgot-password/`, {email});
             console.log(response.data);
             console.log("otp sent")

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

            setResendTimer(60);
            setFlag(false);
            setOtpSent(true);

           } catch (error) {
             setFlag(true);
             console.log('Error sending OTP');
             //setError('User does not exist, please Singup first')

             toast.error('Some unknown error occurred', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });

           }
        };
  
        const verify= async(e)=>{ 
          e.preventDefault();
          const data={
            email: email,
            otp: otp
          }
          try {
          
            if(email && otp){
            const response = await axios.post(`${API_URL}/api/account/register/verifyotp/`, data);
            console.log(response.data);

            if(response.status === 200){
              
            console.log("verified")
            navigate('/ChangePass', {state: {email: email, otp : otp}} );
            } else {
              console.log('Invalid OTP');
            }
          } else {
            setError('Please Enter both fields correctly')
          }
          
          } catch (error) {
            setError('Invalid OTP !')
            console.log('Error verifying OTP');
          }  
      }

  return (
    <>
    <h2 className='verify-h2'>Verifying Account</h2>
    <div className='container3'>
        {/* <label className='otp-label'>Enter OTP sent to your RegistredEmail Address</label> */}
        <input type="text" className='i1' placeholder='enter Email' value={email} onChange={(e)=> setEmail(e.target.value)} required/>
        <input type="number" className='i1' placeholder='enter OTP'value={otp} onChange={(e)=> setOtp(e.target.value)} required/>
        <div className='otp-btn-div'>
        <button type='submit' className='LButton2' disabled={!emailRegex.test(email) || otpSent} onClick={sendOtp}>Send OTP</button>
        <button type='submit' className='LButton2' disabled={resendTimer > 0 || !otpSent} onClick={sendOtp}> {resendTimer > 0 ? `Resend OTP (${resendTimer}s)`: 'Resend OTP' }</button>
        </div>
        <button type='submit' className='LButton2' disabled={!otp.trim() || !emailRegex.test(email) || flag} onClick={verify}>Confirm</button>
        <p className='error2'>{error}</p>

        <ToastContainer/>
    </div>
    </>
  )
}
export default LoginVerify;