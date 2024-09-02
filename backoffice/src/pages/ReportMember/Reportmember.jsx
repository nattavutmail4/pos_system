import React, { useEffect, useState } from 'react'
import Template from '../../components/Template'
import axios from 'axios'
import config from '../../config'
import Swal from 'sweetalert2'

export default function Reportmember() {
  const [member, setMember] = useState([])
  useEffect(() => {
    fetchData()
  },[])
  const fetchData = async() => {
    try{
        const response  = await axios.get(`${config.api_path}member/list`,config.headers())
        if(response.status === 200){
            setMember(response.data.body)
        }
    }catch(error) {
        console.log(error)
    }
  }
  return (
    <>
        <Template>
           <div className="card">
            <div className="card-header">
                รายงานคนทีใช้บริการ
            </div>
            <div className="card-body">
                <div className='table-response-sm'>
                    <table className='table table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th width={150} >#</th>
                                <th width={250}>ชื่อ</th>
                                <th width={80} >เบอร์โทร</th>
                                <th width={80} >แพคเกจ</th>
                                <th width={80}>วันที่สมัคร</th>
                            </tr>
                        </thead>
                        <tbody>
                            {member.length > 0  && member != undefined ? member.map((item,index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{item.name}</td>
                                        <td >{item.phone}</td>
                                        <td >{item.package.name}</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString('th-TH')}</td>
                                    </tr>
                                </React.Fragment>
                            )) : <tr className='text-center'><td colSpan={4}>ไม่มีข้อมูล</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
           </div>
        </Template>
    </>
  )
}
