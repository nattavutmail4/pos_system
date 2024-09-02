const MemberModels = require('../models/MemberModels');
const PackageModels = require('../models/PackageModels');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()
const Member = {
    list : async() =>{
        try {
            MemberModels.belongsTo(PackageModels)
            const getAll = await MemberModels.findAll({
                order:[['id','desc']],
                attributes:['id','name','phone','createdAt'],
                include:[{
                    model:PackageModels,
                    as:'package',
                    attributes:['name']
                }]
            });
            if(getAll.length > 0) {
                return {
                    statusCode: 200,
                    body: getAll
                }
            }else{
                throw { statusCode: 404, message: "ไม่พบข้อมูลสำเร็จ" }
            }
        } catch (error) {
          throw { statusCode: error.statusCode || 400, message: error.message };
            
        }
    },
    createMember: async(data) => {
        try {
            const isValidateMember = await MemberModels.findAll({
                where: {
                    phone: data.phone,
                }
            });
            if (isValidateMember.length === 0) {
                const newMember = await MemberModels.create({
                    packageId:data.RepairId,
                    name:data.name,
                    phone:data.phone,
                    pass:data.pass
                })
                 return {
                     statusCode: 201,
                     message:'success',
                     body: newMember
                 }
                   
            } else {
                throw { statusCode: 404, message: "Member already exists" };
            }
        } catch (error) {
          throw { statusCode: error.statusCode || 400, message: error.message };
            
        }
    },
    loginMember:  async(data) =>{
        try {
            const { username, password } = data;
            const isValidateMember = await MemberModels.findAll({
                where: {
                    phone: username,
                    pass:password
                },
                attributes:['id','phone','name']
            })
            if(isValidateMember.length > 0) {
                let token = jwt.sign({ id: isValidateMember[0].id }, process.env.SECRET, { expiresIn: '1h' });
                return {
                    statusCode: 200,
                    message:'success',
                    body: isValidateMember,
                    token: token,
                    isLogin:true,
                }
            }else{
                throw { statusCode: 401, message: "not found" };
            }
        } catch (error) {
            throw { statusCode: error.statusCode || 400, message: error.message };
        }
    },
    info: async(id) =>{
        try {
                MemberModels.belongsTo(PackageModels)
                const member = await MemberModels.findOne({
                    where: {
                        id: id
                    },
                    attributes:['id','phone','name'],
                    include:[{
                        model:PackageModels,
                        as:'package',
                        attributes:['name','bill_amount','price']
                    }]
                })
                return {
                    statusCode: 200,
                    message:'success',
                    body: member
                }
        } catch (error) {
            throw { statusCode: error.statusCode || 400, message: error.message };
        }
    },
    editMemberName: async(item) => {
        try {
            const isValidateId = await MemberModels.findAll({
                where: {
                    id: item.id
                }
            });
            if(isValidateId.length === 1){
                const updateName = await MemberModels.update(
                    {
                      name:item.name
                    },
                    {
                      where: {
                        id: item.id
                      }
                    }
                );
                if(updateName){
                    return {
                        statusCode: 200,
                        message:'success',
                    }
                }else{
                    throw { statusCode: 404, message: "not found" };
                }
            }else{
                throw { statusCode: 404, message: "not found" };
            }
        } catch (error) {
            throw { statusCode: error.statusCode || 400, message: error.message };
        }
    },
    editMemberPass: async(item) =>{
        try {
            const isValidateId = await MemberModels.findAll({
                where: {
                    id: item.id
                }
            });
            if(isValidateId.length === 1){
                const updatePass = await MemberModels.update(
                    {
                        pass:item.pass
                    },
                    {
                      where: {
                        id: item.id
                      }
                    }
                );
                if(updatePass){
                    return {
                        statusCode: 200,
                        message:'success',
                    }
                }else{
                    throw { statusCode: 404, message: "not found" };
                }
            }else{
                throw { statusCode: 404, message: "not found" };
            }
        } catch (error) {
            throw { statusCode: error.statusCode || 400, message: error.message };
        }
    }
}

module.exports = Member;