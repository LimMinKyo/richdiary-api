import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { OkResponseDto } from '../dtos/ok/ok.dto';

export const ApiCreatedResponseWithData = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  options?: { isArray?: boolean },
) =>
  applyDecorators(
    ApiExtraModels(OkResponseDto, dataDto),
    ApiCreatedResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(OkResponseDto) },
          {
            properties: {
              data: {
                ...(options?.isArray
                  ? { items: { $ref: getSchemaPath(dataDto) } }
                  : { $ref: getSchemaPath(dataDto) }),
              },
            },
          },
        ],
      },
    }),
  );
