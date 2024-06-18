import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationMeta, PaginationResponseDto } from '../dtos/pagination.dto';

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginationResponseDto, PaginationMeta, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              data: {
                properties: {
                  data: {
                    items: { $ref: getSchemaPath(dataDto) },
                  },
                  meta: {
                    $ref: getSchemaPath(PaginationMeta),
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
