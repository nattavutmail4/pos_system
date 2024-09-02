import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import config from '../config';
import Modal from './Modal'

export default function Template(props) {
    const location = useLocation();
    const [admin, setAdmin] = useState([])
    const [InputPass, setInputPass] = useState({
        pwd_old: "",
        pwd_new: ""
    })
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        try {
            const response = await axios.get(`${config.api_path}admin/info`, config.headers())
            if (response.status === 200) {
                setAdmin(response.data.body)
            }
        } catch (error) {
            if (error) {
                console.log(error)
                if (error.response.status === 401) {
                    localStorage.removeItem('isLoginBackend')
                    localStorage.removeItem('pos_token')
                    window.location.href = "/"
                } else {
                    localStorage.removeItem('isLoginBackend')
                    localStorage.removeItem('pos_token')
                    window.location.href = "/"
                }
            }
        }
    }
    const handleLogout = () => {
        try {
            Swal.fire({
                icon: 'question',
                title: 'Sign out',
                text: 'ยืนยันการออกจากระบบ',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            }).then((res) => {
                if (res.isConfirmed) {
                    localStorage.removeItem('isLoginBackend')
                    localStorage.removeItem('pos_token')
                    window.location.href = "/"
                } else {
                    Swal.fire('success', 'ยกเลิก', 'success')
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const url = `${config.api_path}admin/update/${admin.id}`
            Swal.fire({
                icon: 'question',
                title: 'อัพเดทรหัสผ่าน',
                text: 'ยืนยันการอัพเดทรหัสผ่าน',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            }).then(async(rf) => {
                if(rf.isConfirmed){
                    const url = `${config.api_path}admin/editpass/${admin.id}`
                    const payload = {
                        pwd:InputPass.pwd_new
                    }
                    const response =  await axios.put(`${url}`, payload, config.headers())
                    if(response.status === 200) {
                        Swal.fire({
                            icon:'success',
                            title: response.data.message,
                            text: response.data.message,
                            confirmButtonColor: '#3085d6',
                        }).then(() => {
                            fetchData()
                            const btns = document.getElementsByClassName('close');
                            for(let i = 0; i < btns.length; i++){
                                btns[i].click()
                            }
                        })
                    }
                }else{
                    Swal.fire('success', 'ยกเลิก', 'success')
                }
            }).catch((e) => {
                console.log(e)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowPassnew = () => {
        const input = document.getElementById('password_new');
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    }

    const handleShowPassold = () => {
        const input = document.getElementById('password_old');
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    }

    return (
        <>
            <div className='d-flex'>
                <div className='bg-dark ps-2 pe-3' style={{ height: '100dvh', width: "360px", position: "fixed", top: 0, left: 0 }}>
                    <div className="text-white">
                        <div className='p-3 text-warning h5 ms-2'> {admin.name} : {admin.level}</div>
                        <div className='ms-2'>
                            <button
                                className='btn btn-outline-warning btn-sm me-2'
                                data-target="#modaleditPass" data-toggle="modal"
                            >
                                เปลี่ยนรหัสผ่าน
                            </button>

                            <button
                                className='btn btn-outline-warning btn-sm me-2'
                                onClick={handleLogout}>
                                ออกจากระบบ
                            </button>
                           
                        </div>
                        <hr className='mt-4' />
                    </div>
                    <div className='d-grid gap-3 mt-2'>
                        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'btn  btn-lg  btn-outline-info text-white rounded  my-menu w-100 border-0 text-start active ' : 'btn  btn-lg  btn-outline-info text-white rounded  my-menu w-100 border-0 text-start'}>
                            <i className='fa fa-home-alt text-white me-2'></i>Dashboard
                        </Link>
                        <Link to="/Reportmember" className={location.pathname === '/Reportmember' ? 'btn  btn-lg  btn-outline-info text-white rounded  my-menu w-100 border-0 text-start active ' : 'btn  btn-lg  btn-outline-info text-white rounded  my-menu w-100 border-0 text-start'}>
                            <i className='fa fa-file-alt text-white me-2'></i>รายงานคนทีใช้บริการ
                        </Link>
                        <Link to="/ReportChangePackage" className={location.pathname === '/ReportChangePackage' ? 'btn    btn-outline-info text-white rounded  my-menu w-100 border-0 text-start active' : 'btn  btn-lg  btn-outline-info text-white rounded  my-menu w-100 border-0 text-start'}>
                            <i className='fa fa-file-alt text-white me-2'></i>รายงานคนที่ขอปลี่ยน แพกเกจ
                        </Link>

                        <Link to="/ReportSumSalePerDay" className={location.pathname === '/ReportSumSalePerDay' ? 'btn    btn-outline-info text-white rounded  my-menu w-100 border-0 text-start active' : 'btn  btn-lg  btn-outline-info text-white rounded  my-menu w-100 border-0 text-start'}>
                            <i className='fa fa-file-alt text-white me-2'></i>รายงานรายได้รายวัน
                        </Link>
                        <Link to="/ReportSumSalePerMonth" className={location.pathname === '/ReportSumSalePerMonth' ? 'btn    btn-outline-info text-white rounded  my-menu w-100 border-0 text-start active' : 'btn  btn-lg  btn-outline-info text-white rounded  my-menu w-100 border-0 text-start'}>
                            <i className='fa fa-file-alt text-white me-2'></i>รายงานรายได้รายเดือน
                        </Link>
                        <Link to="/ReportSumSalePerYear" className={location.pathname === '/ReportSumSalePerYear' ? 'btn    btn-outline-info text-white rounded  my-menu w-100 border-0 text-start active' : 'btn  btn-lg  btn-outline-info text-white rounded  my-menu w-100 border-0 text-start'}>
                            <i className='fa fa-file-alt text-white me-2'></i>รายงานรายได้รายปี
                        </Link>
                        <Link to="/admin" className={location.pathname === '/admin' ? 'btn    btn-outline-info text-white rounded  my-menu w-100 border-0 text-start active' : 'btn  btn-lg  btn-outline-info text-white rounded  my-menu w-100 border-0 text-start'}>
                            <i className='fa fa-user-alt text-white me-2'></i>ผู้ใช้ระบบ
                        </Link>


                    </div>
                </div>
                <div className=' p-3' style={{ width: '100%', overflow: "auto", marginLeft: "360px" }}>
                    {props.children}
                </div>
            </div>
            <Modal id="modaleditPass" title="เปลี่ยนรหัสผ่าน" icon="fa fa-user-alt" modalSize="modal-md">
                <div>
                    <div className="form-group password-group">
                        <label className="control-label">รหัสผ่านใหม่ <span style={{ color: 'red' }}>*</span></label>
                        <div className="input-group">
                            <input type="password" id="password_new" className="form-control rounded" placeholder="Password"  onChange={e => setInputPass({ ...InputPass, pwd_new: e.target.value })}  required />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary toggle-password rounded  "  onClick={handleShowPassnew} type="button">
                                    <i className="fa fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group password-group">
                        <label className="control-label">รหัสผ่านเก่า <span style={{ color: 'red' }}>*</span></label>
                        <div className="input-group">
                            <input type="password" id="password_old" className="form-control rounded" placeholder="Password"  onChange={e => setInputPass({ ...InputPass, pwd_old: e.target.value })}  required />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary toggle-password rounded  " onClick={handleShowPassold}  type="button">
                                    <i className="fa fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button className='btn btn-primary w-100' onClick={handleUpdatePassword}>เปลี่ยนรหัสผ่าน</button>
                    </div>
                </div>
            </Modal>
        </>

    )
}
