import { useEffect, useState } from 'react';
import axios from 'axios'
import config from "../config"
import Modal from '../components/Modal'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

function Package() {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([])
    const [yourPackage, setYourPackage] = useState({})
    const [Input, setInput] = useState({
        name: '',
        phone: '',
        pass:''
    });
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(`${config.api_path}package/list`)
            if (response.status === 200) {
                setPackages(response.data.body)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    const chosenPackage = async (item) => {
        try {
            setYourPackage(item)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const data = {
                RepairId: yourPackage.id,
                name: Input.name,
                phone: Input.phone,
                pass:Input.pass
            }
            const response = await axios.post(`${config.api_path}member/create`, data)
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'ลงทะเบียนแพ็กเกจสำเร็จ',
                }).then(() => {
                    setInput({
                        name: '',
                        phone: '',
                        pass:''
                    })
                    setTimeout(() => {
                       window.location.reload()
                    }, 500)
                })
            }
        } catch (error) {
            const status = error.response.status;
            const message = error.response.data.message;
            alert(`status:${status} message: ${message}`)
        }
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
                <div className="container">
                    <a className="navbar-brand" href="#">POS ระบบร้านค้าออนไลน์</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/">หน้าแรก</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link " to="/login">เข้าสู่ระบบ</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <div className="row row-cols-1 row-cols-md-2 g-4 mt-5">
                    <div className="col-md-12 mt-5">
                        <h1 className='text-primary'>เลือกแพ็กเกจ</h1>
                        <h3>เลือกแพ็กเกจที่ใช่สำหรับร้านค้าของคุณ</h3>
                    </div>
                    {packages && packages.length !== 0 ? packages.map(item => (
                        <div className="col-md-4 mt-4" key={item.id}>
                            <div className="card border-primary  mb-3 h-100">
                                <div className="card-body">
                                    <h5 className="card-title text-success">{item.name}</h5>
                                    <p>จำนวนการใช้ต่อบิล {parseInt(item.bill_amount).toLocaleString('th-TH')} &nbsp;บิลต่อเดือน</p>
                                    <p>ราคา {parseInt(item.price).toLocaleString('th-TH')} &nbsp; บาท</p>
                                    <button type="button" onClick={(e) => chosenPackage(item)} className='btn btn-primary w-100' data-bs-toggle="modal" data-bs-target="#modalRegister" tabIndex={item.id}>เลือกแพ็กเกจ</button>
                                </div>
                            </div>
                        </div>
                    )) : <div className="col-md-12">ไม่มีข้อมูล</div>}
                </div>
            </div>

            <Modal id="modalRegister" title="ลงทะเบียนบิล">
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Package {yourPackage.name} ราคา&nbsp;{parseInt(yourPackage.price).toLocaleString('th-TH')} &nbsp;ต่อเดือน</label>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">ชื่อร้าน<span style={{color:'red'}}>*</span></label>
                        <input type="text" className="form-control" id="name" placeholder="ชื่อ" onChange={e => setInput({ ...Input, name: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">เบอร์โทรศัพท์<span style={{color:'red'}}>*</span></label>
                        <input type="text" className="form-control" id="phone" placeholder="เบอร์โทรศัพท์" onChange={e => setInput({ ...Input, phone: e.target.value })} required maxLength={10} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">รหัสผ่าน <span style={{color:'red'}}>*</span></label>
                        <input type="password" className="form-control" id="pass" placeholder="รหัสผ่าน" onChange={e => setInput({ ...Input, pass: e.target.value })} minLength={6} maxLength={10} required/>
                    </div>

                    <div className="mb-3">
                        <button className="btn btn-primary w-100" type="submit"><i className='fa fa-arrow-right me-2'></i> ลงทะเบียน</button> &nbsp;
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Package
