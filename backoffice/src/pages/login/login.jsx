import React, { useEffect, useState } from 'react'
import './login.css'
import axios from 'axios'
import Swal from 'sweetalert2';
import config from '../../config';
import { useNavigate } from 'react-router-dom' 
function Login() {
    const navigate = useNavigate()
    const [username,setUsername] = useState();
    const [password,setPassword] = useState();

    useEffect(() => {
       const isLoginAdmin = localStorage.getItem('isLoginBackend')
       if(isLoginAdmin === 'true') {
          return     navigate('/dashboard');
       }
    },[])

    const handleShowPass = () => {
        const input = document.getElementById('password');
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    }
    const handleLogin = async(e) => {
        e.preventDefault()
        try {
           const payload = {
              username: username,
              password: password
           }
           const response = await axios.post(`${config.api_path}admin/signin`, payload)
           if (response.status === 200) {
                Swal.fire({
                    icon:'success',
                    title: 'เข้าสู่ระบบ',
                    text: `ยินดีต้อนรับเข้าสู่ระบบ `
                }).then(() => {
                    const res = response.data
                    localStorage.setItem("isLoginBackend",res.isLogin);
                    localStorage.setItem(config.token_name,res.token);
                    navigate('/dashboard');
                })
           }
        } catch (error) {
            Swal.fire({
                icon:'error',
                title: 'error',
                text: error.response.data.message
            })
            console.log(error.response.data.message)
        }
    }

    return (
        <div>
            <section className="ftco-section">
                <div className="container">
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-7 col-lg-5">
                            <div className="login-wrap p-4 p-md-5" >
                                <h3 className="text-center mb-4">Backend</h3>
                                <form onSubmit={handleLogin} className="login-form">
                                    <div className="form-group">
                                        <label className="control-label">Username <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" className="form-control rounded" placeholder="Username" onChange={e => setUsername(e.target.value)} required/>
                                    </div>
                                    <div className="form-group password-group">
                                        <label className="control-label">Password <span style={{ color: 'red' }}>*</span></label>
                                        <div className="input-group">
                                            <input type="password" id="password" className="form-control rounded" placeholder="Password" onChange={e => setPassword(e.target.value)}  required />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary toggle-password rounded  " onClick={handleShowPass} type="button">
                                                    <i className="fa fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                     <button type="submit" className="form-control btn rounded submit px-3 mt-3" style={{ background: "radial-gradient(#00d3ff, #15b2b7)", color: "white" }}>ลงชื่อเข้าใช้</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default Login