const UserModels = require('../models/UserModels')

module.exports = {
    all: async(userId) => {
       try {
          const query = await UserModels.findAll(
              {
                  order:[['id','desc']],
                  attributes:['id','name','user','level'],
                  where:{
                      userId:userId
                  }
              }
          );
          if(query.length > 0) {
              return {
                  statusCode: 200,
                  message:'success',
                  body: query
              }
          }else{
            throw { statusCode: 404, message: "User not found" };
          }
       } catch (error) {
        throw { statusCode: error.statusCode || 400, message: error.message };
       }
    },
    register: async (userId,item) => {
        try {
            // console.log(item)
            const isValidateUsername = await UserModels.findAll({
                where:{
                    user:item.username
                }
            })
            if(isValidateUsername.length > 0 ){
                throw { statusCode: 400, message: "Username already exists" };
            }
            const result = await UserModels.create({
                name: item.name,
                user: item.username,
                pwd: item.pwd,
                level: item.level,
                userId: userId
            });
             return {
                 statusCode: 201,
                 message:'เพิ่มข้อมูลสมาชิกสำเร็จ',
                 body: result
             }
        } catch (error) {
            throw { statusCode: error.statusCode || 400, message: error.message };

        }
    },
    editUser: async (id,item) => {
        try {
            const isValidateId = await UserModels.findByPk(id)
            if(isValidateId){
                const updateUser = await UserModels.update(item,
                    {
                        where:{
                            id:id
                        }
                    }
                )
                if(updateUser) {
                    return {
                        statusCode: 200,
                        message:'แก้ไขข้อมูลสมาชิกสำเร็จ',
                        body: updateUser
                    }
                }else{
                    throw { statusCode: 404, message: "แก้ไขข้อมูลไม่สำเร็จ" }
                }
            }else{
                throw { statusCode: 404, message: "ไม่พบข้อมูลสมาชิก" }
            }
        } catch (error) {
            throw { statusCode: error.statusCode || 400, message: error.message}
        }
    },
    editMemberPass:async(item) => {
        try {
            const isValidateId = await UserModels.findAll({
                where: {
                    id: item.id,
                }
            })
            if(isValidateId){
                let pass_old = item.body.oldpwd
                if(isValidateId[0].pwd == pass_old){
                    let newPwd = item.body.newpwd
                    const updatePass = await UserModels.update(
                        {
                            pwd:newPwd
                        },
                        {
                            where:{
                                id: isValidateId[0].id
                            }
                        }
                    )
                    if(updatePass){
                        return {
                            statusCode: 200,
                            message:'แก้ไขรหัสผ่านสำเร็จ',
                            body: updatePass
                        }
                    }else{
                        throw { statusCode: 404, message: "แก้ไขรหัสผ่านไม่สำเร็จ" }
                    }
                }else{
                    throw { statusCode: 400, message: "กรุณาระบุรหัสผ่านเก่าให้ถูกต้อง" }
                }
            }else{
                throw { statusCode: 404, message: "ไม่พบข้อมูลสมาชิก" }
            }
        } catch (error) {
            throw { statusCode: error.statusCode || 400, message: error.message}
        }
    },
    deleteByID: async(id) => {
        try {
            const isValidateId = await UserModels.findByPk(id)
            if(isValidateId){
                const deleteUser = await UserModels.destroy({
                    where:{
                        id:id
                    }
                })
                if(deleteUser) {
                    return {
                        statusCode: 200,
                        message:'ลบข้อมูลสมาชิกสำเร็จ',
                        body: deleteUser
                    }
                }else{
                    throw { statusCode: 404, message: "ลบข้อมูลไม่สำเร็จ" }
                }
            }else{
                throw { statusCode: 404, message: "ไม่พบข้อมูลสมาชิก" }
            }
        } catch (error) {
            throw { statusCode: error.statusCode || 400, message: error.message}
        }
    }
}