const express = require('express');

const router = express.Router();

router.use('/package', require('./Package'));
router.use('/member', require('./Member'));
router.use('/product', require('./product'));
router.use('/user',require('./User'));
router.use('/billsale',require('./BillSale'));
router.use('/stock',require('./Stock'));
router.use('/bank', require('./Bank'));
router.use('/admin', require('./Admin'));
router.use('/changepackage', require('./ChangePackage'));


module.exports = router
