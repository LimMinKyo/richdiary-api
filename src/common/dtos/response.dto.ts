export interface ResponseDto<T = undefined> {
  ok: boolean;
  message?: string;
  data?: T;
}
