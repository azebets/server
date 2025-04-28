const crypto = require("crypto");
const { default: axios } = require("axios");
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const https = require("https");
require("dotenv").config();
const appId = "hVVUP4IvYQXjCyS3";
const appSecret = "9d76ea700db8c856a77d059f959b6ebc";

function verifySignature(content, signature, app_id, app_secret, timestamp) {
  let sign_text = `${app_id}${timestamp}${content}`;
  let server_sign = crypto.createHmac('sha256', app_secret).update(sign_text).digest('hex');
  return signature === server_sign;
}

const ccpaymentWebHook = (async(req, res)=>{
  const app_id = appId;
  const app_secret = appSecret;
  const timestamp = req.header('Timestamp');
  const sign = req.header('Sign');
  const sign_text = req.body;
  if (verifySignature(sign_text, sign, app_id, app_secret, timestamp)) {
      res.send('success');
  } else {
      res.status(401).send('Invalid signature');
  }
})


const getSignedText = (reqData, timestamp) => {
  try {
    const args = JSON.stringify(reqData);
    let signText = appId + timestamp;
    if (args.length !== 0) {
      signText += args;
    }
    const sign = crypto
      .createHmac("sha256", appSecret)
      .update(signText)
      .digest("hex");
    return sign
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not sign');
  }

}

const signToken = ((arg, timestamp)=>{
  try{
    const args = arg;
    let signText = appId + timestamp;
    if (args) {
      signText += args;
    }
    const sign = crypto
    .createHmac("sha256", appSecret)
    .update(signText)
    .digest("hex");
    return sign
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not sign');
  }
})


const ccpaymentServiceV2 = (async(reqData = {})=>{
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = signToken(reqData, timestamp)
  const path = "https://ccpayment.com/ccpayment/v2/getOrCreateAppDepositAddress";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Appid": appId,
      "Sign": sign,
      "Timestamp": timestamp.toString(),
    },
  };
  return await new Promise((resolve,reject) => {
    const req = https.request(path, options, (res) => {
      let respData = "";
      res.on("data", (chunk) => {
        respData += chunk;
      });
      res.on("end", () => {
        resolve(respData) 
      });
      });
      req.write(reqData);
      req.end();
  })
})


const ccpaymentService = (async( path, args)=>{  
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = signToken(args, timestamp)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Appid": appId,
      "Sign": sign,
      "Timestamp": timestamp.toString(),
    },
  };
  return await new Promise((resolve,reject) => {
    const req = https.request(path, options, (res) => {
      let respData = "";
    
      res.on("data", (chunk) => {
        respData += chunk;
      });
    
      res.on("end", () => {
        resolve(JSON.parse(respData)) 
      });
    });
    req.write(args);
    req.end();
  })
})

const getOrCreateAppDepositAddress = async (reqData  ) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = signToken(reqData, timestamp)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Appid": appId,
      "Sign": sign,
      "Timestamp": timestamp.toString(),
    },
  };
  return await new Promise((resolve,reject) => {
    const req = https.request(path, options, (res) => {
      let respData = "";
      res.on("data", (chunk) => {
        respData += chunk;
      });
      res.on("end", () => {
        resolve(JSON.parse(respData)) 
      });
      });
      req.write(reqData);
      req.end();
  })
  .catch (error =>{
    reject('Can not get ccpayment data')
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not get ccpayment data')
  }) 
}

const getDepositRecord = async (reqData = {}) => {
  const path = "https://ccpayment.com/ccpayment/v2/getAppDepositRecord";
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = getSignedText(reqData, timestamp)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Appid": appId,
      "Sign": sign,
      "Timestamp": timestamp.toString(),
    },
  };
  try {
    const res = await axios.post(path, reqData, options).then(res => res.data)
    return res
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not get ccpayment data');
  }
}

module.exports = {
  getOrCreateAppDepositAddress, getDepositRecord, ccpaymentService, ccpaymentWebHook
}