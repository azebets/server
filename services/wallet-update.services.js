const mongoose = require('mongoose');
const USDTWALLET = require('../model/dollar-wallet');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const Bills = require('../model/bill');
const {convertToUSDT} = require("../services/convertion.services"); 
/**
 * Update user wallet balance
 * @param {Object} data - Wallet update data
 * @param {string} data.userId - User ID
 * @param {string} data.currency - Currency code
 * @param {number} data.amount - Amount to update
 * @param {string} data.operation - Operation type ('add' or 'subtract')
 * @param {string} data.transactionType - Transaction type for bill record
 * @returns {Promise<Object>} - Updated wallet
 */
const updateWalletBalance = async (data) => {
  const { userId, currency, amount, operation, transactionType } = data;
  
  // Start a transaction to ensure data consistency
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    let wallet;
    let tokenImg;
    let tokenName;
    let convertAmount;
    // Determine which wallet to update based on currency

    wallet = await USDTWALLET.findOne({ user_id: userId }).session(session);
    tokenImg = wallet.coin_image;
    tokenName = wallet.coin_name;
    convertAmount = await convertToUSDT(currency, amount);
    
    if (!wallet) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    
    // Calculate new balance
    let newBalance;
    if (operation === 'add') {
      newBalance = wallet.balance + convertAmount;
    } else if (operation === 'subtract') {
      if (wallet.balance < convertAmount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
      }
      newBalance = wallet.balance - convertAmount;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid operation');
    }
    
    // Update wallet balance

      await USDTWALLET.updateOne(
        { user_id: userId },
        { balance: newBalance },
        { session }
      );
  
    
    // Create bill record
    const billId = Math.floor(Math.random() * 1000000000);
    const billData = {
      user_id: userId,
      transaction_type: transactionType,
      token_img: tokenImg,
      token_name: tokenName,
      balance: newBalance,
      trx_amount: convertAmount,
      bill_id: billId,
      datetime: new Date(),
      status: true
    };
    
    await Bills.create([billData], { session });
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    

   return await USDTWALLET.findOne({ user_id: userId });

  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  updateWalletBalance
};
