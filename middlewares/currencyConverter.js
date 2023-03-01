const axios = require('axios');
const ApiError = require('../utils/ApiError')
const statusCode = require('http-status')
const CurrencyConverter = async (fromCurrency, currencyCode, amount) => {
    try {
        console.log(currencyCode)
        const {
            data
        } = await axios.get(
            `https://xecdapi.xe.com/v1/convert_from.json/?from=${fromCurrency}&to=${currencyCode}&amount=${amount}`, {
            headers: {
                Authorization: 'Basic aWRlYWxsdGVjaDk1OTIyMzMzOm42amY3N252dm9xbWdnaWoxYmtpdjdnZG9p'
            }
        }
        )
        return data
    } catch (error) {
        console.log(error.message)
        throw new ApiError(statusCode.INTERNAL_SERVER_ERROR, error.message)
    }
}


module.exports = {
    CurrencyConverter
}