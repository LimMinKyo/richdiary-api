import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyEmailRequest {
  @ApiProperty()
  @IsString()
  code!: string;
}

export class VerifyEmailResponse extends ResponseDto {}
