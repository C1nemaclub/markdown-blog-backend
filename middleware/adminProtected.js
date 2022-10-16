function adminProtected(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      if (token === process.env.ADMIN_KEY) {
        next();
      } else {
        res.status(400).json({
          message: 'Access Denied Wrong Authorization',
        });
      }
    } else {
      res.status(400).json({
        message: 'No authorization key was provided',
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
}

module.exports = {
  adminProtected,
};
