import React, { useEffect, useState, useRef } from 'react'
import Template from '../components/Template'
import Header from '../components/Header'
import axios from 'axios'
import Swal from 'sweetalert2'
import config from '../config'
import Modal from '../components/Modal'
import PrintJs from 'print-js'
export default function Sale() {
    const [products, setProducts] = useState([])
    const [billSale, setBillSale] = useState({})
    const [currentBill, setcurrentBill] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [item, setItem] = useState({})
    const [InputMoney, setInputMoney] = useState(0)
    const [LastBill, setLastBill] = useState({})
    const [TodayBill, setTodayBill] = useState([])
    const [SelectedBill, setSelectedBill] = useState({})
    const [memberInfo, setMemberInfo] = useState({});

    const saleRef = useRef() //อ้างอิงหา method
    useEffect(() => {
        fetchData()
        openBill()
        fetchBillSaleDetail()
        if (memberInfo.name !== undefined && LastBill!= {} && LastBill.billSaleDetails != undefined) {
            let slip = document.getElementById('slip')
            slip.style.display = 'block'
            PrintJs({
                printable: 'slip',
                type: 'html',
                maxWidth: 250,
            })
            slip.style.display = 'none'

        }
    }, [memberInfo,LastBill])

    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.api_path}product/listForSale`, config.headers());
            // const res = await axios.get(`${config.api_path}billsale/openBill`, config.headers());
            if (res.status === 200) {
                setProducts(res.data.body);
            }
            if (res.status === 200) {
                setProducts(res.data.result);
            }
        } catch (error) {
            console.error(error)

        }
    }
    const fetchBillSaleDetail = async () => {
        try {
            // currentBillInfo
            const res = await axios.get(`${config.api_path}billsale/currentBillInfo`, config.headers());
            if (res.status === 200) {
                setcurrentBill(res.data.body.billSaleDetails);
                sumtotalPrice(res.data.body.billSaleDetails)
            }
        } catch (error) {
            if (error.response.data.message === 'Product not found') {
                setcurrentBill([])
                setTotalPrice(0)
            }
        }
    }
    const sumtotalPrice = (currentBill) => {
        let total = 0
        if (currentBill != null && currentBill != undefined) {
            for (let i = 0; i < currentBill.length; i++) {
                total += currentBill[i].price * currentBill[i].qty
            }
            setTotalPrice(total)
        }

    }
    const openBill = async () => {
        try {
            const res = await axios.get(`${config.api_path}billsale/openBill`, config.headers());
        } catch (error) {
            console.log(error)
        }
    }
    const handleSave = async (item) => {
        try {
            const url = `${config.api_path}billsale/sale`
            const send = await axios.post(url, item, config.headers());
            if (send.status === 200) {
                Swal.fire({
                    icon: 'success',
                    text: `${send.data.message}`,
                }).then(() => {
                    fetchData()
                    fetchBillSaleDetail()
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const DeleteItemCart = async (item) => {
        try {
            Swal.fire({
                icon: 'question',
                title: 'ลบสินค้า',
                text: 'ยืนยันการลบสินค้า',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then(async (res) => {
                if (res.isConfirmed) {
                    const url = `${config.api_path}billsale/deleteItemCart/${item.id}`;
                    const send = await axios.delete(url, config.headers())
                    if (send.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: send.data.message,
                            text: send.data.message,
                        }).then(() => {
                            fetchBillSaleDetail()
                        })
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการลบสินค้า',
                    })
                }
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ',
                text: error.message,
            })

        }
    }
    const handleUpdateqty = async (e) => {
        e.preventDefault();
        try {
            Swal.fire({
                icon: 'question',
                title: 'แก้ไขจำนวน',
                text: 'ยืนยันการแก้ไขจำนวน',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then(async (isConfirmed) => {
                if (isConfirmed) {
                    if (item.qty > 0 && item.qty !== -1 && item.qty > -1) {
                        const url = `${config.api_path}billsale/updateQty/${item.id}`
                        const send = await axios.put(url, item, config.headers())
                        if (send.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: send.data.message,
                                text: send.data.message,
                            }).then(() => {
                                fetchBillSaleDetail()
                                handleClose()
                            })
                        }
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'คำเตือน',
                            text: 'กรุณาระบุจำนวนสินค้าใหม่ที่ไม่ใช่ 0 และไม่ติดลบ',
                        }).then(() => {
                            fetchBillSaleDetail()
                        })
                    }

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการแก้ไขจำนวน',
                    })
                }
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ',
                text: error.message,
            })
        }
    }
    const handleClose = async (e) => {
        const btn = document.getElementsByClassName('btnClose');
        for (let i = 0; i < btn.length; i++) {
            btn[i].click();
        }
    };

    const handleEndSale = async (e) => {
        e.preventDefault()
        try {
            Swal.fire({
                icon: 'question',
                title: 'ยืนยันการจบการขาย',
                text: 'ยืนยันการจบการขาย',
                confirmButtonColor: '#3085d6',
                showDenyButton: true,
            }).then(async (res) => {
                if (res.isConfirmed) {
                    if (InputMoney - totalPrice == 0) {
                        const send = await axios.get(`${config.api_path}billsale/endSale`, config.headers());
                        if (send.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: send.data.message,
                                text: send.data.message,
                            }).then(() => {
                                openBill()
                                fetchBillSaleDetail()
                                handleClose()
                                if (saleRef.current) {
                                    saleRef.current.refreshCountBill();
                                }
                                setInputMoney(0)
                            })
                        }
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'คำเตือน',
                            text: 'จำนวนเงินที่จ่ายไม่พอ',
                        }).then(() => {
                            fetchBillSaleDetail()
                        })
                    }

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ยกเลิก',
                        text: 'ยกเลิกการจบการขาย',
                    })
                }
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ',
                text: error.message,
            })
        }
    }

    const handleLastBill = async (e) => {
        try {
            const send = await axios.get(`${config.api_path}billsale/lastBill`, config.headers());
            if (send.status == 200) {
                setLastBill(send.data.body)
            }
        } catch (error) {
            console.log(error)
            setLastBill({})
        }
    }
    const handleTodayBill = async (e) => {
        try {
            const send = await axios.get(`${config.api_path}billsale/todayBill`, config.headers());
            if (send.status == 200) {
                setTodayBill(send.data.body)
            }
        } catch (error) {
            console.log(error)
            setTodayBill([])
        }
    }
    const handelPrint = async () => {
        try {
            const res = await axios.get(`${config.api_path}member/info`, config.headers())
            if (res.status === 200) {
                setMemberInfo(res.data.body)

            }
            handleLastBill()


        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div>
            <Template ref={saleRef}>
                <Header title="รายการสินค้า" breadMain="หน้าแรก" breadActive="สินค้า" />
                <div className="card" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                    <div className="card-header bg-white">
                        <h3 className="card-title"> ขายสินค้า </h3>
                        <div className="card-tools">
                            <button className='btn btn-success me-2' data-toggle="modal" data-target="#modalEndSale"> <i className=' fa fa-check  me-2'></i>จบการขาย</button>
                            <button className='btn btn-info me-2' onClick={handleTodayBill} data-toggle="modal" data-target="#modaltodayBill"> <i className=' fa fa-file  me-2'></i>บิลวันนี้</button>
                            <button className='btn btn-secondary me-2' onClick={handleLastBill} data-toggle="modal" data-target="#modalLastBill"> <i className=' fa fa-file-alt  me-2'></i>บิลล่าสุด</button>
                            <button className='btn btn-primary' onClick={handelPrint}><i className='fa fa-print me-2'></i> พิมพ์บิลล่าสุด</button>
                        </div>
                    </div>
                    <div className="card-body" >
                        <div className="row">
                            <div className="col-sm-9">
                                <div className="row">
                                    <div className="card border-0  shadow-none " style={{ boxShadow: "0" }}>
                                        <div className="card-body" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                                            <div className="row">
                                                {products.length > 0 ? products.map(item => (
                                                    <div className="col-lg-3 col-md-6" key={item.id} onClick={e => handleSave(item)} style={{ cursor: "pointer" }}>
                                                        <div className="card d-flex flex-column align-items-center text-nowrap" >
                                                            <div className="text-center">
                                                                <img className="card-img mt-2" src={`${config.host + item.productImages[0].imageName}`} alt={item.name} width={'200px'} height={'200px'} />
                                                            </div>
                                                            <div className="card-body pt-4">
                                                                <div className="text-muted text-center mt-auto">{item.name}</div>
                                                                <div className="text-center">
                                                                    <div className="font-weight-bold"><span className="text-dark">{parseInt(item.price).toLocaleString('th')} บาท</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : ""}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-3">
                                <div className="card">
                                    <div className="card-body" style={{ border: "2px dotted", maxHeight: "100%", overflowY: "auto" }}>
                                        <div className="text-end">
                                            <span className='btn btn-secondary h2 pe-3 ps-3 w-100 p-3 text-right' style={{ borderRadius: "0", color: "#70FE3F", backgroundColor: "black" }}>  {parseInt(totalPrice).toLocaleString('th') || 0.00}</span>
                                        </div>
                                        {currentBill.length > 0 ? (
                                            currentBill.map((item, index) => (
                                                <div className="card mt-3" key={index} >
                                                    <div className="card-body text-nowrap">

                                                        <div className='mb-2 '>{item.product.name}</div>
                                                        <div className='mb-1  text-nowrap'>จำนวนสินค้า: <b className="text-danger">{item.qty}</b>  | ราคาชิ้นละ: {parseInt(item.price).toLocaleString('th')}</div>
                                                        <div className='mb-1 '>รวม {(item.qty * parseInt(item.price)).toLocaleString('th')} บาท</div>
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <div className="float-end">


                                                                    <button className='btn btn-sm  btn-info me-2' data-bs-toggle="modal" data-bs-target="#modalConfigqty" tabIndex={item.id} onClick={e => setItem(item)} >
                                                                        <i className="fa fa-edit"></i>
                                                                    </button>

                                                                    <button className='btn btn-sm btn-danger ' onClick={e => DeleteItemCart(item)}>
                                                                        <i className="fa fa-trash"></i>
                                                                    </button>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))

                                        ) : (
                                            <div className="card mt-3">
                                                <div className="card-body">
                                                    <div className="text-center">
                                                        <img src="https://go.pospos.co/assets/images/ic-avatar-ready-to-sale.svg" className='img-top' />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal id="modalConfigqty" title="จำนวนสินค้า">
                    <form onSubmit={handleUpdateqty}>
                        <div className="form-group">
                            <label>จำนวนสินค้า </label>
                            <input type="number" className="form-control" id="editqty" placeholder="qty" value={item.qty || ''} onChange={e => setItem({ ...item, qty: e.target.value })} />
                        </div>
                    </form>
                    <button type='submit' onClick={handleUpdateqty} className="btn btn-info ml-2 w-100">
                        <i className="fa fa-times"></i> แก้ไขจำนวนสินค้า
                    </button>
                </Modal>

                <Modal id="modalEndSale" title="จบการขาย">
                    <form>
                        <div>
                            <div><label htmlFor="">ยอดเงินทั้งหมด</label></div>
                            <div><input type="text" className='form-control text-end' value={parseInt(totalPrice).toLocaleString('th-TH')} disabled /></div>
                            <div className='mt-3'><label htmlFor="">รับเงิน</label></div>
                            <div><input type="text" className='form-control text-end' value={InputMoney} onChange={e => setInputMoney(e.target.value)} /></div>
                            <div className='mt-3'><label htmlFor="">เงินทอน</label></div>
                            <div><input type="text" className='form-control text-end' value={(InputMoney - totalPrice) || 0} readOnly /></div>
                            <div className="text-center">
                                <button type="button" className='btn btn-success mt-3 me-2' onClick={() => setInputMoney(totalPrice)}>
                                    <i className="fa fa-check me-2"></i> จ่ายพอดี
                                </button>
                                <button onClick={handleEndSale} className='btn btn-primary mt-3'>
                                    <i className="fa fa-check me-2"></i> จบการขาย
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal>

                <Modal id="modalLastBill" title="บิลรายการล่าสุด" modalSize="modal-lg">
                    <div className='mt-2 table-responsive-sm'>
                        <table className='mt-2 table  table-bordered table-hover table-sm text-nowrap'>
                            <thead>
                                <tr>
                                    <th scope="col">ลำดับ</th>
                                    <th scope="col">Barcode</th>
                                    <th scope="col">รายการ</th>
                                    <th scope="col" className='text-end'>ราคา</th>
                                    <th scope="col" className='text-end'>จำนวน</th>
                                    <th scope="col" className='text-end'>ราคารวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LastBill.billSaleDetails !== undefined && LastBill.billSaleDetails.length > 0 ? (
                                    <>
                                        {LastBill.billSaleDetails.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td>{item.product.barcode}</td>
                                                    <td >{item.product.name}</td>
                                                    <td className='text-end'>{parseInt(item.price).toLocaleString('th')}</td>
                                                    <td className='text-end'> {item.qty}</td>
                                                    <td className='text-end'>{parseInt(item.price * item.qty).toLocaleString('th')}</td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                        <tr>
                                            <td colSpan={5} className='text-end'>ยอดขายรวม</td>
                                            <td className='text-end'>
                                                {LastBill.billSaleDetails.reduce((total, billItem) => total + billItem.price * billItem.qty, 0).toLocaleString('th')}
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
                <Modal id="modaltodayBill" title="บิลรายการวันนี้" >
                    <div className='mt-2 table-responsive-sm'>
                        <table className='mt-2 table table-bordered table-hover table-sm text-nowrap'>
                            <thead>
                                <tr className='text-center'>
                                    <th width={120}></th>
                                    <th scope="col"  >เลขบิล</th>
                                    <th scope="col"  >วัน เวลา ที่ขาย</th>
                                    <th scope="col"   >จำนวนที่ขาย</th>

                                </tr>
                            </thead>
                            <tbody>
                                {TodayBill.length !== 0 ? TodayBill.map((billItem, billIndex) => (
                                    <React.Fragment key={billIndex}>
                                        <tr className='text-center'>
                                            <td>
                                                <button className='btn btn-sm  btn-primary w-100 me-2'
                                                    data-toggle="modal" data-target="#modalBillSaleDetail"
                                                    tabIndex={billIndex}
                                                    onClick={e => setSelectedBill(billItem.billSaleDetails)}
                                                >
                                                    <i className="fa fa-file me-2"></i> ดูรายการ
                                                </button>
                                            </td>
                                            <td  >{billItem.id}</td>
                                            <td >{new Date(billItem.payData).toLocaleString('th-TH')}</td>
                                            <td >{billItem.billSaleDetails.length}</td>
                                        </tr>
                                    </React.Fragment>
                                )) : <tr className='text-center'><td colSpan={8}>ไม่มีข้อมูล</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Modal>

                <Modal id="modalBillSaleDetail" title="รายละเอียดในบิล" modalSize="modal-lg">
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
                                {SelectedBill !== undefined && SelectedBill.length > 0 ? (
                                    <>
                                        {SelectedBill.map((billItem, index) => (
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
                                                {SelectedBill.reduce((total, billItem) => total + billItem.price * billItem.qty, 0).toLocaleString('th')}
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
                <div id='slip' >
                  {Object.keys(memberInfo).length != 0 ? (
                    <>
                    <div ><center>เลขบิล:{LastBill.id}</center></div>
                    <div><center>ใบเสร็จรับเงิน</center></div>
                    <div>
                        <center><strong>{memberInfo.name}</strong></center>
                    </div>
                    <hr />
                    <table width="100%">
                        <tbody>
                            {LastBill.billSaleDetails !== undefined && LastBill.billSaleDetails.length > 0 ? (
                                <>
                                    {LastBill.billSaleDetails.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td >({index + 1})</td>
                                                <td >{item.product.name}</td>
                                                <td align='right'> {item.qty}</td>
                                                <td align='right'> {parseInt(item.price).toLocaleString('th')}</td>
                                                <td align='right'> {parseInt(item.price * item.qty).toLocaleString('th')}</td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </>
                            ) : (
                                <tr><td colSpan={6}>ไม่มีข้อมูล</td></tr>
                            )}
                        </tbody>
                    </table>
                    <hr />
                    <div>ยอดรวม: {
                    LastBill.billSaleDetails !== undefined && LastBill.billSaleDetails.length > 0 ?
                    LastBill.billSaleDetails.reduce((total, billItem) => total + billItem.price * billItem.qty, 0).toLocaleString('th') : null} บาท</div>
                    <div>เวลา {new Date(LastBill.createdAt).toLocaleString('th-TH')}</div>
                    </>
                   ) :null}

                </div>
            </Template>
            
        </div>
    )
}
