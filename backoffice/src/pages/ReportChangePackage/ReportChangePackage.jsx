import React, { useEffect, useState } from 'react'
import Template from '../../components/Template'
import axios from 'axios'
import config from '../../config'
import Swal from 'sweetalert2'
import Modal from '../../components/Modal'
export default function ReportChangePackage() {
    const [changepackages, setChangepackages] = useState([]);
    const [arrHour, setHour] = useState(() => {
        let arr =[];
        for(let i = 0; i <= 23; i++){
            arr.push(i);
        }
        return arr;
    });
    const [arrminute, setMinute] = useState(() => {
        let arr =[];
        for(let i = 0; i <= 59; i++){
            arr.push(i);
        }
        return arr;
    })
    const [ChangePackage, setPackageId] = useState([]);
    const [payDate, setPayDate] = useState(() => {
        const myDate = new Date();
        return myDate.toISOString().split('T')[0]; // เราต้องการ format วันที่ให้อยู่ในรูปแบบ YYYY-MM-DD
    });
    const [payHour, setPayHour] = useState(() => {
        const d = new Date();
        return d.getHours();
    })
    const [payMinute, setPayMinute] = useState(() => {
        const d = new Date();
        return d.getMinutes()
    })
    const [remark ,setremark] = useState();

    useEffect(() => {
        changePackageData()
    }, [])
    const changePackageData = async() => {
        try {
            const results = await axios.get(`${config.api_path}changepackage/list`, config.headers());

            if (results.status === 200) {
                setChangepackages(results.data.body)
            }
        } catch (error) {
            // console.log(error)
        }
    }
     
    const handleSave = async(e) => {
        e.preventDefault();
        try {
            const payload = {
                id:ChangePackage.id,
                payDate: payDate,
                hour: payHour,
                minute: payMinute,
                remark: remark
            }
            Swal.fire({
                icon: 'question',
                title: 'บันทึกข้อมูล',
                text: 'ยืนยันการบันทึกข้อมูลการชำระเงิน',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then(async (res) => {
                if(res.isConfirmed) {
                    const send = await axios.post(`${config.api_path}changepackage/save`,payload,config.headers());
                    if(send.status === 200) {
                        Swal.fire({
                            icon:'success',
                            title: 'บันทึกข้อมูล',
                            text:  send.data.message,
                        })
                        changePackageData()
                        const btns = document.getElementsByClassName('btnClose');
                        for(let i =0; i< btns.length; i++){
                            btns[i].click();
                        }
                    }
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการบันทึกข้อมูลการชำระเงิน',
                        confirmButtonColor: '#3085d6',
                        showDenyButton: true,
                    })
                }
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'อัพเดทข้อมูลไม่สำเร็จ',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            })
        }
    };
    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        รายงานคนทีขอเปลี่ยนแพคเกจ
                    </div>
                    <div className="card-body">
                        <div className='table-response-sm'>
                            
                            <table className='table table-bordered table-striped'>
                                <thead>
                                    <tr>
                                        <th className='text-center'>ชื่อ</th>
                                        <th className='text-center'> เบอร์โทร</th>
                                        <th className='text-center'>วันที่ขอเปลี่ยนแพคเกจ</th>
                                        <th className="text-end">แพคเกจที่ต้องการ</th>
                                        <th className="text-end">ค่าบริการต่อเดือน</th>
                                        <th className='text-center'>สถานะ</th>
                                        <th width={150}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                   {changepackages.length > 0 && changepackages != []  ? changepackages.map((Item,index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                 <td className='text-center'>{Item.member.name}</td>
                                                 <td className='text-center'>{Item.member.phone}</td>
                                                 <td className='text-center'>{new Date(Item.createdAt).toLocaleString('th-TH')}</td>
                                                 <td className="text-end">{Item.package.name}</td>
                                                 <td className="text-end"> { parseInt(Item.package.price).toLocaleString('th-TH')}</td>
                                                 <td className='text-center'>{Item.status}</td>
                                                 <td>
                                                    <button className='btn  btn-sm btn-success roundend' onClick={e => setPackageId(Item)} data-target="#modalPay" data-toggle="modal">
                                                         <i className="fa fa-check me-2"></i> 
                                                         ได้รับเงินแล้ว
                                                    </button>
                                                 </td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                   ) : <tr className='text-center'><td colSpan={7}><i className="fa-solid fa-circle-exclamation me-2 text-danger"></i> ไม่มีข้อมูล</td></tr>}
                               
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Template>
            <Modal id="modalPay" icon="fa fa-file-alt me-1" title=" บันทึกข้อมูล เมื่อได้รับการชำระเงิน">
               <div>
                    <label htmlFor="payDate">วันที่ชำระเงิน</label>
                    <input type="date" value={payDate} className='form-control' onChange={e => setPayDate(e.target.value)} />

               </div>
               <div>
                    <label htmlFor="payTime">เวลา</label>
                    <div className="row">
                        <div className="col-6">
                            <div className="input-group">
                                <div className="input-group-text">ชั่วโมง</div>
                                <select value={payHour} className='form-control' onChange={e => setPayHour(e.target.value)}>
                                    { arrHour.length > 0 ? arrHour.map((item,index) => (
                                        <option key={index} value={item}>{item}</option>
                                    )): null}
                                </select>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="input-group">
                                <div className="input-group-text">นาที</div>
                                <select  value={payMinute} className='form-control' onChange={e => setPayMinute(e.target.value)}>
                                     { arrminute.length > 0 ? arrminute.map((item,index) => (
                                        <option key={index} value={item}>{item}</option>
                                     )): null}
                                </select>
                            </div>
                        </div>
                    </div>
               </div>
               <div className='mt-3'>
                    <label htmlFor="payRemart">หมายเหตุ</label>
                    <input type="text" className='form-control' onChange={e => setremark(e.target.value)} />
               </div>
               <div className='mt-3'>
                    <button onClick={handleSave} className='btn btn-primary w-100 rounded'>
                       <i className='fa fa-check me-2'></i>
                       บันทึกข้อมูลการชำระเงิน
                    </button>
               </div>
            </Modal>
        </>
    )
}
