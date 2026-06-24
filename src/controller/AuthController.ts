import { Request, Response } from "express";
import { AuthBusiness } from "../business/AuthBusiness";
export class AuthController {
  authBusiness = new AuthBusiness();
  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authBusiness.login({ email, password });
      res.status(200).send(result);
    } catch (error: any) {
      if (error.message.includes("Credenciais inválidas")) {
        return res.status(401).send({ error: error.message });
      }
      return res.status(400).send({ error: error.message });
    }
  };
  public signup = async (req: Request, res: Response) => {
    try {
      const { nome, email, password, telefone } = req.body;

      const result = await this.authBusiness.signup({
        nome,
        email,
        password,
        telefone,
      });

      res.status(201).send(result);
    } catch (error: any) {
      res
        .status(error.message.includes("e-mail já cadastrado") ? 409 : 400)
        .send({ error: error.message });
    }
  };

  public signupAdmin = async (req: Request, res: Response) => {
    try {
      const { nome, email, password, telefone } = req.body;

      const result = await this.authBusiness.signupAdmin({
        nome,
        email,
        password,
        telefone,
      });
      res.status(201).send(result);
    } catch (error: any) {
      res
        .status(error.message.includes("e-mail já cadastrado") ? 409 : 400)
        .send({ error: error.message });
    }
  };
}
