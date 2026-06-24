import { Request, Response, NextFunction } from "express";
import { AuthUtils } from '../utils/AuthUtils';

export function authorizeOwner(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const userId = (req as any).user?.userId; 
  const targetUserId = Number(req.params.id);

  if (!userId) {
    res.status(401).send("Usuário não autenticado");
    return;
  }

  if (userId !== targetUserId) {
    res.status(403).send("Você só pode editar seu próprio perfil");
    return;
  }

  next();
}

declare global {
 namespace Express {
 interface Request {
 user?: {
 userId: number;
 email: string;
 role: string;
 };
 }
 }
}
export class AuthMiddleware {
 static authenticate(req: Request, res: Response, next: NextFunction) {
 try {
  const authHeader = req.headers.authorization;
 if (!authHeader) {
  return res.status(401).send({ error: 'Token não fornecido' });
 }
 const token = authHeader.replace('Bearer ', '');
 if (!token) {
  return res.status(401).send({ error: 'Token malformatado' });
 }
 const payload = AuthUtils.verifyToken(token);
 req.user = payload;
 next();
 } catch (error: any) {
  return res.status(401).send({ error: 'Token inválido ou expirado' });
  }
 }
}