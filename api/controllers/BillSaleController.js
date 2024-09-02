const BillSaleModels = require("../models/BillSaleModels");
const BillSaleDetailModels = require("../models/BillSaleDetailModels");
const ProductModels = require("../models/ProductModels");
const { Sequelize } = require("sequelize");
module.exports = {
  SaleList: async (payload) => {
    try {
        let results;
        const dateStart = new Date()
        const dateEnd = new Date()
        dateStart.setHours(0,0,0,0)
        dateEnd.setHours(23,59,59,999)
        const whereCondition = {
            userId: payload.userId,
            status: "pay",
            payData: {
            [Sequelize.Op.between]: [dateStart.toISOString(), dateEnd.toISOString()]
            }
        }
        
        if(payload.startDate !== "" && payload.endDate !== ""){
            const startDate = new Date(payload.startDate)
            startDate.setHours(0,0,0,0)
            const endDate = new Date(payload.endDate)
            endDate.setHours(23,59,59,999)
            whereCondition.payData = {
            [Sequelize.Op.between]: [startDate.toISOString(), endDate.toISOString()]
            }
        }

      BillSaleModels.hasMany(BillSaleDetailModels);
      BillSaleDetailModels.belongsTo(ProductModels);

      results  = await BillSaleModels.findAll({
        where:whereCondition,
        order:[['id','desc']],
        include:{
            model:BillSaleDetailModels,
            attributes: [
                "id",
                "billSaleId",
                "productId",
                "price",
                "qty",
                "userId",
            ],
            order: [["id", "desc"]],
            include: {
                model: ProductModels,
                attributes: ["barcode", "name"],
            },
        },
      })
      if (results.length > 0) {
        return {
          statusCode: 200,
          message: "success",
          body: results,
        };
      } else {
        throw { statusCode: 404, message: "Bill not found" };
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
    }
  },
  OpenBill: async (payload) => {
    try {
      const result = await BillSaleModels.findOne({
        where: payload,
      });
      if (result == null) {
        result = await BillSaleModels.create(payload);
        return {
          statusCode: 200,
          message: "Bill Opened Successfully",
        };
      } else {
        return {
          statusCode: 200,
          message: "Bill Already Opened",
          result: result,
        };
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
    }
  },
  SaleBill: async (payload, item) => {
    try {
      const currentBill = await BillSaleModels.findOne({ where: payload });
      if (currentBill != null) {
        const payloadData = {
          productId: item.id,
          billSaleId: parseInt(currentBill.id),
          userId: payload.userId,
          price: item.price,
        };
        const billSaleDetail = await BillSaleDetailModels.findOne({
          where: payloadData,
        });
        if (billSaleDetail == null) {
          payloadData.qty = 1;
          const data = {
            billSaleId: parseInt(currentBill.id),
            productId: item.id,
            qty: payloadData.qty,
            price: parseInt(item.price),
            userId: payload.userId,
          };
          const createdBill = await BillSaleDetailModels.create(data);
          if (createdBill) {
            return {
              statusCode: 200,
              message: "เพิ่มลงตะกร้าสินค้าสำเร็จ",
            };
          } else {
            throw { statusCode: 400, message: "Bill Sale Failed" };
          }
        } else {
          const updateBill = await BillSaleDetailModels.update(
            {
              qty: parseInt(billSaleDetail.qty) + 1,
            },
            {
              where: {
                productId: billSaleDetail.productId,
              },
            }
          );
          if (updateBill) {
            return {
              statusCode: 200,
              message: "เพิ่มลงตะกร้าสินค้าสำเร็จ",
            };
          } else {
            throw { statusCode: 400, message: "Bill Sale Failed" };
          }
        }
      } else {
        throw { statusCode: 400, message: " Bill Not Found" };
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
    }
  },
  SaleInfo: async (payload) => {
    try {
      BillSaleModels.hasMany(BillSaleDetailModels);
      BillSaleDetailModels.belongsTo(ProductModels);
      const result = await BillSaleModels.findOne(
        {
          where: {
            status: payload.status,
            userId: payload.userId,
          },
          include: {
            model: BillSaleDetailModels,
            attributes: ["id", "billSaleId", "productId", "price", "qty"],
            order: [["id", "desc"]],
            include: {
              model: ProductModels,
              attributes: ["name"],
            },
          },
        },
        { logging: true }
      );
      if (result != null) {
        return {
          statusCode: 200,
          message: "success",
          body: result,
        };
      } else {
        throw { statusCode: 404, message: "Product not found" };
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
    }
  },
  LastBill: async (payload) => {
    try {
      BillSaleModels.hasMany(BillSaleDetailModels);
      BillSaleDetailModels.belongsTo(ProductModels);
      const result = await BillSaleModels.findOne({
        where: {
          status: "pay",
          userId: payload.userId,
        },
        order: [["id", "desc"]],
        include: {
          model: BillSaleDetailModels,
          attributes: ["price", "qty"],
          order: [["id", "desc"]],
          include: {
            model: ProductModels,
            attributes: ["barcode", "name"],
          },
        },
      });
      if (result != null) {
        return {
          statusCode: 200,
          message: "success",
          body: result,
        };
      } else {
        throw { statusCode: 404, message: "Product not found" };
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
    }
  },
  TodayBill: async (payload) => {
    try {
      BillSaleModels.hasMany(BillSaleDetailModels);
      BillSaleDetailModels.belongsTo(ProductModels);

      /**
       *  ตั้งค่าวันที่ค้นหา
       */
      const StartDate = new Date();
      StartDate.setHours(0, 0, 0, 0);
      const Now = new Date();

      const Op = Sequelize.Op;

      const results = await BillSaleModels.findAll({
        where: {
          status: "pay",
          userId: payload.userId,
          payData: {
            [Op.between]: [StartDate.toISOString(), Now.toISOString()],
          },
        },
        order: [["id", "desc"]],
        include: {
          model: BillSaleDetailModels,
          attributes: ["price", "qty"],
          order: [["id", "desc"]],
          include: {
            model: ProductModels,
            attributes: ["barcode", "name"],
          },
        },
      });
      if (results != null) {
        return {
          statusCode: 200,
          message: "success",
          body: results,
        };
      } else {
        throw { statusCode: 404, message: "Product not found" };
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
    }
  },
  SearchByYearAndMonth: async(payload) =>{
    try {
      let arr = [];
      let y = payload.year;
      let m = payload.month;
      let daysInMonth = new Date(y,m,0).getDate() //ดึงวันของเดือนนั้นว่ามีกี่วัน
      const Op = Sequelize.Op;


      BillSaleModels.hasMany(BillSaleDetailModels)
      BillSaleDetailModels.belongsTo(ProductModels)

     
      for(let i = 1; i <= daysInMonth; i++) {
        const results = await BillSaleModels.findAll({
          where:{
            [Op.and]:[
              // Sequelize.fn ในที่นี้ fn = function
              // EXTRACT กระจ่ายข้อมูลต่างๆ เช่น ปี วัน เดือน 
              Sequelize.fn('EXTRACT(YEAR FROM "billSaleDetails"."createdAt") = ', y),
              Sequelize.fn('EXTRACT(MONTH FROM "billSaleDetails"."createdAt") = ', m),
              Sequelize.fn('EXTRACT(DAY FROM "billSaleDetails"."createdAt") = ', i),
             
            ],
             userId:payload.userId
          },
          include:{
            model:BillSaleDetailModels,
            attributes: [
                "id",
                "billSaleId",
                "productId",
                "price",
                "qty",
                "userId",
            ],
            include:{
              model:ProductModels,
              attributes: ["barcode", "name"],
            }
          }
        });
        
        //หาค่า sum ข้อมูลบิลยอดขายแต่ละวัน
        let sum = 0 ;

        for(let j = 0; j < results.length; j++){
          const result = results[j];
          for(let k = 0; k < result.billSaleDetails.length; k++){
              const item =  result.billSaleDetails[k];
              sum += parseInt(item.qty) * parseInt(item.price)
          }
        }

        arr.push({
           day:i,
           results,
           sum:sum
        });
      }
      return {
        statusCode: 200,
        message: "success",
        results: arr
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
      
    }
  },
  UpdateQty: async (item) => {
    try {
      // console.log(item.id);
      const isBillSaleId = await BillSaleDetailModels.findOne({
        where: {
          id: item.id,
        },
      });
      if (isBillSaleId) {
        const updateQty = await BillSaleDetailModels.update(
          {
            qty: item.qty,
          },
          {
            where: {
              id: item.id,
            },
          }
        );
        if (updateQty) {
          return {
            statusCode: 200,
            message: "แก้ไขจำนวนสินค้าสำเร็จ",
          };
        } else {
          throw { statusCode: 400, message: "แก้ไขจำนวนสินค้าไม่สำเร็จ" };
        }
      } else {
        throw { statusCode: 400, message: "ไม่พบรายการนี้" };
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
    }
  },

  DeleteCartItem: async (id) => {
    try {
      const DeleteCartItemRequest = await BillSaleDetailModels.destroy({
        where: {
          id: id,
        },
      });
      if (DeleteCartItemRequest) {
        return {
          statusCode: 200,
          message: "ลบรายการสินค้าสำเร็จ",
        };
      } else {
        throw { statusCode: 400, message: "ลบรายการสินค้าไม่สำเร็จ" };
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
    }
  },

  EndSale: async (payload) => {
    try {
      const isBillSaleId = await BillSaleModels.findOne({
        where: {
          userId: payload.userId,
          status: "open",
        },
      });
      if (isBillSaleId) {
        const CloseBill = await BillSaleModels.update(
          {
            status: "pay",
            payData: new Date(),
          },
          {
            where: {
              status: "open",
              userId: payload.userId,
            },
          }
        );
        if (CloseBill) {
          return {
            statusCode: 200,
            message: "บิลปิดการขายสำเร็จ",
          };
        } else {
          throw { statusCode: 400, message: "บิลปิดการขายไม่สำเร็จ" };
        }
      } else {
        throw { statusCode: 400, message: "ไม่พบบิลรายการที่จะปิดการขายนี้" };
      }
    } catch (error) {
      throw { statusCode: 400, message: error.message };
    }
  },
};
