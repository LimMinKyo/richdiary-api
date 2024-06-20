import { PartialType } from '@nestjs/swagger';
import { CreateDividendRequest } from './create-dividend.dto';

export class UpdateDividendRequest extends PartialType(CreateDividendRequest) {}
