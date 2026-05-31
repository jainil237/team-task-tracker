import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      organizationId: payload.organizationId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}