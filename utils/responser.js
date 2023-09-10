const responser = (res, data, status = 200) => {
  res.status(status).json({
    status: "success",
    results: data.length,
    data,
  });
};

module.exports = responser;
