import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import Header from '../components/Header'
import config from '../config';
import axios from 'axios';
import Modal from '../components/Modal';
export default function BillSaleSumPerDay() {
    const [currentYear, setCurrentYear] = useState(() => {
        let mydate = new Date();
        return mydate.getFullYear();
    });
    const [arrayYear, setArrYear] = useState(() => {
        let arr = [];
        let myDate = new Date();
        let currentYear = myDate.getFullYear();
        let beforeYear = currentYear - 5

        for (let i = beforeYear; i <= currentYear; i++) {
            arr.push(i)
        }
        return arr;
    });
    const [currentMonth, setCurrentMonth] = useState(() => {
        let mydate = new Date();
        return mydate.getMonth() + 1
    })
    const [arrayMonth, setArrMonth] = useState(() => {
        let arr = [
            { value: 1, label: "มกราคม" },
            { value: 2, label: "กุมภาพันธ์" },
            { value: 3, label: "มีนาคม" },
            { value: 4, label: "เมษายน" },
            { value: 5, label: "พฤษภาคม" },
            { value: 6, label: "มิถุนายน" },
            { value: 7, label: "กรกฏาคม" },
            { value: 8, label: "สิงหาคม" },
            { value: 9, label: "กันยายน" },
            { value: 10, label: "ตุลาคม" },
            { value: 11, label: "พฤศจิกายน" },
            { value: 12, label: "ธันวาคม" },
        ]
        return arr;
    });
    const [billSales, setBillSales] = useState([]);
    const [currentBillSale, setCurrentBillSale] = useState({});
    const [billSaleDetails, setBillSaleDetails] = useState([]);

    useEffect(() => {
        handleShowReport()
    }, []);

    const handleShowReport = async () => {
        try {
            const path = `${config.api_path}/billsale/listByYearAndMonth?year=${currentYear}&month=${currentMonth}`
            const response = await axios.get(path, config.headers())
            if (response.status === 200) {
                // console.log(response.data.results)
                setBillSales(response.data.results)
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div>
            <Template>
                <Header title="รายงานสรุปยอดขายรายวัน" breadMain="หน้าแรก" breadActive="รายงานสรุปยอดขายรายวัน" />
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-3">
                                <div className="input-group">
                                    <span className='input-group-text'>ปี </span>
                                    <select value={currentYear} className='form-control' onChange={e => setCurrentYear(e.target.value)}>
                                        {arrayYear.map((item, index) => (
                                            <option key={index} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="input-group">
                                    <span className='input-group-text'>เดือน</span>
                                    <select value={currentMonth} className='form-control' onChange={e => setCurrentMonth(e.target.value)}>
                                        {arrayMonth.map((item, index) => (
                                            <option key={index} value={item.value}>{item.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <button onClick={handleShowReport} className='btn btn-primary mt-2'>
                                    <i className='fa fa-check me-2'></i>
                                    แสดงรายการขาย
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className='table-responsive-sm'>
                                <table className='mt-2 table table-bordered table-hover table-sm text-nowrap'>
                                    <thead>
                                        <tr>
                                            <th width={150}></th>
                                            <th scope="col" width={100} className='text-end'>วันที่</th>
                                            <th scope='col' width={100} className='text-end'>ยอดขาย</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billSales !== undefined && billSales.length > 0 ? (
                                            <>
                                                {billSales.map((billItem, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td>
                                                                <button className='btn btn-primary me-2 w-100' onClick={e => setCurrentBillSale(billItem.results)} data-toggle="modal" data-target="#modalBillSaleDetail"  >
                                                                    <i className='fa fa-file-alt me-2'></i> รายละเอียด
                                                                </button>
                                                            </td>
                                                            <td className='text-end'>{billItem.day}</td>
                                                            <td className='text-end'>{parseInt(billItem.sum).toLocaleString('th-TH')}</td>

                                                        </tr>
                                                    </React.Fragment>
                                                ))}
                                                <tr>
                                                    <td colSpan={3} className='text-end'>
                                                        ยอดขายรวม <b className='text-success'> {billSales.reduce((total, billItem) => total + billItem.sum, 0).toLocaleString('th')} </b>
                                                    </td>
                                                </tr>
                                            </>
                                        ) : (
                                            <tr><td colSpan={6}>ไม่มีข้อมูล</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal id="modalBillSaleDetail" title="รายการขาย" modalSize="modal-lg"  >
                    <div className='mt-2 table-responsive-sm'>
                        <table className='mt-2 table table-bordered table-hover table-sm text-nowrap'>
                            <thead>
                                <tr className='text-center'>
                                    <th></th>
                                    <th>เลขบิล</th>
                                    <th width={150}>จำนวนขายต่อรายการ</th>
                                    <th width={150} className='text-end'>วันที่</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBillSale.length > 0 && currentBillSale != undefined ?
                                    currentBillSale.map((Item, index) =>
                                    (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>
                                                    <button className='btn btn-primary me-2 w-100' onClick={e => setBillSaleDetails(Item.billSaleDetails)} data-toggle="modal" data-target="#modalBillSaleDetailItem"  >
                                                        <i className='fa fa-file-alt me-2'></i> รายละเอียด
                                                    </button>
                                                </td>

                                                <td className='text-center'>{Item.id}</td>
                                                <td className='text-center'>{parseInt(Item.billSaleDetails.length).toLocaleString('th-TH')} </td>
                                                <td className='text-end'>{new Date(Item.createdAt).toLocaleString('th-TH')}</td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                    ) : <tr><td colSpan={4} className='text-center'>ไม่มีข้อมูลรายการขาย</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Modal>

                <Modal id="modalBillSaleDetailItem" title="รายละเอียดบิลการขาย" modalSize="modal-lg">
                    
                    <div className='mt-2 table-responsive-sm'>
                        <table className='mt-2 table table-bordered table-hover table-sm text-nowrap'>
                            <thead>
                                <tr className='text-center'>
                                    <th>ลำดับ</th>
                                    <th>barcode</th>
                                    <th>ชื่อสินค้า</th>
                                    <th className='text-end'>ราคาสินค้า</th>
                                    <th className='text-end'>จำนวนสินค้า</th>
                                    <th className='text-end'>ยอดรวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billSaleDetails !== undefined && billSaleDetails.length > 0 ? (
                                    <>
                                        {billSaleDetails.map((billItem, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td>{billItem.product.barcode}</td>
                                                    <td>{billItem.product.name}</td>
                                                    <td className='text-end'>{parseInt(billItem.price).toLocaleString('th')}</td>
                                                    <td className='text-end'>{billItem.qty}</td>
                                                    <td className='text-end'>{parseInt(billItem.price * billItem.qty).toLocaleString('th')}</td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                        <tr>
                                            <td colSpan={5} className='text-end'>ยอดขายรวม</td>
                                            <td className='text-end'>
                                                {billSaleDetails.reduce((total, billItem) => total + billItem.price * billItem.qty, 0).toLocaleString('th')}
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr><td colSpan={6}>ไม่มีข้อมูล</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </Template>
        </div>
    )
}
