import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from './AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const [spassword, setSpassword] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL
    
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/account/login/`, {
                email: email,
                password: password
            });
            const { access } = response.data;
            
            localStorage.setItem('token', access); 
            setAuth(access); 
            console.log('token :',access);

            navigate('/Home');
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Invalid email or password', {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
        }
    };

    // const togglePassword = () => {
    //     setSpassword(!spassword);
    // };

    const verify =(e)=>{
        e.preventDefault();
        navigate('/LoginVerify');
    }

    return (
        <> 
            <h2 className='login-h2'>Hi, Welcome Back</h2>
            <div className='c2'>
                <form className='form2' onSubmit={handleSubmit}>
                    <div className='sign2'>
                        <div className='userdiv2'>
                            <input
                                type="text"
                                className='i2'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter your email'
                                required
                            />
                            <input
                                type='password'
                                className='i3'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password'
                                required
                            />
                            <button
                                type='button'
                                className='forget-pass'
                                onClick={verify}>
                               forgot password? 
                            </button>

                            <button type='submit' className='LButton'>Login</button>

                            <div className='end-div'></div>
                            <label className='already-user2'>New user?</label>
                            <Link className="sign-btn2" to="/Signup">Signup</Link>
                            <p className='error'>{error}</p>
                            <ToastContainer />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;