import { HttpStatus } from '@nestjs/common';

export function buildResponse(
  message: string,
  data: any = null,
  error: any = null,
  status: number = HttpStatus.OK,
  statusCode: string = '',
) {
  return {
    status,
    statusCode,
    success: status < 400,
    message,
    data,
    error,
  };
}
