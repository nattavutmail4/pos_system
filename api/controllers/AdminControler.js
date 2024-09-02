const AdminModel = require('../models/AdminModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config()
module.exports = {
    list:async() => {
        try{
            const listAdmin = await AdminModel.findAll();
            if(listAdmin.length > 0) {
                return {
                    statusCode: 200,
                    message:'ข้อมูลสำเร็จ',
                    body: listAdmin
                }
            }else{
                throw { statusCode: 404, message: "ไม่พบข้อมูลสำเร็จ" }
            }
        }catch(e){
            throw{statusCode:400 || e.statusCode, message:e.message}
        }
    },
    authenLogin:async(payload) => {
        try{
            const admin = await AdminModel.findOne({
                where: {
                    usr: payload.username,
                    pwd: payload.password
                }
            });
            if(admin != undefined){
                let token = jwt.sign({id:admin.id},  process.env.SECRET, { expiresIn: '1h' })
                admin.createdAt = new Date(admin.createdAt).toLocaleDateString('th-TH')
                admin.updatedAt = new Date(admin.updatedAt).toLocaleDateString('th-TH')
                return {
                    statusCode: 200,
                    message:'success',
                    body: admin,
                    token: token,
                    isLogin:true,
                }
            }else{
                throw { statusCode: 404, message: "กรุณาระบุ username หรือ password ให้ถูกต้อง" }
            }
        }catch(e){
            throw{statusCode:400 || e.statusCode, message:e.message}
        }
    },
    info:async(payload) => {
        try {
            const admin = await AdminModel.findOne({
                where: {
                    id: payload.id,
                },
                attributes:['id','name','level']
            });
            if(admin !=undefined) {
                 return {
                    statusCode: 200,
                    message:'success',
                    body: admin
                 }
            }else{
                throw { statusCode: 404, message: "ไม่พบข้อมูล" }
            }
        } catch (error) {
            throw{statusCode:400 || error.statusCode, message:error.message}
        }
    },
    save:async(payload) => {
        try {
            
            const Search = await AdminModel.findOne({
                where: {
                    usr: payload.usr,
                }
            });
            if(Search != undefined) {
                throw { statusCode: 400, message: "มีข้อมูลนี้ใช้อยู่แล้ว" }
            }else{
                const create = await AdminModel.create(payload)
                if(create) {
                    return {
                        statusCode: 200,
                        message:'บันทึกข้อมูลสำเร็จ',
                    }
                }else{
                    throw { statusCode: 404, message: "บันทึกข้อมูลไม่สำเร็จ" }
                }
            }
        } catch (error) {
            throw{statusCode:400 || error.statusCode, message:error.message}
        }
    },
    destroyAdmin: async(payload) => {
        try {
            const deleteAdmin = await AdminModel.destroy({
                where: {
                    id: payload.id,
                }
            })
            if(deleteAdmin) {
                return {
                    statusCode: 200,
                    message:'ลบข้อมูลสำเร็จ',
                }
            }else{
                throw { statusCode: 404, message: "ไม่พบข้อมูล" }
            }
        } catch (error) {
            throw{statusCode:400 || error.statusCode, message:error.message}
        }
    },

    updateAdmin: async(payload) => {
        try {
            const Search = await AdminModel.findOne({
                where: {
                    id: payload.id,
                }
            });
            if(Search != undefined) {
                const CheckName = await AdminModel.findAll({
                    where:{
                        name: payload.name,
                    }
                })
                if(CheckName.length > 0) {
                    throw { statusCode: 400, message: "มีชือซ้ำไม่สามารถเปลี่ยนได้" }
                }else{
                    const update = await AdminModel.update(
                        {
                            name: payload.name,
                            level: payload.level,
                            email:payload.email
                        },
                        {
                            where: {
                                id: payload.id,
                            }
                        }
                    );
                    if(update) {
                        return {
                            statusCode: 200,
                            message:'อัพเดทข้อมูลสำเร็จ',
                        }
                    }else{
                        throw { statusCode: 404, message: "อัพเดทข้อมูลไม่สำเร็จ" }
                    }
                }
              
               
            }else{
                throw { statusCode: 400, message: "ไม่พบข้อมูล" }
            }
        } catch (error) {
            throw{statusCode:400 || error.statusCode, message:error.message}
        }
    },

    editpass: async(payload) => {
        try {
            const Search = await AdminModel.findOne({
                where: {
                    id: payload.id,
                }
            });
            if(Search != undefined) {
                const update = await AdminModel.update(
                    {
                        pwd: payload.pwd,
                    },
                    {
                        where: {
                            id: payload.id,
                        }
                    }
                );
                if(update) {
                    return {
                        statusCode: 200,
                        message:'อัพเดทข้อมูลสำเร็จ',
                    }
                }else{
                    throw { statusCode: 404, message: "อัพเดทข้อมูลไม่สำเร็จ" }
                }
            }else{
                throw { statusCode: 400, message: "ไม่พบข้อมูล" }
            }
        } catch (error) {
            throw{statusCode:400 || error.statusCode, message:error.message}
        }
    }
}