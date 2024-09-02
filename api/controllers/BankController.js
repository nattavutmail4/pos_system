const BankModel = require('../models/BankModel');

module.exports = {
    ListBank: async() => {
        try{
           const getBank = await BankModel.findAll();
           if(getBank.length > 0) {
            return {
                statusCode: 200,
                message:'ดึงข้อมูลสำเร็จ',
                body: getBank
            }
           }else{
            throw { statusCode: 404, message: "ไม่พบข้อมูลสำเร็จ" }
           }
        }catch(e){
            throw { statusCode:400 || e.statusCode, message:e.message}
        }
    }
}