import { ResponseDto } from '@/common/dtos/response.dto';
import { UserEntity } from '../entities/user.entity';

export class GetMyProfileResponse extends ResponseDto<UserEntity> {}
