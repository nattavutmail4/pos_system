import React, { useEffect, useState } from 'react'
import Template from '../../components/Template'
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../../config';

import Modal from '../../components/Modal'

export default function index() {
    const [year, setYear] = useState(() => {
        let arr = [];
        let d = new Date()
        let currentYear = d.getFullYear()
        let lastYear = currentYear - 5
        for (let i = lastYear; i <= currentYear; i++) {
            arr.push(i)
        }
        return arr
    });

    const [selectedYear, setSelectedYear] = useState(() => {
        return new Date().getFullYear()
    })

    const [moths, setMonths] = useState(() => {
        return [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฏาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
        ]
    });

    const [selectedMonth, setSelectedMonth] = useState(() => {
        return new Date().getMonth() + 1;
    })

    const [results, setResults] = useState([]);
    const [selectedDay, setSelectedDay] = useState({});
    const handlerShowReport = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                month: selectedMonth,
                year: selectedYear
            }
            const res  = await axios.post(`${config.api_path}changepackage/reportSumSalePerDay`, payload, config.headers())
            

            if (res.status === 200) {
                setResults(res.data.results);
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message
            })
        }
    }
    return (
        <div>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">รายงานยอดขายรายวัน</div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-2">
                                <div className="input-group">
                                    <span className="input-group-text">ปี</span>
                                    <select value={selectedYear} className="form-control" onChange={e => setSelectedYear(e.target.value)}>
                                        {year.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <option value={item}>{item}</option>
                                            </React.Fragment>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="input-group">
                                    <span className="input-group-text">เดือน</span>
                                    <select value={selectedMonth} className="form-control" onChange={e => setSelectedMonth(e.target.value)}>
                                        {moths.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <option value={index + 1}>{item}</option>
                                            </React.Fragment>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-8">
                                <button className='btn btn-primary btn-lg  mt-1 rounded-0' onClick={handlerShowReport}>
                                    <i className='fa fa-check me-2'></i>
                                    แสดงรายการ
                                </button>
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className='table-response-sm'>
                                <table className='table table-bordered table-striped'>
                                    <thead>
                                        <tr>
                                            <th width="30px" className='text-center'>วันที่</th>
                                            <th width="100px" className='text-end'>ยอดรวมรายได้</th>
                                            <th width={100} className='text-center'>รายละเอียด</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.length > 0 ? (
                                            <>
                                                {results.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td className='text-center'>{item.day}</td>
                                                            <td className='text-end'>{parseInt(item.sum).toLocaleString('th-TH')}</td>
                                                            <td className='text-center'>
                                                                <button className='btn btn-success btn-lg rounded-2 '
                                                                    data-target="#modalInfo" data-toggle="modal"
                                                                    onClick={(e) => setSelectedDay(item)}
                                                                >
                                                                    <i className='fa fa-file-alt me-2'></i> รายละเอียด
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}
                                                <tr>

                                                    <td colSpan={3} className='text-end'>
                                                        ยอดขายรวมเดือนนี้ <b className='text-success me-2'> {results.reduce((total, item) => total + item.sum, 0).toLocaleString('th')} </b>
                                                    </td>
                                                </tr>
                                            </>
                                        ) : <tr><td className='text-center' colSpan={3}>ไม่มีข้อมูล</td></tr>}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal id="modalInfo" icon="fa fa-file-alt" title="รายละเอียด" modalSize="modal-lg">
                    <div className='table-response-sm'>
                        <table className='table table-striped table-bordered table-hover'>
                            <thead>
                                <tr>
                                    <th className='text-center'>วันที่สมัคร</th>
                                    <th className='text-end'>วันที่ชำระเงิน</th>
                                    <th className='text-center'>ผู้สมัคร</th>
                                    <th className='text-center'>แพกเกจ</th>
                                    <th className='text-center'>ค่าบริการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                 { selectedDay.results != undefined ? selectedDay.results.map((item,index) => (
                                     <React.Fragment key={index}>
                                         <tr>
                                             <td className='text-center'>{new Date(item.createdAt).toLocaleDateString('th-TH')}</td>
                                             <td className='text-center'>{new Date(item.payDate).toLocaleDateString('th-TH')} {item.payHour}.{item.payMinute}</td>
                                             <td className='text-center'> {item.member.name}</td>
                                             <td className='text-center'>{item.package.name}</td>
                                             <td className='text-end'>{parseInt(item.package.price).toLocaleString('th-TH')}</td>
                                         </tr>
                                     </React.Fragment>
                                 )): <tr><td colSpan={4} className='text-center'> <i className=' fa fa-alert-alt me-2'></i> ไม่มีข้อมูล</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </Template>
        </div>
    )
}
