import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../entities/enum';

export type AuthTokenPayload = {
  sub: string;
  organizationId: string;
  email: string;
  role: UserRole;
  jti: string;
};

export function signAccessToken(
  payload: Omit<AuthTokenPayload, 'jti'>
): string {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn as SignOptions['expiresIn'],
  });
}

export function signRefreshToken(payload: Omit<AuthTokenPayload, 'jti'>) {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ ...payload, jti }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  });

  return { token, jti };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwt.accessSecret) 
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwt.refreshSecret) 
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}