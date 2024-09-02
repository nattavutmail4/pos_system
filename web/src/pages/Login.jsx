import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import axios from 'axios'
import config from '../config'
import Swal from 'sweetalert2'
function Login() {
    document.title = 'เข้าสู่ระบบ';
    const navigate = useNavigate();
    const [username,setUsername] = useState();
    const [password,setPassword] = useState();
    // console.log(localStorage.getItem("isLoginMember"))
    // console.log(localStorage.getItem(config.token_name));
    useEffect(() => {
        const isLoginMember = localStorage.getItem("isLoginMember");
        if (isLoginMember !== null && isLoginMember === 'true') {
            navigate('/sale');
        }
    }, [navigate]);
    const handleLogin = async(e) => {
        e.preventDefault()
        try {
            const data = {
                username: username,
                password: password
            }
            const response = await axios.post(`${config.api_path}member/login`, data);
            if (response.status === 200) {
                Swal.fire({
                    icon:'success',
                    title: 'เข้าสู่ระบบ',
                    text: `ยินดีต้อนรับเข้าสู่ระบบ `
                })
                localStorage.setItem("isLoginMember", response.data.isLogin);
                localStorage.setItem(config.token_name,response.data.token);
                setTimeout(() => {
                    navigate('/sale');
                }, 1500);
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'เข้าสู่ระบบไม่สำเร็จ',
                    text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'มีข้อผิดพลาดเกิดขึ้น',
                text: 'ไม่สามารถเข้าสู่ระบบได้ โปรดลองใหม่ภายหลัง'
            });
            console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error.message);
        }
    }
    return (
        <div>
            <section className="ftco-section">
                <div className="container">
                   
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-7 col-lg-5">
                            <div className="login-wrap p-4 p-md-5" >
                                <div className="icon d-flex align-items-center justify-content-center" style={{background:'#e12612'}}>
                                    <span className="fa fa-user-o"> POS </span>
                                </div>
                                <h3 className="text-center mb-4">ลงชื่อเข้าใช้</h3>
                                <form  onSubmit={handleLogin} className="login-form">
                                    <div className="form-group">
                                        <label className=" control-label">Username <span style={ { color:'red'}}> *</span></label>
                                        <input type="text" className="form-control rounded-left" placeholder="Username" onChange={e => setUsername(e.target.value)} required maxLength={10} />
                                    </div>
                                    <div className="form-group ">
                                        <label className=" control-label">Password <span style={ { color:'red'}}> *</span></label>
                                        <input type="password" className="form-control rounded-left" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="form-group ">
                                        <button type="submit" className="form-control btn btn-primary rounded submit px-3">ลงชื่อเข้าใช้</button>
                                    </div>
                                    <div className="form-group d-md-flex">
                                        <div className="w-50">
                                            <label className="checkbox-wrap checkbox-primary">จดจำฉัน
                                                <input type="checkbox"  />
                                                    <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        <div className="w-50 text-md-right">
                                            <a href="#">ลืมรหัสผ่าน</a>
                                        </div>
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