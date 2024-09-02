const router = require('express').Router();
const UserController = require('../controllers/UserController')
const Service = require('../controllers/Service')
router.get('/list', Service.isLogin, async (req, res) => {
    try {
        const ShowUser = await UserController.all(req.member)
        return res.status(200).json(ShowUser)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            message: err.message || 'server error'
        })
    }
})

router.post('/insert', Service.isLogin, async (req, res) => {
    try {
        // console.log(req.body)
        const insertUser = await UserController.register(req.member,req.body)
        return res.status(200).json(insertUser)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            message: err.message || 'server error'
        })
    }
})

router.put('/edit/:id', Service.isLogin, async (req, res) => {
  try {
    const editUser = await UserController.editUser(req.params.id,req.body)
    return res.status(200).json(editUser)
  } catch (error) {
    return res.status(error.statusCode || 500).json({
        message: error.message ||'server error'
    })
  }
})

router.put('/editPass/:id', Service.isLogin, async (req, res) => {
    try {
        const item = { id: req.params.id, body: req.body}
        const editMember = await UserController.editMemberPass(item)
        return res.status(200).json(editMember)
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message ||'server error'
        })
    }
})


router.delete('/delete/:id', Service.isLogin, async (req, res) => {
  try {
    const isValidateId_andDelete = await UserController.deleteByID(req.params.id)
    return res.status(200).json(isValidateId_andDelete)
  } catch (error) {
    return res.status(error.statusCode || 500).json({
        message: error.message ||'server error'
    })
  }
})

module.exports = router;