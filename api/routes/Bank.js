const Router = require('express').Router();
const Service = require('../controllers/Service');
const BankController = require('../controllers/BankController');

Router.get('/listbank', async(req,res) => {
    try {
        const response = await BankController.ListBank()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message ||'server error'
        })
    }
})

module.exports = Router;