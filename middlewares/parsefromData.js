const ApiError = require("../utils/ApiError");
const formdataParser = (req, res, next) => {
  try {
    if (req.body.priceInfo) {
      req.body.priceInfo = JSON.parse(req.body.priceInfo);
    }
    if (req.body.multiBarcode) {
      req.body.multiBarcode = JSON.parse(req.body.multiBarcode);
    }
    if (req.body.additionalFood) {
      req.body.additionalFood = JSON.parse(req.body.additionalFood);
    }

    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "parse problem");
  }
};
module.exports = { formdataParser };
