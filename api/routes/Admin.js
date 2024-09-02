const router = require('express').Router();
const AdminController = require('../controllers/AdminControler')
const Service = require('../controllers/Service')

router.get('/list', async(req,res) => {
    try {
        const response = await AdminController.list();
        return res.status(200).json(response)
    } catch (error) {
        return res.status(error.statusCode || 500 ).json({
            message: error.message ||'server error'
        })
    }
})
router.get('/info', Service.isLogin, async(req, res) => {
    try{
        const payload = {
            id:req.member
        }
        // console.log(payload)
        const response =await AdminController.info(payload)
        return res.status(200).json(response)
    }catch(error){
        return res.status(error.statusCode || 500 ).json({
            message: error.message ||'server error'
        })
    }
})
router.post('/signin', async(req, res) => {
    try {
        const payload = {
            username:req.body.username,
            password:req.body.password
        }
        // console.log(payload)
        const response = await AdminController.authenLogin(payload);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(error.statusCode || 500 ).json({
            message: error.message ||'server error'
        })
    }
})

router.post('/save', Service.isLogin, async(req, res) => {
    try { 
        const payload = {
            name:req.body.name,
            usr:req.body.usr,
            pwd:req.body.pwd,
            email:req.body.email,
            level:req.body.level
        };
        const results = await AdminController.save(payload)
        return res.status(200).json(results)
    } catch (error) {
        return res.status(error.statusCode || 500 ).json({
            message: error.message ||'server error'
        })
    }
})

router.put('/update/:id', Service.isLogin, async(req, res) => {
    try {
        const payload = {
            id:req.params.id,
            name:req.body.name,
            email:req.body.email,
            level:req.body.level
        }
        const results = await AdminController.updateAdmin(payload)
        return res.status(200).json(results)
    } catch (error) {
        return res.status(error.statusCode || 500 ).json({
            message: error.message ||'server error'
        })
    }
});

router.put('/editpass/:id', Service.isLogin, async(req, res,) => {
    try {
        const payload = {
            id:req.params.id,
            pwd:req.body.pwd
        }

        const results = await AdminController.editpass(payload)
        return res.status(200).json(results)
    } catch (error) {
        return res.status(error.statusCode || 500 ).json({
            message: error.message ||'server error'
        })
    }
});

router.delete('/destroy/:id', Service.isLogin, async(req, res) => {
    try {
        const payload = {
            id:req.params.id
        }
        const results = await AdminController.destroyAdmin(payload)
        return res.status(200).json(results)
    } catch (error) {
        return res.status(error.statusCode || 500 ).json({
            message: error.message ||'server error'
        })
    }
})
module.exports = router;