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
    const [results, setresults] = useState([]);
    useEffect(() => {
        fetchData()
    },[])
    const fetchData = async() => {
        try {
            const response = await axios.get(`${config.api_path}changepackage/reportSumSalePerYear`, config.headers());
            if (response.status === 200) {
                setresults(response.data.results)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const [selectedYear, setSelectedYear] = useState({});

    return (
        <div>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">รายงานยอดขายรายปี</div>
                    </div>
                    <div className="card-body">
                        <div className="row mt-3">
                            <div className='table-response-sm'>
                                <table className='table table-bordered table-striped'>
                                    <thead>
                                        <tr>
                                            <th width="30px" className='text-center'>ปี</th>
                                            <th width="100px" className='text-end'>ยอดขาย</th>
                                            <th width={100} className='text-center'>รายละเอียด</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.length > 0 ? (
                                            <>
                                                {results.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td className='text-center'>{item.year}</td>
                                                            <td className='text-end'>{parseInt(item.sum).toLocaleString('th-TH')}</td>
                                                            <td className='text-center'>
                                                                <button className='btn btn-primary btn-lg rounded-2 '
                                                                    data-target="#modalInfo" data-toggle="modal"
                                                                    onClick={(e) => setSelectedYear(item)}
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
                                    <th className='text-center'> เบอร์โทรศัพท์ฺ</th>
                                    <th className='text-center'>แพกเกจ</th>
                                    <th className='text-center'>ค่าบริการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                 { selectedYear.results != undefined ? selectedYear.results.map((item,index) => (
                                     <React.Fragment key={index}>
                                         <tr>
                                             <td className='text-center'>{new Date(item.createdAt).toLocaleDateString('th-TH')}</td>
                                             <td className='text-center'>{new Date(item.payDate).toLocaleDateString('th-TH')} {item.payHour}.{item.payMinute}</td>
                                             <td className='text-center'> {item.member.name}</td>
                                             <td className='text-center'> {item.member.phone}</td>
                                             <td className='text-center'>{item.package.name}</td>
                                             <td className='text-center'>{parseInt(item.package.price).toLocaleString('th-TH')}</td>
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
