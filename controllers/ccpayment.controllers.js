const httpStatus = require("http-status");
const ccpaymentService = require("../services/ccpayment.services")
const catchAsync = require("../utils/catchAsync");
const log = console.log

const getPermanentDepositAddress = catchAsync (async (req, res) => {
    const path = "https://ccpayment.com/ccpayment/v2/getOrCreateAppDepositAddress";
    const user_id  = req.id
    const args = JSON.stringify({
        "referenceId": user_id.toString(), 
        "chain": "SOL",  
      });
    try {
        const pda = await ccpaymentService.ccpaymentService(path, args)
        res.status(200).json(pda)
    } catch (error) {
        console.log(error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            "message": "Internal Sever Error",
        })
    } 
});


const getDepositRecord = catchAsync(async (req, res) => {
    const { body: reqBody } = req;
    try {
        const record = await ccpaymentService.getDepositRecord(reqBody)
        res.send(record)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            "message": "Internal Sever Error",
        })
    }
});




module.exports = { getPermanentDepositAddress, getDepositRecord }