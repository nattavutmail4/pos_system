const ChangePackage = require('../models/ChangePackageModel')
const Package = require('../models/PackageModels');
const MemberModels = require('../models/MemberModels');
const { Sequelize } = require("sequelize");

module.exports = {
    ListPackage: async () => {
        try{
            ChangePackage.belongsTo(Package)
            ChangePackage.belongsTo(MemberModels, {
                foreignKey:{
                    name:"userId"
                }
            })
            const results = await ChangePackage.findAll({
                order:[['id','desc']],
                include:[
                    {
                        model:Package,
                    },
                    {
                        model:MemberModels,
                    }
                ],
                where:{
                    status:'wait'
                }
            });
            if(results.length > 0) {
                return {
                    statusCode: 200,
                    message:'success',
                    body: results
                }
            }else{
                throw { statusCode: 404, message: "Package not found" };
            }
        }catch(e){
            throw {statusCode:e.statusCode, message:e.message}
        }
    },
    SavePackage: async ( payload) => {
        try{
            const isChanagePackage = await ChangePackage.findOne({
                where:{
                    id:payload.id
                }
            })
            if(isChanagePackage != undefined){
                const MemberId = isChanagePackage.userId;
                const PackageId = isChanagePackage.packageId;
                const updateChangePackage = await ChangePackage.update(
                    {
                        status: payload.status,
                        payDate: payload.payDate,
                        payHour: payload.hour,
                        payMinute: payload.minute,
                        payRemark:payload.remark
                    },
                    {
                        where:{
                            id:payload.id
                        }
                    }
                )
                if(updateChangePackage) {
                    const updateMember = await MemberModels.update(
                        {
                             packageId: PackageId
                        },
                        {
                            where:{
                                id:MemberId
                            }
                        }
                    )
                    return {
                        statusCode: 200,
                        message:'อัพเดทข้อมูลสำเร็จ',
                    }
                }else{
                    throw { statusCode: 400, message: "อัพเดทข้อมูลไม่สำเร็จ" };
                }
            }else{
                throw { statusCode: 400, message: "ไม่พบข้อมูล Package ที่ต้องการอัพเดท" };
            }
        }catch(error) {
            throw { statusCode: 400, message: error.message };
        }
    }, 
    ReportSumSalePerDay : async(payload) => {
        try {
            // console.log(payload)   userId year month
            let arr = [];
            let y = payload.year;
            let m = payload.mounth;
            let daysInMonth = new Date(y,m,0).getDate() //ดึงวันของเดือนนั้นว่ามีกี่วัน
            const Op = Sequelize.Op;
            
            ChangePackage.belongsTo(Package);
            ChangePackage.belongsTo(MemberModels,{
                foreignKey:{
                    name:"userId"
                }
            });
            for(let i = 1; i <= daysInMonth; i++) {
                const results = await ChangePackage.findAll({
                    where:{
                        status:"success",
                        [Op.and]: [
                            Sequelize.fn('EXTRACT(YEAR FROM "changepackage"."createdAt") = ', y),
                            Sequelize.fn('EXTRACT(MONTH FROM "changepackage"."createdAt") = ', m),
                            Sequelize.fn('EXTRACT(DAY FROM "changepackage"."createdAt") = ', i),
                        ]
                    },
                    include:[
                        {
                            model:Package,
                            attributes:['name','price']
                        },
                        {
                            model:MemberModels,
                            attributes:['name']
                        }
                    ]
                })

                let sum = 0;
                for(let j=0; j < results.length; j++){
                    const item = results[j];
                    sum+= parseInt(item.package.price)
                }
                arr.push({ day:i,results:results,sum:sum})
            }
            return {
                statusCode: 200,
                message:'success',
                results: arr
            }

        } catch (error) {
            throw { statusCode: 400, message: error.message };
        }
    },

    ReportSumSalePerMonth: async(payload) => {
        try {
            let arr = [];
            let y = payload.year;
            const Op = Sequelize.Op;
            
            ChangePackage.belongsTo(Package);
            ChangePackage.belongsTo(MemberModels,{
                foreignKey:{
                    name:"userId"
                }
            });
            for(let i = 1; i <= 12; i++) {
                const results = await ChangePackage.findAll({
                    where:{
                        status:"success",
                        [Op.and]: [
                            Sequelize.fn('EXTRACT(YEAR FROM "changepackage"."createdAt") = ', y),
                            Sequelize.fn('EXTRACT(MONTH FROM "changepackage"."createdAt") = ', i),
                        ]
                    },
                    include:[
                        {
                            model:Package,
                            attributes:['name','price']
                        },
                        {
                            model:MemberModels,
                            attributes:['name','phone']
                        }
                    ]
                })

                let sum = 0;
                for(let j=0; j < results.length; j++){
                    const item = results[j];
                    sum+= parseInt(item.package.price)
                }
                arr.push({ month:i,results:results,sum:sum})
            }
            return {
                statusCode: 200,
                message:'success',
                results: arr
            }
        } catch (error) {
            throw { statusCode: 400, message: error.message };
        }
    },

    ReportSumSalePerYear: async() => {
        try {
            const myDate = new Date();
            let arr =[];
            const y = myDate.getFullYear();
            const startYear = ( y - 10) // เอาปีปัจจุบัน - 10 ย้อนหลังไป 10 ปี
            const Op = Sequelize.Op;
            ChangePackage.belongsTo(Package);
            ChangePackage.belongsTo(MemberModels,{
                foreignKey:{
                    name:"userId"
                }
            });

            for(let i = y; i >= startYear; i--) {
                const results = await ChangePackage.findAll({
                    where:{
                        status:"success",
                        [Op.and]: [
                            Sequelize.fn('EXTRACT(YEAR FROM "changepackage"."createdAt") = ', i),
                        ]
                    },
                    include:[
                        {
                            model:Package,
                            attributes:['name','price']
                        },
                        {
                            model:MemberModels,
                            attributes:['name','phone']
                        }
                    ]
                })

                let sum = 0;
                for(let j=0; j < results.length; j++){
                    const item = results[j];
                    sum+= parseInt(item.package.price)
                }
                arr.push({ year:i,results:results,sum:sum})
            }
            return {
                statusCode: 200,
                message:'success',
                results: arr
            }
        } catch (error) {
            throw { statusCode: 400, message: error.message };
            
        }
    }
}