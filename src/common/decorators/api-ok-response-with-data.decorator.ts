import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { OkResponse } from '../responses/ok.response';

export const ApiOkResponseWithData = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  options?: { isArray?: boolean },
) =>
  applyDecorators(
    ApiExtraModels(OkResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(OkResponse) },
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
