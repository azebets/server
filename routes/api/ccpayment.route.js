const express = require('express')
const router = express.Router()

const ccpaymentController = require('../../controllers/ccpayment.controllers')
const webhook = require("../../services/ccpayment.services")
const requireAuth = require('../../middleware/requireAuth')


router.post('/get-permanent-deposit-address', requireAuth, ccpaymentController.getPermanentDepositAddress)
router.post('/get-deposit-record', ccpaymentController.getDepositRecord)
router.post('/webhook', webhook.ccpaymentWebHook)
module.exports = router