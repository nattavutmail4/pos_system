const ProductImageModels = require('../models/ProductImageModels')

const ProductImage = {
    listImage: async(item) =>{
        try{
            const query = await ProductImageModels.findAll({
                where:{
                    productId:item
                },
                order:[['isMain','desc']]
            })
            if(query.length > 0) {
                return {
                    statusCode: 200,
                    message:'ดึงรูปภาพสำเร็จ',
                    body: query
                }
            }
        }catch(error){
            throw { statusCode: error.statusCode || 400, message: error.message };
        }
    },
    chooseMainImage:async(item) =>{
        try{
            const query = await ProductImageModels.findAll({
                where:{
                    productId:item.productId,
                    isMain:true
                }
            })
            if(query.length > 0) {
                const updateFalse = await ProductImageModels.update(
                    {
                       isMain:false
                    },
                    {
                        where:{
                            isMain:true
                        }
                    }
                )
                const updateTrue = await ProductImageModels.update(
                    {
                        isMain:true
                    },
                    {
                        where:{
                            id:item.id
                        }
                    }
                )
                return {
                    statusCode: 200,
                    message:'เลือกรูปภาพเรียบร้อย',
                    body: query
                }
            }else{
                const updateTrue = await ProductImageModels.update(
                    {
                        isMain:true
                    },
                    {
                        where:{
                            id:item.id
                        }
                    }
                )
                return {
                    statusCode: 200,
                    message:'เลือกรูปภาพเรียบร้อย',
                    body: query
                }
            }
        }catch(error){
            throw { statusCode: error.statusCode || 400, message: error.message };
        }
    },
    isValidateImgId:async(id) =>{
        try{
            const query = await ProductImageModels.findAll({
                where:{
                    id:id
                },
            })
            if(query.length !=0){
                return {
                    statusCode:200,
                    body:query
                }
            }else{
                throw { statusCode: 404, message: "Image not found" };
            }
        }catch(error){
            throw { statusCode: error.statusCode || 400, message: error.message };
        }
    },
    uploadFile: async(item) => {
        try{
            if(item.type === 'singlefile'){
                const CreateProductImageModel  = await ProductImageModels.create({
                    productId:item.productId,
                    imageName:item.Images[0],
                    isMain:false,
                })
                if (!CreateProductImageModel) {
                    throw { statusCode: 500, message: "Failed to create product image" };
                }
            }else{
              
                for(let i = 0; i < item.Images.length; i++){
                      const data = {
                        productId:item.productId,
                        imageName:item.Images[i],
                        isMain:false,
                      }
                        const CreateProductImageModel  = await ProductImageModels.create(data)
                        if (!CreateProductImageModel) {
                            throw { statusCode: 500, message: "Failed to create product image" };
                        }
                };
            }
            const deleteFile = await ProductImageModels.destroy({
                where:{
                    imageName:null
                }
            })
            return {
                statusCode: 200,
            }
        }catch(error){
            throw { statusCode: error.statusCode || 400, message: error.message };
        }
    },
    deleteImage: async(name) => {
        try {
            const deleteFile = await ProductImageModels.destroy({
                where:{
                    imageName:name
                }
            })
            if(deleteFile){
                return {
                    statusCode: 200,
                    message: 'ลบรูปภาพสำเร็จ',
                }
            }
        } catch (error) {
            
        }
    }
    
}

module.exports = ProductImage