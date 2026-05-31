import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.refresh(req.body.refreshToken);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.logout(req.body.refreshToken);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}