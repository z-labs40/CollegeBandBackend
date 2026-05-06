import { Request, Response, NextFunction } from 'express';
import { AuthUseCase } from '../../application/use-cases/AuthUseCase';

export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authUseCase.signup(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.authUseCase.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.authUseCase.adminLogin(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async setupAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authUseCase.setupAdmin(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }
}
