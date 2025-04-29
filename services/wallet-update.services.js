const mongoose = require('mongoose');
const ClyclixDollar = require('../model/dollar-wallet');
const FunCoupon = require('../model/fun-wallet');
const ClyclixPoint = require('../model/cp-wallet');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const Bills = require('../model/bill');

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
    
    // Determine which wallet to update based on currency
    if (currency === 'USD') {
      wallet = await ClyclixDollar.findOne({ user_id: userId }).session(session);
      tokenImg = wallet.coin_image;
      tokenName = wallet.coin_name;
    } else if (currency === 'FUN') {
      wallet = await FunCoupon.findOne({ user_id: userId }).session(session);
      tokenImg = wallet.coin_image;
      tokenName = wallet.coin_name;
    } else if (currency === 'CP') {
      wallet = await ClyclixPoint.findOne({ user_id: userId }).session(session);
      tokenImg = wallet.coin_image;
      tokenName = wallet.coin_name;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid currency');
    }
    
    if (!wallet) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    
    // Calculate new balance
    let newBalance;
    if (operation === 'add') {
      newBalance = wallet.balance + amount;
    } else if (operation === 'subtract') {
      if (wallet.balance < amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
      }
      newBalance = wallet.balance - amount;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid operation');
    }
    
    // Update wallet balance
    if (currency === 'USD') {
      await ClyclixDollar.updateOne(
        { user_id: userId },
        { balance: newBalance },
        { session }
      );
    } else if (currency === 'FUN') {
      await FunCoupon.updateOne(
        { user_id: userId },
        { balance: newBalance },
        { session }
      );
    } else if (currency === 'CP') {
      await ClyclixPoint.updateOne(
        { user_id: userId },
        { balance: newBalance },
        { session }
      );
    }
    
    // Create bill record
    const billId = Math.floor(Math.random() * 1000000000);
    const billData = {
      user_id: userId,
      transaction_type: transactionType,
      token_img: tokenImg,
      token_name: tokenName,
      balance: newBalance,
      trx_amount: amount,
      bill_id: billId,
      datetime: new Date(),
      status: true
    };
    
    await Bills.create([billData], { session });
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    // Return updated wallet
    if (currency === 'USD') {
      return await ClyclixDollar.findOne({ user_id: userId });
    } else if (currency === 'FUN') {
      return await FunCoupon.findOne({ user_id: userId });
    } else if (currency === 'CP') {
      return await ClyclixPoint.findOne({ user_id: userId });
    }
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
