import { ResponseDto } from '@/common/dtos/response.dto';
import { User } from '@prisma/client';

export class GetMyProfileResponse extends ResponseDto<
  Omit<User, 'id' | 'password'>
> {}
