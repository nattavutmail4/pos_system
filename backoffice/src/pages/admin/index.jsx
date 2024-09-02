import React from 'react'
import Template from '../../components/Template'
import axios from 'axios'
import config from '../../config'
import Swal from 'sweetalert2'
import Modal from '../../components/Modal'
export default function index() {
    const [results, setResults] = React.useState([]);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [level, setLevel] = React.useState(['admin', 'sub admin']);
    const [selectedAdmin, setSelectedAdmin] = React.useState({
        name: "",
        usr: "",
        pwd: "",
        cfpwd: "",
        email: "",
        level: "admin"
    });
    const [input, setInput] = React.useState({
        name: "",
        usr: "",
        pwd: "",
        cfpwd: "",
        email: "",
        level: "admin", // ใช้เป็นค่าเริ่มต้นสำหรับ select dropdown
    });


    React.useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.api_path}admin/list`, config.headers());
            if (res.status === 200) {
                setResults(res.data.body);
            }
        } catch (error) {
            Swal.fire('Error', 'Cannot fetch data', 'error');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (input.pwd !== input.cfpwd) {
            setErrorMessage('รหัสผ่านไม่ตรงกัน');
            return; // หยุดการทำงานถัดไปหากรหัสผ่านไม่ตรงกัน
        }

        try {
            setErrorMessage(''); // ล้างข้อความข้อผิดพลาด
            const response = await Swal.fire({
                icon: 'question',
                title: 'บันทึกข้อมูล',
                text: 'ยืนยันการบันทึกข้อมูล',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            });

            if (response.isConfirmed) {
                const send = await axios.post(`${config.api_path}admin/save`, input, config.headers());
                if (send.status === 200) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'บันทึกข้อมูลสำเร็จ',
                        text: send.data.message,
                        confirmButtonColor: '#3085d6',
                    });
                    setInput({ name: "", usr: "", pwd: "", cfpwd: "", email: "", level: "admin" }); // รีเซ็ตฟอร์ม
                    fetchData(); // รีเฟรชข้อมูล
                    const btn = document.getElementsByClassName('btnClose');
                    for (let i = 0; i < btn.length; i++) {
                        btn[i].click();
                    }
                }
            } else {
                Swal.fire('ยกเลิก', 'การบันทึกข้อมูลถูกยกเลิก', 'error');
            }
        } catch (error) {
            console.error("Error during save operation:", error);
            Swal.fire('Error', 'Error during save operation', 'error');
        }
    };

    const deleteUser = async (item) => {

        try {
            setErrorMessage(''); // ล้างข้อความข้อผิดพลาด
            const response = await Swal.fire({
                icon: 'question',
                title: 'ลบข้อมูลสมาชิก',
                text: 'ยืนยันการลบข้อมูลสมาชิก',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then(async (crf) => {
                if (crf.isConfirmed) {
                    const url = `${config.api_path}admin/destroy/${item.id}`
                    const response = await axios.delete(`${url}`, config.headers())
                    if (response.status === 200) {
                        await Swal.fire({
                            icon: 'success',
                            title: response.data.message,
                            text: response.data.message,
                            confirmButtonColor: '#3085d6',
                        });
                        fetchData(); // รีเฟรชข้อมูล
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการลบข้อมูลสมาชิก',
                        confirmButtonColor: '#3085d6',
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setErrorMessage(''); // ล้างข้อความข้อผิดพลาด
            const response = await Swal.fire({
                icon: 'question',
                title: 'บันทึกข้อมูล',
                text: 'ยืนยันการบันทึกข้อมูล',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then(async(rf) => {
                if(rf.isConfirmed){
                    const url = `${config.api_path}admin/update/${selectedAdmin.id}`
                    const response =  await axios.put(`${url}`, selectedAdmin, config.headers())
                    if (response.status === 200) {
                        await Swal.fire({
                            icon:'success',
                            title: response.data.message,
                            text: response.data.message,
                            confirmButtonColor: '#3085d6',
                        });
                        fetchData(); // รีเฟรชข้อมูล
                        const btn = document.getElementsByClassName('btnClose');
                        for (let i = 0; i < btn.length; i++) {
                            btn[i].click();
                        }
                    }
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการบันทึกข้อมูล',
                        confirmButtonColor: '#3085d6',
                    })
                }
            }).catch(error =>{
               Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.response.data.message,
                confirmButtonColor: '#3085d6',
               })
            })
        }catch(error){
            Swal.fire({
                icon: 'error',
                title: 'error',
                text:  error.response.data.message,
                confirmButtonColor: '#3085d6',
            })
        }
    }

    const handleUpdatePass = async(e) => {
        e.preventDefault();
        try {
            setErrorMessage(''); // ล้างข้อความข้อผิดพลาด
            const response = await Swal.fire({
                icon: 'question',
                title: 'บันทึกข้อมูล',
                text: 'ยืนยันการบันทึกข้อมูล',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then(async(rf) => {
                if(rf.isConfirmed){
                    const url = `${config.api_path}admin/editpass/${selectedAdmin.id}`
                    const response =  await axios.put(`${url}`, selectedAdmin, config.headers())
                    if (response.status === 200) {
                        await Swal.fire({
                            icon:'success',
                            title: response.data.message,
                            text: response.data.message,
                            confirmButtonColor: '#3085d6',
                        });
                        fetchData(); // รีเฟรชข้อมูล
                        const btn = document.getElementsByClassName('btnClose');
                        for (let i = 0; i < btn.length; i++) {
                            btn[i].click();
                        }
                    }
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการบันทึกข้อมูล',
                        confirmButtonColor: '#3085d6',
                    })
                }
            }).catch(error =>{
               Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.response.data.message,
                confirmButtonColor: '#3085d6',
               })
            })
        }catch(error){
            Swal.fire({
                icon: 'error',
                title: 'error',
                text:  error.response.data.message,
                confirmButtonColor: '#3085d6',
            })
        }
    }
    return (
        <div>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">ผู้ใช้ระบบ</div>
                    </div>
                    <div className="card-body">
                        <div className="row mt-3">
                            <div className='float-end'>
                                <div className="row">
                                    <div className="text-end">
                                        <button className='btn btn-primary' data-target="#modalRegister" data-toggle="modal">เพิ่มข้อมูลผู้ใช้</button>
                                    </div>
                                </div>
                            </div>
                            <div className='table-response-sm mt-3'>
                                <table className='table table-bordered table-striped'>
                                    <thead>
                                        <tr>
                                            <th width="30px" className='text-center'>ชื่อ</th>
                                            <th width="100px" className='text-center'>user</th>
                                            <th width={100} className='text-center'>level</th>
                                            <th width={100} className='text-center'>email</th>
                                            <th width={100} className='text-center'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.length > 0 ? results.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td className='text-center'>{item.name}</td>
                                                    <td className='text-center'>{item.usr}</td>
                                                    <td className='text-center'>{item.level}</td>
                                                    <td className='text-center'>{item.email}</td>
                                                    <td className='text-center'>
                                                        <button className='btn btn-primary me-2' data-target="#modalEdit" data-toggle="modal" onClick={() => setSelectedAdmin(item)}>แก้ไข</button>
                                                        <button className='btn btn-primary me-2' data-target="#modalEditPass" data-toggle="modal" onClick={() => setSelectedAdmin(item)}>เปลี่ยนรหัสผ่าน</button>
                                                        <button className='btn btn-danger' onClick={() => deleteUser(item)}>ลบ</button>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        )) : <tr><td colSpan={5}>ไม่มีข้อมูล</td></tr>}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal id="modalRegister" icon="fa fa-user-alt" title="แบบฟอร์มเพิ่มผู้ใช้" modalSize="modal-lg">
                    <form onSubmit={handleSave}>
                        <div>
                            <label>ชื่อ</label>
                            <input type="text" className='form-control' onChange={e => setInput({ ...input, name: e.target.value })} required />
                        </div>
                        <div className='mt-3'>
                            <label > username</label>
                            <input type="text" className='form-control' onChange={e => setInput({ ...input, usr: e.target.value })} required />
                        </div>
                        <div className='mt-3'>
                            <label > password</label>
                            <input type="password" className='form-control' onChange={e => setInput({ ...input, pwd: e.target.value })} required />
                        </div>
                        <div className='mt-3'>
                            <label > confirm password</label>
                            <input type="password" className='form-control' onChange={e => setInput({ ...input, cfpwd: e.target.value })} required />
                            <span className='text-danger'>{errorMessage}</span>
                        </div>
                        <div className='mt-3'>
                            <label > email</label>
                            <input type="text" className='form-control' onChange={e => setInput({ ...input, email: e.target.value })} required />
                        </div>
                        <div className='mt-3'>
                            <label > ระดับ</label>
                            <select value={input.level} className='form-control' onChange={e => setInput({ ...input, level: e.target.value })}>
                                {level.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mt-3'>
                            <button className='btn btn-primary w-100 rounded' >
                                <i className='fa fa-check me-2'></i>
                                บันทึกข้อมูลผู้ใช้
                            </button>
                        </div>
                    </form>
                </Modal>

                <Modal id="modalEdit" icon="fa fa-user-alt" title="แก้ไขข้อมูล" modalSize="modal-lg">
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label>ชื่อ</label>
                            <input type="text" className='form-control' value={selectedAdmin.name} onChange={e => setSelectedAdmin({ ...selectedAdmin, name: e.target.value })} required />
                        </div>
                        <div className='mt-3'>
                            <label > username</label>
                            <input type="text" className='form-control' value={selectedAdmin.usr} required disabled />
                        </div>

                        <div className='mt-3'>
                            <label > email</label>
                            <input type="text" className='form-control' value={selectedAdmin.email} onChange={e => setSelectedAdmin({ ...selectedAdmin, email: e.target.value })} required />
                        </div>
                        <div className='mt-3'>
                            <label > ระดับ</label>
                            <select value={selectedAdmin.level} className='form-control' onChange={e => setSelectedAdmin({ ...selectedAdmin, level: e.target.value })}>
                                {level.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mt-3'>
                            <button className='btn btn-primary w-100 rounded' >
                                <i className='fa fa-check me-2'></i>
                                บันทึกข้อมูลผู้ใช้
                            </button>
                        </div>
                    </form>

                </Modal>

                <Modal id="modalEditPass" icon="fa fa-user-alt" title="แก้ไขรหัสผ่าน" modalSize="modal-lg">
                    <form onSubmit={handleUpdatePass}>
                        <div>
                            <label>ชื่อ</label>
                            <input type="text" className='form-control' value={selectedAdmin.name} disabled required />
                        </div>
                        <div className='mt-3'>
                            <label > username</label>
                            <input type="text" className='form-control' value={selectedAdmin.usr} required disabled />
                        </div>
                        <div className='mt-3'>
                            <label > password</label>
                            <input type="password" className='form-control' value={selectedAdmin.pwd} required   onChange={e => setSelectedAdmin({ ...selectedAdmin, pwd: e.target.value })}/>
                        </div>

                        <div className='mt-3'>
                            <label > email</label>
                            <input type="text" className='form-control' value={selectedAdmin.email} disabled required />
                        </div>
                        <div className='mt-3'>
                            <label > ระดับ</label>
                            <select value={selectedAdmin.level} className='form-control' disabled required>
                                {level.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mt-3'>
                            <button className='btn btn-primary w-100 rounded' >
                                <i className='fa fa-check me-2'></i>
                                แก้ไขรหัสผ่าน
                            </button>
                        </div>
                    </form>

                </Modal>
            </Template>
        </div>
    )
}
