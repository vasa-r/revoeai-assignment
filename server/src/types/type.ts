export interface responseType {
  success: boolean;
  message: string;
  error?: string;
}

export enum statusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  CONFLICT = 409,
  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  UNAVAILABLE = 503,
  TIMEOUT = 504,
}

export interface CustomError extends Error {
  status?: number;
}

export interface tableUpdateData {
  tableName: string;
  googleSheetId: string;
}
