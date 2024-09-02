import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import Header from '../components/Header'
import axios from 'axios';
import config from '../config';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';
export default function ReportStock() {
  const [stocks, setStocks] = useState([]);
  const [currentStock, setCurrentStock] = useState({});
  useEffect(() => {
    fetchStockData()
  }, [])
  const fetchStockData = async () => {
    try {
      const response = await axios.get(`${config.api_path}stock/report`, config.headers());
      if (response.status === 200) {
        setStocks(response.data.results)
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const seletedStock = (item) => {
    setCurrentStock(item.result)
  }
  return (
    <div>
      <Template>
        <Header title="รายงาน Stock" breadMain="หน้าแรก" breadActive="รายงาน Stock" />
        <div className="card">
          <div className="card-body">
            <div className='table-response-sm mt-3'>
              <table className='table table-bordered table-striped'>
                <thead>
                  <tr >
                    <th width={150} >Barcode</th>
                    <th width={250}>รายการ</th>
                    <th width={80} className='text-end'>รับเข้า</th>
                    <th width={80} className='text-end'>ขายออก</th>
                    <th width={80} className='text-end'>คงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.length > 0 ?
                    stocks.map((Item, index) =>
                    (
                      <React.Fragment key={index}>
                        <tr>
                          <td>{Item.result.barcode}</td>
                          <td>{Item.result.name}</td>
                          <td className='text-end'><a className='btn btn-link text-success' data-toggle="modal" data-target="#modalStockIn" onClick={e => setCurrentStock(Item)}>{parseInt(Item.stockIn).toLocaleString('th-TH')}</a></td>
                          <td className='text-end'><a className='btn btn-link text-danger' data-toggle="modal" data-target="#modalStockOut" onClick={e => setCurrentStock(Item)}>{parseInt(Item.stockOut).toLocaleString('th-TH')}</a></td>
                          <td className='text-end'> {parseInt(Item.stockIn).toLocaleString('th-TH') - parseInt(Item.stockOut).toLocaleString('th-TH')}</td>
                        </tr>
                      </React.Fragment>
                    )
                    ) : <tr><td colSpan={5} className='text-center'>ไม่มีข้อมูลรายการขาย</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal id="modalStockIn" title="ข้อมูลการรับสินค้าเข้า" modalSize="modal-lg">
          <div className='table-response-sm mt-3'>
            <table className='table table-bordered table-striped' >
              <thead>
                <tr>
                  <th width={150} >Barcode</th>
                  <th >รายการ</th>
                  <th width={80} className='text-center'>จำนวน</th>
                  <th width={80} className='text-center'>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {currentStock.result != undefined ?
                  currentStock.result.stocks.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{item.product.barcode}</td>
                        <td>{item.product.name}</td>
                        <td className='text-center'>{parseInt(item.qty).toLocaleString('th-TH')}</td>
                        <td className='text-center'>{new Date(item.createdAt).toLocaleDateString('th-TH')}</td>
                      </tr>
                    </React.Fragment>
                  )) : <tr><td className='text-center' colSpan={4}>ไม่มีข้อมูลการนำเข้าสินค้า</td></tr>}

              </tbody>
            </table>
          </div>
        </Modal>

        <Modal id="modalStockOut" title="ข้อมูลการรับสินค้าออก" modalSize="modal-lg">
          <div className='table-response-sm mt-3'>
            <table className='table table-bordered table-striped' >
              <thead>
                <tr>
                  <th width={150} >Barcode</th>
                  <th >รายการ</th>
                  <th width={80} className='text-center'>จำนวน</th>
                  <th width={80} className='text-center'>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {currentStock.result != undefined ?
                  currentStock.result.billSaleDetails.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{item.product.barcode}</td>
                        <td>{item.product.name}</td>
                        <td className='text-center'>{parseInt(item.qty).toLocaleString('th-TH')}</td>
                        <td className='text-center'>{new Date(item.createdAt).toLocaleDateString('th-TH')}</td>
                      </tr>
                    </React.Fragment>
                  )) : <tr><td className='text-center' colSpan={4}>ไม่มีข้อมูลการนำเข้าสินค้า</td></tr>}

              </tbody>
            </table>
          </div>
        </Modal>


      </Template>
    </div>
  )
}
