const throwErr = (message, status, data) => {
  const err = new Error(message);
  if (status) {
    err.status = status;
  }

  if (data) {
    err.data = data;
  }

  throw err;
};

const throwErrToNext = (err, next) => {
  const error = new Error(err);
  next(error);
};

exports.throwErr = throwErr;
exports.throwErrToNext = throwErrToNext;
