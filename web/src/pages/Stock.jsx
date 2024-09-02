import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import Header from '../components/Header'
import config from '../config'
import axios from 'axios'
import Swal from 'sweetalert2'
import Modal from '../components/Modal'
export default function Stock() {
  const [ proucts, setProducts] = useState([]);
  const [ productName, setProductName] = useState('')
  const [ productId, setProductId] = useState(0);
  const [ qty, setQty] = useState(0)
  const [ stocks , setStocks] = useState([]);
  const [ stock, setStock] = useState({})

 useEffect(() => {
    fetchDataStock()
  }, []);

  const fetchDataStock = async() => {
    try {
        const response = await axios.get(`${config.api_path}stock/list`,config.headers());
        if (response.status === 200) {
            setStocks(response.data.results);
        }
    }catch(e) {
        console.log(e)
        setStocks([])
    }
  }

  const fetchData = async() => {
    try {
        const response = await axios.get(`${config.api_path}product/list`,config.headers());
        if(response.status === 200){
           setProducts(response.data.body)
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error.message}`,
        })
    }
  }

  const handleChooseProduct = (item) => {
    setProductName(item.name)
    setProductId(item.id)
    const btns = document.getElementsByClassName('btnClose');
    for(let i =0; i< btns.length; i++){
        btns[i].click();
    }
  }

  const handleSave = async(e) => {
    e.preventDefault()
    try {
        const payload = {
            productId: productId,
            qty:qty
        };
        Swal.fire({
            icon: 'question',
            title: 'บันทึกข้อมูล',
            text: 'ยืนยันการบันทึกข้อมูลจำนวนสินค้า',
            confirmButtonColor: '#3085d6',
            showDenyButton: true,
        }).then(async (res) => {
            if(res.isConfirmed){
                if(payload.qty !== undefined && payload.qty > 0 ){
                  const response = await axios.post(`${config.api_path}stock/save`, payload, config.headers())
                    if (response.status === 200) {
                        setQty(0)
                        Swal.fire({
                        icon:'success',
                        title: response.data.message,
                        text: response.data.message,
                        }).then(() => {
                            fetchDataStock()
                        })
                    }
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'ระบุจำนวนสินค้าให้ถูกต้อง',
                    })
                }
            }else{
                Swal.fire('ยกเลิก', 'ยกเลิกการบันทึกข้อมูลจำนวนสินค้า', 'error')
            }
        })
       
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error.message}`,
        })
    }
  }

  const handleDelete  = async(item) => {
    try {
        Swal.fire({
            icon: 'question',
            title: 'ลบข้อมูล',
            text: 'ยืนยันการลบข้อมูลจำนวนสินค้าตัวนี้',
            confirmButtonColor: '#3085d6',
            showDenyButton: true,
        }).then(async(res) => {
            if(res.isConfirmed) {
                const path = `${config.api_path}stock/destroy/${item.id}`
                const response = await axios.delete(path, config.headers())
                if (response.status === 200) {
                    Swal.fire({
                        icon:'success',
                        title: response.data.message,
                        text: response.data.message,
                    }).then(() => {
                        fetchDataStock()
                    })
                }
            }else{
                Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูลจำนวนสินค้า', 'error')
            }
        })
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error.message}`,
        })
    }
  }

  return (
    <div>
    <Template>
      <Header title="สต๊อกสินค้า" breadMain="หน้าแรก" breadActive="สต๊อกสินค้า" />
      <div className="card">
        <div className="card-body">
          <div className="row">
              <div className="col-12 col-sm-6 mt-3">
                <div className="input-group">
                    <span className='input-group-text'>สินค้า</span>
                    <input type="text" className='form-control' value={productName || ''} onChange={e => setProductName(e.target.value)} disabled />
                    <button onClick={fetchData}  data-toggle="modal" data-target="#modalProduct" className='btn btn-primary'>
                        <i className='fa fa-search me-2'></i>
                    </button>
                </div>
              </div>
              <div className="col-12 col-sm-6 mt-3">
                <div className="input-group">
                    <span className='input-group-text'>จำนวนสินค้า</span>
                    <input type="number" className='form-control'  value={qty}  onChange={e => setQty(e.target.value)}/>
                    <button className='btn btn-primary' onClick={handleSave}>
                        <i className="fa fa-check me2"></i> บันทึก
                    </button>
                </div>
              </div>
          </div>

          <div className='table-response-sm mt-5'>
            <table className='table table-bordered table-striped'>
                <thead>
                    <tr>
                        <th className='text-center'>#</th>
                        <th>Barcode</th>
                        <th>รายการ</th>
                        <th className='text-center'>ราคาสินค้า</th>
                        <th className='text-center'>ราคาต้นทุ่น</th>
                        <th className='text-center'>จำนวนสินค้า</th>
                        <th className='text-center'>วันที่เพิ่มจำนวนสินค้า</th>
                        <th className='text-center'>จัดการข้อมูล</th>
                    </tr>
                </thead>
                <tbody>
                    { stocks.length > 0 ? stocks.map((stocksItem,index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td className='text-center'>{index+1}</td>
                                <td>{stocksItem.product.barcode}</td>
                                <td>{stocksItem.product.name}</td>
                                <td className='text-center'>{parseInt(stocksItem.product.price).toLocaleString('th-TH')}</td>
                                <td className='text-center'>{parseInt(stocksItem.product.cost).toLocaleString('th-TH')}</td>
                                <td className='text-center'>{parseInt(stocksItem.qty).toLocaleString('th-TH')}</td>
                                <td className='text-center'> {new Date(stocksItem.createdAt).toLocaleString('th-TH')}</td>
                                <td className='text-center'>
                                    <button className='btn btn-danger me-2' onClick={e =>handleDelete(stocksItem)}>
                                        <i className="fa fa-trash "></i>
                                    </button>
                                </td>
                            </tr>
                        </React.Fragment>
                    )) : <tr  className='text-center'><td colSpan={7}>ไม่มีข้อมูล</td></tr>}
                </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal id="modalProduct" title="เลือกสินค้า">
        <table className='table table-bordered table-striped'>
            <thead>
                <tr>
                    <th width={180}></th>
                    <th>Barcode</th>
                    <th>รายการ</th>

                </tr>
            </thead>
            <tbody>
                { proucts.length > 0 ? proucts.map((prdItem,index) => (
                    <React.Fragment key={index}>
                        <tr>
                            <td className='text-center'>
                                <button className='btn btn-primary' onClick={e => handleChooseProduct(prdItem)}>
                                    <i className='fa fa-check me-2'></i> เลือกรายการ
                                </button>
                            </td>
                            <td>
                                {prdItem.barcode}
                            </td>
                            <td>{prdItem.name}</td>
                        </tr>
                    </React.Fragment>
                )) : <tr  className='text-center'><td colSpan={2}>ไม่มีข้อมูล</td></tr>}
            </tbody>
        </table>
      </Modal>
    </Template>
  </div>
  )
}
