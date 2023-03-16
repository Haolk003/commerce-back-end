//not Found
const handleError = async (err: any, req: any, res: any, next: any) => {
  console.log(err);
  const errStatus = err.status || 500;
  const errMessage = err.message || "something went wrong ";
  return res.status(errStatus).json({
    success: false,
    message: errMessage,
    status: errStatus,
    stack: err.stack,
  });
};
const createError = (status: number, message: string) => {
  const err: any = new Error();
  err.status = status;
  err.message = message;
  return err;
};
export { handleError, createError };
