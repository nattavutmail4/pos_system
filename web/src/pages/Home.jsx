import React from 'react'
import Template from '../components/Template'
import Header from '../components/Header'
export default function Home() {
  document.title = 'ระบบจัดการร้านค้าออนไลน์'
  return (
    <div>
      <Template>
        <Header title="หน้าแรก" breadMain="หน้าแรก" breadActive="หน้าแรก" />
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Title</h3>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                <i className="fas fa-minus"></i>
              </button>
              <button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            Start creating your amazing application!
          </div>
          <div className="card-footer">
            Footer
          </div>
        </div>
      </Template>
    </div>
  )
}
