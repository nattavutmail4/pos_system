const express = require('express')
const router  =  express.Router()
const MemberController = require('../controllers/MemberController')
const Service = require('../controllers/Service');
router.get('/list',Service.isLogin, async(req,res) => { 
    try {
        const results = await MemberController.list()
        return res.status(200).json(results)
    } catch (error) {
        return res.status(error.statusCode || 500 ).json({
            message: error.message ||'server error'
        })
    }
})
router.get('/info', Service.isLogin, async(req,res) => {
    try {
        const token = req.member
        const payLoad =  await MemberController.info(token)
        return res.status(200).json(payLoad)
    } catch (error) {
        return res.status(error.statusCode || 500 ).json({
            message: error.message ||'server error'
        })
    }
})

router.post('/create', async(req,res) => {
    try{
        const package = await MemberController.createMember(req.body);
        return res.status(200).json(package);
    }catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || ' server error'
        })
    }
});

router.post('/login', async(req,res) => {
    try {
        const loginMember = await MemberController.loginMember(req.body);
        return res.status(200).json(loginMember);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message ||'server error'
        });
    }
})

router.put('/editProfile/:id', Service.isLogin,async(req,res) => {
    try{
        const item = { id: req.params.id, name: req.body.name}
        const editMember = await MemberController.editMemberName(item);
        return res.status(200).json(editMember);
    }catch(error){
        return res.status(error.statusCode || 500).json({
            message: error.message ||'server error'
        })
    }
})

router.put('/editPass/:id', Service.isLogin, async(req, res) => {
    try{
        const item = { id: req.params.id, pass: req.body.pass}
        const editMember = await MemberController.editMemberPass(item);
        return res.status(200).json(editMember);
    }catch(error){
        return res.status(error.statusCode || 500).json({
            message: error.message ||'server error'
        })
    }
})
module.exports = router
