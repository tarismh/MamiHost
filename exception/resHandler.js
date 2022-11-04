const ClientError = require('./clientError');

exports.resErrorHandler = (res, error) => {
  if (error.code === "ECONNREFUSED") {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Service Unavailable",
      dev: error.message,
    });
  }

  if(error instanceof ClientError) {
    const response = {
      success: false,
      message: error.message,
      error: error.errors,
    };
    return res.status(error.statusCode).json(response);
  }

  if(error.response){
    return res.status(error.response.status).json(error.response.data);
  }

  console.log(error);
  console.log(error.message);
  const response = {
    success: false,
    message: "Maaf, Terjadi Kegagalan Pada Server Kami.",
    dev: error,
  };
  return res.status(500).json(response);
};

exports.resSuccessHandler = (res, data, message, code = 200) => {
  const response = {
    success: true,
    message,
    data,
  };
  return res.status(code).json(response)
}