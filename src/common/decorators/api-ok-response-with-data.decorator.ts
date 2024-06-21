import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { OkResponseDto } from '../dtos/ok/ok.dto';

export const ApiOkResponseWithData = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  options?: { isArray?: boolean },
) =>
  applyDecorators(
    ApiExtraModels(OkResponseDto, dataDto),
    ApiOkResponse({
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
