import React, { useEffect, useState } from 'react'
import Template from '../../components/Template'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend

} from "chart.js";

import { Bar } from 'react-chartjs-2'
import axios from 'axios'
import config from '../../config'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function dashboard() {
  const myDate = new Date();
  const [year, setYear] = useState(myDate.getFullYear());
  const [myData, setMyData] = useState([]);
  const [arrYear, setArrYear] = useState(() => {
    let arr = [];
    const y = myDate.getFullYear();
    const startYear = (y - 10) // เอาปีปัจจุบัน - 10 ย้อนหลังไป 10 ปี
    for (let i = startYear; i <= y; i++) {
      arr.push(i)
    }
    return arr;
  });
  const [options, setOptions] = useState(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  });

  useEffect(() => {
    fetchData()
  },[]);

  const fetchData = async () => {
    try {
      const url = `${config.api_path}changepackage/reportSumSalePerMonth`;
      const payload = {
        year: year
      }
      const res = await axios.post(url, payload, config.headers());
      if (res.status === 200) {
        const results = (res.data.results)
        let arr = [];

        for (let i = 0; i < results.length; i++) {
          const item = results[i];
          arr.push(item.sum);
        }
        const labels = [
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
        ];
        setMyData({
          labels,
          datasets: [
            {
              label:"ยอดขาย",
              data: arr,
              backgroundColor: 'rgba(255,99,132,0.2)'

            }
          ]
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Template>
        <div className="card">
          <div className="card-header">
            Dashboard
          </div>
          <div className="card-body">
            <div className="row mt-2">
              <div className="col-4">
                <div className="input-group">
                  <span className="input-group-text">ปี</span>
                  <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)}>
                    {arrYear.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-4">
                <button onClick={fetchData} className='btn btn-primary mt-2'>
                  <i className='fa fa-check me2'></i> ค้นหา
                </button>
              </div>

            </div>
            <div className='text-center mt-3'>
              <div className="h5">รายงานสรุปยอดขายรายเดือน ปี {year}</div>
            </div>
            <div className='mt-3'>
              {myData.datasets != null ? (
                <Bar options={options} data = {myData} />
              ):(
                ""
              )}
            </div>
          </div>
        </div>
      </Template>
    </>
  )
}
