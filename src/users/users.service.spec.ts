import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@/prisma/prisma.service';

const getMockPrisma = () => ({
  user: {
    create: jest
      .fn()
      .mockReturnValue({ id: 1, email: 'test@test.com', password: '12345' }),
    findUnique: jest
      .fn()
      .mockReturnValue({ id: 1, email: 'test@test.com', password: '12345' }),
  },
});

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: getMockPrisma() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('Success', () => {
      service.createAccount({ email: 'test@test.com', password: '12345' });
    });
  });
});
