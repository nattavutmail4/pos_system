const Router = require('express').Router();
const Service = require('../controllers/Service');
const StockController = require('../controllers/StockController');
Router.get('/list',Service.isLogin, async(req, res) => {
  try {
     const payload = {
        userId:req.member,
     }
     const results = await StockController.list(payload);
     return res.status(200).json(results)
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Server error'
    })
  }
})

Router.get('/report',Service.isLogin, async(req,res) => {
  try {
      const results = await StockController.ReportStock({userId:req.member})
      return res.status(200).json(results)
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Server error'
    })
  }
})

Router.post('/save', Service.isLogin, async(req, res) => {
  try {
    const payload = {
      userId:req.member,
      productId:req.body.productId,
      qty:parseInt(req.body.qty)
    }
    const results = await StockController.SavePrd(payload);
    return res.status(200).json(results)
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Server error'
    })
  }
})

Router.delete('/destroy/:id', Service.isLogin, async(req, res) => {
  try{
     const payload = {
        userId:req.member,
        id:req.params.id
     }
     const results = await StockController.destroyItem(payload);
     return res.status(200).json(results)
  }catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Server error'
    })
  }
})

module.exports = Router;