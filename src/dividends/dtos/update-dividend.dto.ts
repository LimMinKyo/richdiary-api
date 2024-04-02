import { PartialType } from '@nestjs/swagger';
import { CreateDividendRequest } from './create-dividend.dto';
import { ResponseDto } from '@/common/dtos/response.dto';

export class UpdateDividendRequest extends PartialType(CreateDividendRequest) {}

export class UpdateDividendResponse extends ResponseDto {}
