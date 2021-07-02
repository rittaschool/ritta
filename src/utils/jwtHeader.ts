export const checkJWT = (req, reply, done) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.body.jwt = req.headers.authorization.split(' ')[1];
    done();
  } else {
    return reply.status(401).json({
      message: 'Not logged in',
    });
  }
};
