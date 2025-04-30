const axios = require('axios');

/**
 * Converts a cryptocurrency to USDT using the current market rate.
 * @param {string} cryptoSymbol - The symbol of the cryptocurrency (e.g., BTC, LTC, SOL, USDC, TRX, ETH).
 * @param {number} amount - The amount of the cryptocurrency to convert.
 * @returns {Promise<number>} - The equivalent amount in USDT.
 */
async function convertToUSDT(cryptoSymbol, amount) {
    try {
        // Fetch the current market rate for the given cryptocurrency to USDT
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
            params: { symbol: `${cryptoSymbol}USDT` }
        });

        const marketRate = parseFloat(response.data.price); // Current market rate
        const usdtAmount = amount * marketRate; // Convert to USDT

        return usdtAmount;
    } catch (error) {
        console.error(`Error fetching ${cryptoSymbol} to USDT market rate:`, error.message);
        throw new Error(`Failed to convert ${cryptoSymbol} to USDT`);
    }
}

module.exports = { convertToUSDT };