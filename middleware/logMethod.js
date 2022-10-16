function logMethod(req, res, next) {
  console.log('Request Type:', req.method);
  //console.log('Request Headers:', req.headers);
  next();
}

module.exports = {
  logMethod,
};
