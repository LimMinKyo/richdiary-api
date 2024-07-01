import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);
  readonly paginator = this.$extends(
    pagination({
      pages: {
        limit: 10,
        includePageCount: true,
      },
    }),
  );

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    this.$on('query', ({ query }: Prisma.QueryEvent) => {
      this.logger.log(query);
    });
    this.$on('error', (event: Prisma.LogEvent) => {
      this.logger.verbose(event);
    });
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  async resetSequences() {
    const results = await this.$queryRawUnsafe<Array<{ relname: string }>>(`
      SELECT
        c.relname
      FROM
        pg_class AS c
      JOIN
        pg_namespace AS n ON c.relnamespace = n.oid
      WHERE
        c.relkind = 'S'
        AND n.nspname = 'public'
    `);

    results.forEach(async ({ relname }) => {
      await this.$executeRawUnsafe(
        `ALTER SEQUENCE "public"."${relname}" RESTART WITH 1;`,
      );
    });
  }

  async truncate() {
    const records = await this.$queryRawUnsafe<Array<{ tablename: string }>>(`
      SELECT 
        tablename
      FROM 
        pg_tables
      WHERE 
        schemaname = 'public'
    `);

    records.forEach(
      async (record) => await this.truncateTable(record['tablename']),
    );
  }

  private async truncateTable(tablename: string) {
    if (tablename === undefined || tablename === '_prisma_migrations') {
      return;
    }

    await this.$executeRawUnsafe(
      `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
    );
  }
}
