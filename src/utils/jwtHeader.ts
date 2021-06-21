export const checkJWT = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.body.jwt = req.headers.authorization.split(' ')[1];
    next();
  } else {
    return res.status(401).json({
      message: 'Not logged in',
    });
  }
};
