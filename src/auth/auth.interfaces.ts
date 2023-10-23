import { User } from '@prisma/client';
import { Request } from 'express';

export interface JwtPayload {
  id: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
