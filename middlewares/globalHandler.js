const globalErrHandler = (err, req, res, next) => {
  // status: failed/something/server error
  // message:
  // stack:which file and which line the error occured
  const stack = err.stack;
  const message = err.message;
  const status = err.status ? err.status : "failed";
  const statusCode = err.statusCode ? err.statusCode : 500;
  // send response
  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

module.exports = globalErrHandler;
