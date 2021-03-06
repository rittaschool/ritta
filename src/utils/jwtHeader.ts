export const checkJWT = (req, reply, done) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    if (!req.body) req.body = {};
    req.body.jwt = req.headers.authorization.split(' ')[1];
    done();
  } else {
    return reply.status(401).send({
      message: 'Not logged in',
    });
  }
};
