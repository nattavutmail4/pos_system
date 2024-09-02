import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import Header from '../components/Header';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';
import config from '../config';
import axios from 'axios';

export default function Product() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  
  const [productImage, setProductImage] = useState({});
  const [productsImages, setProductImages] = useState([]);
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${config.api_path}product/list`, config.headers());
      if (res.status === 200) {
        if(res.data != ''){
            setProducts(res.data.body)
        }else{
          setProducts([]);
        }
        // setProducts(res.data.body);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      });
    }
  };

  const fetchDataProductImage = async (item) => {
    try {
      const res = await axios.get(`${config.api_path}product/listImage/${item.id}`, config.headers());
      if (res.status === 200) {
        setProductImages(res.data.body);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error.response.data.message}`,
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let send;
      let url ;
      if(product.id !== undefined){
        url = `${config.api_path}product/update/${product.id}`
        send = await axios.put(url,product,config.headers());
      }else{
        url = `${config.api_path}product/create`
        send = await axios.post(url,product,config.headers());
      }
      const res = send;
      if (res.status === 200) {
        console.log(res)
        Swal.fire({
          icon: 'success',
          text: `${res.data.message}`,
        }).then(() => {
          handleClose();
          ClearForm();
          fetchProducts();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error.response.data.message}`,
      });
    }
  };

  const ClearForm = () => {
    setProduct({
      name: '',
      price: '',
      barcode: '',
      cost: '',
      detail: '',
    });
  };

  const handleClose = async (e) => {
    const btn = document.getElementsByClassName('btnClose');
    for (let i = 0; i < btn.length; i++) {
      btn[i].click();
    }
  };

  const deleteProduct = async (item) => {
    try {
      Swal.fire({
        title: 'ลบข้อมูลสินค้า',
        text: 'คุณแน่ใจที่จะลบสินค้าชิ้นนี้',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (confirm) => {
        if (confirm.isConfirmed) {
          const res = await axios.delete(`${config.api_path}product/delete/${item}`, config.headers());
          if (res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: `${res.data.message}`,
            }).then(() => {
              setTimeout(() => {
                handleClose();
                fetchProducts();
              }, 500);
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Cancelled',
            text: 'Your product is safe!',
          });
        }
      });
    } catch (error) {
      console.log(error.status);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error.response.data.message}`,
      });
    }
  };

  const handleImageChange = (files) => {
    try {
      setProductImage(files);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      for (let i = 0; i < productImage.length; i++) {
        const image = productImage[i];
        if (image !== undefined) {
          formData.append('image', image);
        }
      }
      const res = await axios.post(`${config.api_path}product/insertImage`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(config.token_name)}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'อัพโหลดไฟล์รูป',
          text: `${res.data.message}`,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error.response.data.message}`,
      });
    }
  };

  const handleChooseMainImage = async (item) => {
    try {
      const data = {
        id:item.id,
        productId: parseInt(item.productId)
      }
      const url = `${config.api_path}product/chooseMainImage/${data.id}`
      const res = await axios.put(url, data, config.headers());
      
      if(res.status === 200){
        fetchDataProductImage({
           id:item.id
        })
        Swal.fire({
          title: 'เลือกภาพหลัก',
          text: 'บันทึกการเลือกภาพหลักของสินค้าแล้ว',
          icon: 'success',
          timer: 2000
      })
      handleClose()
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${e.response.data.message}`,
      });
    }
  };
  const handleDeleteProductImage = async (item) => {
    try {
      Swal.fire({
        title: 'ลบรูปภาพ',
        text: 'คุณแน่ใจที่จะลบรูปภาพนี้',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (res) => {
        if (res.isConfirmed) {
          const data = {
            id: item.id,
            imageName: item.imageName
          };
          const url = `${config.api_path}product/deleteImage/${data.id}`
          const res = await axios.post(url, data, config.headers());
          if (res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'ลบรูป',
              text: `${res.data.message}`,
            }).then((d) => {
              setTimeout(() => {
                 window.location.href="/product"
              }, 500)
            });
          }


        } else {
          Swal.fire({
            icon: 'error',
            title: 'Cancelled',
            text: 'Your product is safe!',
          });
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error.response.data.message}`,
      });
    }
  }

  return (
    <div>
      <Template>
        <Header title="รายการสินค้า" breadMain="หน้าแรก" breadActive="รายการสินค้า" />
        <div className="card">
          <div className="card-header bg-info ">
            <h3 className="card-title">รายละเอียดสินค้า</h3>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                <i className="fas fa-minus text-white"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="float-right"><button className='btn btn-sm btn-dark' data-bs-toggle="modal" data-bs-target="#modalProduct"> <i className='fa fa-add'></i> เพิ่มรายการสินค้า</button></div><br />
            <div className=" mt-3 table-responsive-sm">
              <table className='mt-5 table  table-bordered table-hover table-sm text-nowrap'>
                <thead className='text-center'>
                  <tr>
                    <th scope="col">ลำดับ</th>
                    <th scope='col'>รหัสบาร์โค๊ด</th>
                    <th scope="col">ชื่อสินค้า</th>
                    <th scope="col">ราคาทุน</th>
                    <th scope="col">ราคา</th>
                    <th scope="col">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? products.map((item, index) => (
                    <tr key={index} className='text-center'>
                      <td>{index + 1}</td>
                      <td>{item.barcode}</td>
                      <td>{item.name}</td>
                      <td>{parseInt(item.cost).toLocaleString('th-TH')}</td>
                      <td>{parseInt(item.price).toLocaleString('th-TH')}</td>
                      <td>
                        <button className='btn btn-sm  ml-3' style={{ backgroundColor: "#23d3cb", color: "white" }} data-bs-toggle="modal" data-bs-target='#mainProductImage' onClick={e => { setProduct(item); fetchDataProductImage(item); }}><i className='fa fa-image'></i></button>
                        <button className='btn btn-sm btn-primary ml-3' data-bs-toggle="modal" data-bs-target='#modalProductlImage' onClick={e => { setProduct(item); fetchDataProductImage(item); }}><i className='fa-solid fa-table-cells-large'></i></button>
                        <button className='btn btn-sm btn-dark  ml-3' data-bs-toggle="modal" data-bs-target="#modalProduct" tabIndex={item.id} onClick={e => setProduct(item)}> <i className='fa fa-edit'></i> </button>
                        <button className='btn btn-sm btn-danger ml-3' onClick={() => deleteProduct(item.id)} tabIndex={item.id}> <i className='fa fa-trash'></i> </button>
                      </td>
                    </tr>
                  )) : <tr className='text-center'><td colSpan={6}>ไม่มีข้อมูล</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal id="modalProduct" title="เพิ่มรายการสินค้า" modalSize='modal-lg'>
          <form onSubmit={handleSave}>
            <div className="row">
              <div className="mt-3 form-group col-sm-12">ฺ
                <label >Barcode <span className='text-danger'> *</span></label>
                <input type="text" className="form-control" id="barcode" maxLength={10} placeholder="Barcode" value={product.barcode || ''} required onChange={e => setProduct({ ...product, barcode: e.target.value })} />
              </div>
              <div className="mt-3 form-group col-sm-12">ฺ
                <label >ชื่อสินค้า <span className='text-danger'> *</span></label>
                <input type="text" className="form-control" id="name" placeholder="Product" value={product.name || ''} required onChange={e => setProduct({ ...product, name: e.target.value })} />
              </div>
              <div className="mt-3 form-group col-sm-6">
                <label htmlFor="">ราคาจำหน่าย</label>
                <input type="number" className="form-control" id="price" placeholder="price" required value={product.price || ''} onChange={e => setProduct({ ...product, price: e.target.value })} />
              </div>
              <div className="mt-3 form-group col-sm-6">
                <label htmlFor="">ราคาทุ่น</label>
                <input type="number" className="form-control" id="cost" placeholder="cost" value={product.cost || ''} required onChange={e => setProduct({ ...product, cost: e.target.value })} />
              </div>
              <div className="mt-3 orm-group col-sm-12">
                <label >รายละเอียดสินค้า <span className='text-danger'> *</span></label>
                <textarea name="detail" id="detail" cols="30" rows="10" value={product.detail || ''} className="form-control" required onChange={e => setProduct({ ...product, detail: e.target.value })} > </textarea>
              </div>
            </div>
            <button className='btn btn-dark w-100 mt-4'>ลงทเบียน</button>
          </form>
        </Modal>

        <Modal id="modalProductlImage" title="เพิ่มภาพรายการสินค้า" modalSize='modal-lg'>
          <form onSubmit={uploadFile}>
            <div className="row">
              <div className=" form-group col-sm-12">ฺ
                <label >Barcode <span className='text-danger'> *</span></label>
                <input type="text" className="form-control" id="editbarcode" placeholder="Barcode" value={product.barcode || ''} disabled onChange={e => setProduct({ ...product, barcode: e.target.value })} />
              </div>
              <div className="mt-3 form-group col-sm-12">ฺ
                <label >ชื่อสินค้า <span className='text-danger'> *</span></label>
                <input type="text" className="form-control" id="editname" placeholder="Product" value={product.name || ''} disabled />
              </div>
              <div className="mt-3 form-group col-sm-6">
                <label htmlFor="">ราคาจำหน่าย</label>
                <input type="number" className="form-control" id="editprice" placeholder="price" disabled value={product.price || ''} />
              </div>
              <div className="mt-3 form-group col-sm-6">
                <label htmlFor="">ราคาทุ่น</label>
                <input type="number" className="form-control" id="editcost" placeholder="cost" value={product.cost || ''} disabled />
              </div>
              <div className="mt-3 form-group col-sm-12">
                <label >รายละเอียดสินค้า <span className='text-danger'> *</span></label>
                <textarea id="editdetail" cols="10" rows="3" value={product.detail || ''} className="form-control" disabled  > </textarea>
              </div>
              <div className="mt-3 form-group col-sm-12">
                <label >เลือกภาพสินค้า <span className='text-danger'> *</span></label>
                <input type='file' name="image" id="image" key={key} className="form-control"  multiple onChange={e => handleImageChange(e.target.files)} />
              </div>
              <hr />
              {productsImages && productsImages.length > 0 &&
                <div className="mt-3 form-group col-sm-12">
                  <label>ภาพสินค้า</label>
                  <div className="row">
                    {productsImages.map((item, index) => (
                      <div className="col-sm-3  mt-3 border-primary" key={index}>
                        <div className="card ">
                          <img src={`http://localhost:5000/${item.imageName}`} alt={`Product Image ${index}`} className="card-img-top" width={"169px"} height={"169px"} />
                          <div className="card-body text-nowrap">
                            <p className="card-text text-nowrap text-center">
                              {item.isMain === true ?
                                <button className="btn btn-primary" onClick={e => handleChooseMainImage(item)}>
                                  ภาพหลัก
                                </button>
                                :
                                <button className="btn btn-info" onClick={e => handleChooseMainImage(item)}>
                                  ภาพรอง
                                </button>
                              }

                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
            </div>
            <button className='btn btn-primary w-100 mt-3 mx-auto' >Upload File</button>
          </form>
        </Modal>

        <Modal id="mainProductImage" title="เลือกรูปภาพแสดงหลัก" modalSize='modal-lg'>
          {productsImages && productsImages.length > 0 &&
            <div className="mt-3 form-group col-sm-12">
              <label>ภาพสินค้า</label>
              <div className="row">
                {productsImages.map((item, index) => (
                  <div className="col-sm-3  mt-3 border-primary" key={index}>
                    <div className="card ">
                      <img src={`http://localhost:5000/${item.imageName}`} alt={`Product Image ${index}`} className="card-img-top" width={"169px"} height={"169px"} />
                      <div className="card-body text-nowrap">
                        <p className="card-text text-nowrap text-center">
                          {item.isMain === true ?
                            <button className="btn btn-primary" onClick={e => handleChooseMainImage(item)}>
                              ภาพหลัก
                            </button>
                            :
                            <button className="btn btn-info" onClick={e => handleChooseMainImage(item)}>
                              ภาพรอง
                            </button>
                          }
                          <button onClick={e => handleDeleteProductImage(item)} className="btn btn-danger ml-2">
                            <i className="fa fa-times"></i>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        </Modal>
      </Template>
    </div>
  );
}
