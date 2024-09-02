import axios from 'axios';
import React, { useEffect, useState , forwardRef, useImperativeHandle} from 'react'
import config from '../config';
import { Link, useLocation } from 'react-router-dom';

import Swal from 'sweetalert2';
import Modal from './Modal';
const  SideBar = forwardRef((props,sidebarRef) => {
    const location = useLocation();
    const [memberId, setMemberId] = useState(null);
    const [membername, setMembername] = useState(null);
    const [packageName, setPackageName] = useState(null);
    const [editMembername, setEditMembername] = useState();
    const [editPassword, setEditPassword] = useState(null);
    const [packages, setpackages] = useState([]);
    const [totalBills, setTotalBills] = useState(0);
    const [billAmount, setBillAmount] = useState(0);
    const [banks,setBanks] = useState([]);
    const [choosePackage, setChoosePackage] = useState({});
    useEffect(() => {
        fetchData()
        fetchDatatotalbill()
    }, [])

    useEffect(() => {
        fetchData()
        fetchDatatotalbill()
    }, [])
    const fetchData = async () => {
        try {
            const response = await axios.get(`${config.api_path}member/info`, config.headers())
            if (response.status === 200) {
                setMemberId(response.data.body.id)
                setMembername(response.data.body.name);
                setPackageName(response.data.body.package.name);
                setBillAmount(response.data.body.package.bill_amount)
            }
        } catch (error) {
            localStorage.removeItem('isLoginMember')
            localStorage.removeItem('pos_token')
            window.location.href = "/login"
            if (error.status === undefined) {
                console.error('Error fetching data:', error)
            }
            if (error.response.status === 401) {
                localStorage.removeItem('isLoginMember')
                localStorage.removeItem('pos_token')
                window.location.href = "/login"
            } 
        }
    }
    const fetchDatatotalbill = async() => {
        try {
            const response = await axios.get(`${config.api_path}package/countTotalUse`,config.headers());
            if(response.status === 200) {
                setTotalBills(response.data.countBill)
            }
        } catch (error) {
            setTotalBills(0)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `${error.response.data.message}`,
            })
        }
    }

    const fetchDatabank = async() => {
        try {
            if(banks.length == 0) {
                const response = await axios.get(`${config.api_path}bank/listbank`,config.headers());
                if(response.status === 200) {
                    setBanks(response.data.body)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    const handleLogout = () => {
        Swal.fire({
            icon: 'question',
            title: 'Sign out',
            text: 'ยืนยันการออกจากระบบ',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((res) => {
            if (res.isConfirmed) {
                localStorage.removeItem('isLoginMember')
                localStorage.removeItem('pos_token')
                window.location.href = "/login"
            } else {
                Swal.fire('success', 'ยกเลิก', 'success')
            }
        })
    }

    const handleProfile = async () => {
        try {
            const response = await axios.get(`${config.api_path}member/info`, config.headers())
            if (response.status === 200) {
                setMembername(response.data.body.name)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleupdateProfile = async (e) => {
        e.preventDefault();
        try {
            Swal.fire({
                icon: 'question',
                title: 'อัพเดทชื่อร้านค้า',
                text: 'ยืนยันการแก้ไขข้อมูลร้านค้า',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then(async (res) => {
                if (res.isConfirmed) {
                    const data = {
                        name: editMembername
                    }
                    const response = await axios.put(`${config.api_path}member/editProfile/${memberId}`, data, config.headers())
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: response.data.message,
                            text: response.data.message,
                        }).then(() => {
                            setTimeout(() => {
                                window.location.reload()
                            }, 500)
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'ไม่สำเร็จ',
                            text: 'กรุณาลองใหม่อีกครั้ง',
                        })
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการแก้ไขข้อมูล',
                    });
                }
            })
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ',
                text: 'กรุ��า��องใหม่อีกครั้ง',
            })

        }
    }

    const handleupdatePass = async (e) => {
        e.preventDefault();
        try {
            Swal.fire({
                icon: 'question',
                title: 'อัพเดทรหัสผ่าน',
                text: 'ยืนยันการแก้ไขรหัสผ่าน',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then(async (res) => {
                if (res.isConfirmed) {
                    const data = {
                        pass: editPassword
                    }
                    const response = await axios.put(`${config.api_path}member/editPass/${memberId}`, data, config.headers())
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: response.data.message,
                            text: response.data.message,
                        }).then(() => {
                            setTimeout(() => {
                                localStorage.removeItem('isLoginMember')
                                localStorage.removeItem('pos_token')
                                window.location.reload()
                            }, 500)
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'ไม่สำเร็จ',
                            text: 'กรุ��า��องใหม่อีกครั้ง',
                        })
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการแก้ไขรหัสผ่าน',
                    });
                }
            })
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ',
                text: 'กรุ��า��องใหม่อีกครั้ง',
            })
        }
    }

    const handleChoosePackage = (item) => {
        setChoosePackage(item)
        fetchDatabank()
    }
    const handleChangePackage = async() => {
        try {
            Swal.fire({
                icon: 'question',
                title: 'ยืนยันการเลือก',
                text: 'ยืนยันการเลือกแพ็กเกจนี้',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then( async(isCf) => {
                if(isCf.isConfirmed){
                    const res = await axios.get(`${config.api_path}package/changePackage/${choosePackage.id}`,config.headers())
                    if(res.status === 200) {
                        Swal.fire({
                            icon:'success',
                            title: res.data.message,
                            text: res.data.message,
                        })
                        const btns  = document.getElementsByClassName('btnClose');
                        for(let i = 0; i < btns.length; i++){
                            btns[i].click();
                        }
                    }
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการเลือกแพ็กเกจนี้',
                    })
                }
            }).catch( err => {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สำเร็จ',
                    text: err.response.data.message,
                })
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ',
                text: error.response.data.message,
            })
        }
        
    }
    const fetchPackage = async () => {
        try {
            const response = await axios.get(`${config.api_path}package/list`)
            if (response.status === 200) {
                setpackages(response.data.body)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const renderButton = (item) => {
        if (packageName == item.name) {
            return (
                <button type="button" className='btn btn-primary w-100 rounded ' data-bs-toggle="modal" data-bs-target="#modalBank" tabIndex={item.id} disabled > <i className='fa fa-check me-2'></i> เลือกแพ็กเกจ</button>
            )
        } else {
            return (
                <button type="button" className='btn btn-primary w-100 rounded  ' onClick={e => handleChoosePackage(item)}  data-bs-toggle="modal" data-bs-target="#modalBank" tabIndex={item.id}> <i className='fa fa-check me-2'></i> เลือกแพ็กเกจ</button>
            )
        }
    }
    const calculatePercentage = (totalBill,billAmount) => {
        if(billAmount > 0) {
            const percentage = ((totalBill * 100) / billAmount) 
            return percentage;
        }else{
            return 0;
        }
        
    }
 
    useImperativeHandle(sidebarRef,() => ({
        refreshCountBill() {
            fetchDatatotalbill()
        }
    }))

    return (
    <div>
        <aside className="main-sidebar elevation-4 sidebar-light-olive">
            <a href="../../index3.html" className="brand-link">
                <img src="../../dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '0.8' }} />
                <span className="brand-text font-weight-light">{membername}</span>
            </a>

            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src="../../dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info d-grid">
                        <div>
                            {membername}
                        </div>
                        <div>
                            Package: {packageName}
                        </div>
                        <div className='d-grid gap-0 d-md-block'>
                            <button type="button" className='btn btn-warning mt-2 w-100' data-bs-toggle="modal" data-bs-target="#modalUpgrad" tabIndex="-1" onClick={fetchPackage} > <i className='fa fa-arrow-up me-2'></i><b>Upgrade</b></button>
                        </div>
                    </div>

                </div>
                <div className='ms-2 me-2'>
                    <div className='float-start'>
                        {parseInt(totalBills).toLocaleString('th-TH')}   / { parseInt(billAmount).toLocaleString('th-TH')}
                    </div>
                    <div className='float-end'>
                        {calculatePercentage(totalBills, billAmount) + '%' }
                    </div>
                    <div className="clearfix"></div>
                </div> 
                <div className="ms-2 me-2 progress " role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar"
                        style={{ "width":calculatePercentage(totalBills, billAmount) + '%' }}></div>
                </div>


                <nav className="mt-3">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-header">เมนู</li>

                        

                        <li className="nav-item">
                            <Link to='/sale' className={location.pathname === '/sale' ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fa-regular fa-dollar-sign"></i>
                                <p>
                                    ขายสินค้า
                                </p>
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to='/product' className={location.pathname === '/product' ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-box"></i>
                                <p>
                                    สินค้า
                                </p>
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to='/user' className={location.pathname === '/user' ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-user"></i>
                                <p>
                                    ชื่อผู้ใช้งานระบบ
                                </p>
                            </Link>
                        </li>

                        <li className="nav-header">รายงาน</li>
                        <li className="nav-item">
                            <Link to='/billsalesumperday' className={location.pathname === '/billsalesumperday' ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-file-alt "></i>
                                <p className="text">  รายงานยอดขายรายวัน</p>
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to='/billsale' className={location.pathname === '/billsale' ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-list-alt"></i>
                                <p className="text">  รายงานบิลขาย</p>
                            </Link>

                        </li>
                        <li className="nav-item">
                            <Link to='/reportstock' className={location.pathname === '/reportstock' ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-list-alt"></i>
                                <p className="text">  รายงานสต๊อกสินค้า</p>
                            </Link>

                        </li>

                        <li className="nav-item">
                            <Link to='/stock' className={location.pathname === '/stock' ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-home"></i>
                                <p className="text">  รับสินค้าเข้า Stock</p>
                            </Link>
                        </li>

                        <li className="nav-header">ตั้งค่า</li>
                        <li className="nav-item">
                            <a onClick={handleProfile} className="nav-link" style={{ cursor: "pointer" }} data-bs-toggle="modal" data-bs-target="#modalEditProfile" tabIndex="-1" >
                                <i className="nav-icon fas fa-user-circle text-info"></i>
                                <p className="text">  ประวัติส่วนตัว</p>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a onClick={handleProfile} className="nav-link" style={{ cursor: "pointer" }} data-bs-toggle="modal" data-bs-target="#modalEditPass" tabIndex="-1" >
                                <i className="nav-icon fas fa-user-circle text-info"></i>
                                <p className="text">  แก้ไขรหัสผ่าน</p>
                            </a>
                        </li>
                        <li className="nav-header">ออกจากระบบ</li>
                        <li className="nav-item">
                            <a onClick={handleLogout} className="nav-link" style={{ cursor: "pointer" }}>
                                <i className="nav-icon far fa-circle text-danger"></i>
                                <p className="text">ออกจากระบบ</p>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
        <Modal id="modalEditProfile" title="แก้ไขข้อมูลส่วนตัว">
            <form onSubmit={handleupdateProfile}>
                <div className="form-group">
                    <label>ชื่อร้านค้าเดิม</label>
                    <input
                        type="text"
                        value={membername || ''}
                        className='form-control'
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label>ชื่อร้านค้าใหม่</label>
                    <input
                        type="text"
                        className='form-control'
                        onChange={e => setEditMembername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary w-100" type="submit"><i className='fa fa-arrow-right me-2'></i> แก้ไขข้อมูล</button> &nbsp;
                </div>
            </form>
        </Modal>

        <Modal id="modalEditPass" title="แก้ไขข้อมูลรหัสผ่าน">
            <form onSubmit={handleupdatePass} >
                <div className="form-group">
                    <label>รหัสผ่านใหม่</label>
                    <input
                        type="password"
                        onChange={e => setEditPassword(e.target.value)}
                        className='form-control'
                    />
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary w-100" type="submit"><i className='fa fa-arrow-right me-2'></i> แก้ไขรหัสผ่าน</button> &nbsp;
                </div>
            </form>
        </Modal>

        <Modal id="modalUpgrad" title="เลือกแพ็คเกจที่ต้องการ" modalSize="modal-lg">
            <div className="row">
                {packages.length > 0 ? packages.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="col-sm-4 mt-3  mb-3">
                            <div className="card border-primary   h-100 ">
                                <div className="card-body">
                                    <div className='h4 text-success'>{item.name}</div>
                                    <div className='h5 me-2 me-2'> <strong className='text-primary'> ราคา {parseInt(item.price).toLocaleString('th-TH')}  ./เดือน </strong></div>
                                    <div className='  me-2 me-2 '>จำนวนบิล <strong className='text-danger'> {parseInt(item.bill_amount).toLocaleString('th-TH')}</strong> ต่อบิล</div>
                                    <div className='mt-3 text-center'>
                                        {renderButton(item)}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </React.Fragment>
                )) : null}
            </div>
        </Modal>
        <Modal id="modalBank" title ="ช่องทางการชำระเงิน" modalSize="modal-lg">
            <div className='h4 text-secondary'>
                Package ที่เลือกคือ { choosePackage.name}
            </div>
            <div className="mt-3 h5">
                ราคา <span className="text-danger">{ parseInt(choosePackage.price).toLocaleString('th-TH')}</span> บาท/เดือน
            </div>
            <div className='table-response-sm mt-3'>
                <table className=' table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ธนาคาร</th>
                            <th>เลขบัญชี</th>
                            <th>เจ้าของบัญชี</th>
                            <th>สาขา</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banks.length > 0 ? banks.map((item,index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.bankType}</td>
                                    <td>{item.bankCode}</td>
                                    <td>{item.bankName}</td>
                                    <td>{item.bankBranch}</td>
                                </tr>
                            </React.Fragment>
                        )) : <tr><td colSpan={3}>ไม่มีข้อมูล</td></tr>}
                    </tbody>
                </table>
                <div className='alert mt-3 alert-info'>
                    <i className='fa fa-info-circle me-2 '></i>   เมื่อโอนชำระเงินเรียบร้อยแล้ว ให้นำสลิปไปแจ้งที่  Line ที่ 09xxxxxxxx
                </div>

                <div className="mt-3 text-center">
                    <button className='btn btn-primary rounded-0' onClick={handleChangePackage}>
                        <i className='fa fa-check me-2'></i> ยืนยันการสมัคร
                    </button>
                </div>
            </div>
        </Modal>
    </div>
)
}) 

export default SideBar