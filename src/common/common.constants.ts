export const SWAGGER_AUTH_TOKEN_KEY = 'access-token';

export enum ResponseStatus {
  OK = 'OK',
  SERVER_ERROR = 'SERVER_ERROR',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CONFLICT = 'CONFLICT',
  EMAIL_ALREADY_EXIST = 'EMAIL_ALREADY_EXIST',
  VERIFY_CODE_INVALID = 'VERIFY_CODE_INVALID',
}

export const errorMessage = {
  [ResponseStatus.SERVER_ERROR]: '서버 에러가 발생했습니다.',
  [ResponseStatus.PERMISSION_DENIED]: '권한이 없습니다.',
  [ResponseStatus.DATA_NOT_FOUND]: '데이터가 존재하지 않습니다.',
  [ResponseStatus.EMAIL_ALREADY_EXIST]: '해당 이메일은 이미 존재합니다.',
  [ResponseStatus.VERIFY_CODE_INVALID]: '인증코드가 유효하지 않습니다.',
};
