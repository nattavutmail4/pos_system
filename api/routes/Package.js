const express = require('express')
const router  =  express.Router()
const PackageControle =require('../controllers/PackageController');
const Servie = require('../controllers/Service')
router.get('/list', async(req, res) => {
    try {
        const package = await PackageControle.allPackages();
        return res.status(200).json(package);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || ' server error'
        })
    }
})

router.get('/countTotalUse', Servie.isLogin, async(req,res) => {
    try {
        const payload = {
            userId:req.member
        }
        const package = await PackageControle.countTotalBillSale(payload);
        return res.status(200).json(package);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message ||'server error'
        });
    }
})

router.get('/changePackage/:id', Servie.isLogin, async(req,res) => {
    try {
        const payload = {
            userId:req.member,
            packageId:req.params.id
        } 
        const results = await PackageControle.changePackage(payload)
        return res.status(200).json(results)
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message ||'server error'
        })
    }
})
module.exports = router