import { ResponseDto } from '@/common/dtos/response.dto';
import { UserEntity } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetMyProfileResponse extends ResponseDto<UserEntity> {
  @ApiProperty({ type: UserEntity })
  data?: UserEntity;
}
