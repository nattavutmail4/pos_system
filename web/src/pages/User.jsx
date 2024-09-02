import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import Header from '../components/Header';
import axios from 'axios';
import config from '../config';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';

export default function User() {
  document.title = 'ระบบจัดการร้านค้าออนไลน์';

  const [InputValue, setInputValue] = useState({
    username: '',
    name: '',
    pwd: '',
    oldpwd:"",
    level: '',
  });
  const [password,setPassword] = useState("")
  const [passwordConfm,setPasswordCfm] = useState("")
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchDataMember();
  }, []);

  const fetchDataMember = async () => {
    try {
      const response = await axios.get(`${config.api_path}user/list`, config.headers());
      if (response.status === 200) {
        setUsers(response.data.body);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = async () => {
    const btn = document.getElementsByClassName('btnClose');
    for (let i = 0; i < btn.length; i++) {
      btn[i].click();
    }
  };

  const ClearForm = () => {
    // setInputValue({
    //   username: '',
    //   pwd: '',
    //   name: '',
    //   level: '',
    // });
    setInputValue({})
  };

  const changePassword = (item) => {
    if(item.length > 0 ) {
      setPassword(item)
      CompassPassword()
    }
  };
  const changePassCfm = (item) => {
    if(item.length > 0){
      setPasswordCfm(item)
      CompassPassword()
    }
  }
  
  const CompassPassword  = () => { 
    if(password == passwordConfm){
      setInputValue({ ...InputValue, pwd: password })
    }else{
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกรหัสผ่านทั้งสองช่องให้ตรงกัน',
      })
    }
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const register = await axios.post(`${config.api_path}user/insert`, InputValue, config.headers());
      if (register.status === 200) {
        Swal.fire({
          icon: 'success',
          title: register.data.message,
          text: register.data.message,
        })
        ClearForm()
        handleClose()
        fetchDataMember()
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error.response.data.message}`,
      });
    }
  };

  const handleEditSubmit = async(e) => {
    e.preventDefault();
    try {
      Swal.fire({
        icon: 'question',
        title: 'แก้ไขข้อมูลสมาชิก',
        text: 'ยืนยันการแก้ไขข้อมูลสมาชิก',
        confirmButtonColor: '#3085d6',
        showDenyButton: true,
      }).then(async(res) => {
        if (res.isConfirmed) {
          const response =  await axios.put(`${config.api_path}user/edit/${InputValue.id}`, InputValue, config.headers())
          if (response.status === 200) {
            Swal.fire({
              icon:'success',
              title: response.data.message,
              text: response.data.message,
            })
            ClearForm()
            handleClose()
            fetchDataMember()
          }
        }else{
          Swal.fire({
            icon: 'error',
            title: 'ยกเลิกการแก้ไขข้อมูลสมาชิก',
          })
        }
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error.response.data.message}`,
      });
    }
  }

  const deleteUser  = async(id) => {
    try {
      Swal.fire({
        icon: 'question',
        title: 'ลบข้อมูลสมาชิก',
        text: 'ยืนยันการลบข้อมูลสมาชิก',
        confirmButtonColor: '#3085d6',
        showDenyButton: true,
      }).then(async(isCfm) => {
        if (isCfm.isConfirmed) {
          const url = `${config.api_path}user/delete/${id}`
          const response =  await axios.delete(`${url}`, config.headers())
          if (response.status === 200) {
            Swal.fire({
              icon:'success',
              title: response.data.message,
              text: response.data.message,
            })
            fetchDataMember()
          }
        }else{
          Swal.fire({
            icon: 'error',
            title: 'ยกเลิกการลบข้อมูลสมาชิก',
          })
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error.response.data.message}`,
      });
    }
  }

  const UpdatePwd =  async(e) => {
    e.preventDefault();
    try {
      Swal.fire({
        icon: 'question',
        title: 'แก้ไขรหัสผ่าน',
        text: 'ยืนยันการแก้ไขรหัสผ่าน',
        confirmButtonColor: '#3085d6',
        showDenyButton: true,
      }).then(async(isCfm) => {
        if(isCfm) {
          console.log(InputValue)
            const url = `${config.api_path}user/editPass/${InputValue.id}`
            const response = await axios.put(url,{id: InputValue.id, oldpwd: InputValue.oldpwd, newpwd: InputValue.pwd},config.headers());
            if (response.status === 200) {
              Swal.fire({
                icon:'success',
                title: response.data.message,
                text: response.data.message,
              })
              ClearForm()
              handleClose()
              fetchDataMember()
            }
        }else{
          Swal.fire({
            icon: 'error',
            title: 'ยกเลิกการแก้ไขรหัสผ่าน',
          })
        }
      })
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error.response.data.message}`,
      })
    }
  }

  return (
    <div>
      <Template>
        <Header title="จัดการข้อมูลผู้ใช้" breadMain="หน้าแรก" breadActive="จัดการข้อมูลผู้ใช้" />
        <div className="card">
          <div className="card-header bg-dark">
            <h3 className="card-title"><i className="nav-icon fas fa-user"></i> ข้อมูลสมาชิก</h3>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse" title="ย่อ">
                <i className="fas fa-minus text-white"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="float-right">
              <button className='btn btn-sm btn-dark' data-bs-toggle="modal" data-bs-target="#modalUser"> <i className='fa fa-add'></i> เพิ่มสมาชิก</button>
            </div><br />
            <div className=" mt-3 table-responsive-sm">
              <table className='mt-5 table  table-bordered table-hover table-sm text-nowrap'>
                <thead className="text-center">
                  <tr>
                    <th scope="col">ลำดับ</th>
                    <th scope='col'>ชื่อผู้ใช้</th>
                    <th scope="col">Username</th>
                    <th scope="col">ระดับ</th>
                    <th scope="col">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map((item, index) => (
                    <tr key={index} className='text-center'>
                      <td>{index +1}</td>
                      <td>{item.name}</td>
                      <td>{item.user}</td>
                      <td>{item.level}</td>
                      <td>
                        <button type="button" className='btn btn-sm btn-dark me-2' data-bs-toggle="modal" data-bs-target="#modalEditUser" tabIndex={item.id} onClick={e=> setInputValue(item)}> <i className="fas fa-edit"></i> </button>
                        <button type="button" className="btn btn-sm btn-warning me-2" data-bs-toggle="modal" data-bs-target="#modalEditPwd" tabIndex={item.id} onClick={e=> setInputValue(item)}> <i className="fa-solid fa-key"></i> </button>
                        <button type="button" className='btn btn-sm btn-danger me-2' onClick={(e) => deleteUser(item.id)} tabIndex={item.id}> <i className="fa-solid fa-trash"></i> </button>
                      </td>
                    </tr>
                  )) :
                    <tr className='text-center'><td colSpan={5}>ไม่มีข้อมูล</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal id="modalUser" title="เพิ่มข้อมูลสมาชิก">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="form-group col-sm-12">
                <label >ชื่อผู้ใช้ <span className='text-danger'> *</span></label>
                <input type="text" className="form-control" id="username" name="username" value={InputValue.username || ''} placeholder="ชื่อผู้ใช้" required onChange={e => setInputValue({ ...InputValue, username: e.target.value })} maxLength={10} />
              </div>
              <div className="form-group col-sm-12">
                <label >รหัสผ่าน <span className='text-danger'> *</span></label>
                <input type="password" className="form-control" id="password" name="password"   placeholder="รหัสผ่าน" required onBlur={e => changePassword(e.target.value)} />
              </div>
              <div className="form-group col-sm-12">
                <label >ยืนยันรหัสผ่าน <span className='text-danger'> *</span></label>
                <input type="password" className="form-control" id="confirmpwd" name="confirmpwd"  placeholder="ยืนยันรหัสผ่าน" required onBlur={e => changePassCfm(e.target.value)} maxLength={10} />
              </div>
              <div className="form-group col-sm-12">
                <label >ชื่อนามสกุล <span className='text-danger'> *</span></label>
                <input type="text" className="form-control" id="name" name="name" placeholder="ชื่อนามสกุล" value={InputValue.name || ''} required onChange={e => setInputValue({ ...InputValue, name: e.target.value })} />
              </div>
              <div className="form-group col-sm-12">
                <label htmlFor="level">ระดับ</label>
                <select required id="level" name='level' className='form-control ' value={InputValue.level || ''} onChange={e => setInputValue({ ...InputValue, level: e.target.value })}>
                  <option value="">เลือกระดับ</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary w-100">บันทึก</button>
            </div>
          </form>
        </Modal>

        <Modal id="modalEditUser" title="แก้ไขข้อมูลสมาชิก">
          <form onSubmit={handleEditSubmit}>
            <div className="row">
              <div className="form-group col-sm-12">
                <label >ชื่อผู้ใช้ <span className='text-danger'> *</span></label>
                <input type="text" className="form-control" id="editusername" name="editusername" value={InputValue.user || ''} placeholder="ชื่อผู้ใช้" disabled onChange={e => setInputValue({ ...InputValue, username: e.target.value })} maxLength={10} />
              </div>
              <div className="form-group col-sm-12">
                <label >ชื่อนามสกุล <span className='text-danger'> *</span></label>
                <input type="text" className="form-control" id="editname" name="editname" placeholder="ชื่อนามสกุล" value={InputValue.name || ''} required onChange={e => setInputValue({ ...InputValue, name: e.target.value })} />
              </div>
              <div className="form-group col-sm-12">
                <label htmlFor="editlevel">ระดับ</label>
                <select required id="editlevel" name='editlevel' className='form-control ' value={InputValue.level || ''} onChange={e => setInputValue({ ...InputValue, level: e.target.value })}>
                  <option value="">เลือกระดับ</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary w-100">แก้ไขข้อมูล</button>
            </div>
          </form>
        </Modal>

        <Modal id="modalEditPwd" title ="แก้ไขรหัสผ่าน">
          <form onSubmit={UpdatePwd}>
            <div className="row">
              <div className="form-group col-sm-12">
                <label >ชื่อผู้ใช้ <span className='text-danger'> *</span></label>
                <input type="text" className="form-control" id="showUser" name="showUser" value={InputValue.user || ''} placeholder="ชื่อผู้ใช้" disabled onChange={e => setInputValue({ ...InputValue, username: e.target.value })} maxLength={10} />
              </div>
              <div className="form-group col-sm-12">
                <label >รหัสผ่านเก่า<span className='text-danger'> *</span></label>
                <input type="password" className="form-control" id="edit_password" name="edit_password"   placeholder="รหัสผ่านเก่า" required onBlur={e => setInputValue({...InputValue, oldpwd :e.target.value})} />
              </div>
              <div className="form-group col-sm-12">
                <label >ยืนยันรหัสผ่านใหม่<span className='text-danger'> *</span></label>
                <input type="password" className="form-control" id="new_pwd" name="new_pwd"  placeholder="ยืนยันรหัสผ่านใหม่" required onBlur={e => setInputValue({...InputValue,pwd: e.target.value})} maxLength={10} />
              </div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary w-100">แก้ไขรหัสผ่าน</button>
            </div>
          </form>
        </Modal>

      </Template>
    </div>
  );
}
