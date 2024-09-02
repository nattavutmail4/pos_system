const express = require('express');
const ProductController = require('../controllers/ProductController');
const ProductImageController = require('../controllers/ProductImageController')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const path = require('path')
const router = express.Router();
const uuid = require('uuid');

const Service = require('../controllers/Service');

router.use(fileUpload())



router.get('/list', Service.isLogin,async (req, res) => {
    try {
        const product = await ProductController.all(req.member);
        return res.status(200).json(product);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || ' server error'
        })
    }
});

router.get('/listImage/:id',Service.isLogin, async (req, res) => {
    try {
        const product = await ProductImageController.listImage(req.params.id);
        return res.status(200).json(product);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message ||'server error'
        })
    }
})

router.get('/listForSale',Service.isLogin, async (req, res) => {
  try {
     const result = await ProductController.listForProduct_and_Image(req.member)
     return res.status(200).json(result);
    
  } catch (error) {
    return res.status(error.statusCode || 500).json({
        message: error.message ||'server error'
    })
  }
})




router.post('/create' , Service.isLogin, async (req, res) => {
    try {
        const CreateProduct = await ProductController.createProduct(req.body,req.member);
        return res.status(200).json(CreateProduct);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || ' server error'
        })
    }
})
let rs_file = [];
let type;
router.post('/insertImage', Service.isLogin,async (req, res) => {
    try {
        //ตรวจหาโฟลเดอร์ uplads
        if (!fs.existsSync(path.join('./uploads'))) {
            fs.mkdirSync(path.join('./uploads'))
        }
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                statusCode: 400,
                message: 'กรุณาอัพโหลดรูปภาพ',
            })
        } else {
            const fileName = req.files.image
            if (fileName.length > 0) {
                for (let i = 0; i < fileName.length; i++) {
                    const file = fileName[i];
                    const showName = file.name.split('.');
                    const extension = showName.pop();
                    const randomName = `${uuid.v4()}.jpg`;
                    rs_file.push(randomName);
                    await file.mv(`./uploads/${randomName}`);
                }
                type = 'fileArray'
            } else {
                const showName = fileName.name.split('.');
                const extension = showName.pop();
                const randomName = `${uuid.v4()}.jpg`;
                rs_file.push(randomName);
                await fileName.mv(`./uploads/${randomName}`);
                type = 'singlefile'
            }
          
            const uploadData = await ProductImageController.uploadFile({ productId: req.body.productId, Images: rs_file, type })
            if (uploadData.statusCode === 200) {
                rs_file = [];
                return res.status(200).json({
                    statusCode: 200,
                    message: 'อัพโหลดรูปภาพสำเร็จ',
                })
            }
        }


    } catch (error) {
        // หากมีข้อผิดพลาดเกิดขึ้น ลบไฟล์ที่ถูกอัปโหลดเข้ามา
        if (type === 'singlefile') {
            if (fs.existsSync(`./uploads/${rs_file[0]}`)) {
                fs.unlinkSync(`./uploads/${rs_file[0]}`);
            }
        } else {
            for (let i = 0; i < rs_file.length; i++) {
                if (fs.existsSync(`./uploads/${rs_file[i]}`)) {
                    fs.unlinkSync(`./uploads/${rs_file[i]}`);
                }
            }
        }
        return res.status(error.statusCode || 500).json({
            message: error.message || 'server error'
        })
    }
})


router.put('/update/:id', Service.isLogin,async (req, res) => {
    try {
        const UpdateProduct = await ProductController.updateProduct(req.params.id, req.body);
        return res.status(200).json(UpdateProduct);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || 'server error'
        })
    }
})
router.put('/chooseMainImage/:id',Service.isLogin, async (req, res) => {
    try {
        const product = await ProductImageController.chooseMainImage({id: req.params.id, productId: req.body.productId });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message ||'server error'
        })
    }
})
router.post('/deleteImage/:id', Service.isLogin, async (req, res) => {
    try {
       const CheckId = await ProductImageController.isValidateImgId(req.params.id)
       if(CheckId.statusCode === 200){
            const fileName = CheckId.body[0].imageName
            if (fs.existsSync(`./uploads/${fileName}`)) {
                fs.unlinkSync(`./uploads/${fileName}`);
            }
            const deleteImageinData = await ProductImageController.deleteImage(fileName)
            return res.status(200).json(deleteImageinData)
       }
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || ' server error'
        })
    }
})

router.delete('/delete/:id', Service.isLogin,async (req, res) => {
    try {
        const DeleteProduct = await ProductController.deleteProduct(req.params.id);
        return res.status(200).json(DeleteProduct);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || 'server error'
        })
    }
})



module.exports = router