import bcrypt from "bcryptjs";
import UsuarioData from "../data/UsuarioData";
import { SignupInput, LoginInput, AuthResponse } from "../dto/AuthDto";
import { AuthUtils } from "../utils/AuthUtils";
import FuncionarioData from "../data/FuncionarioData";


const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

export class AuthBusiness {
  userData = UsuarioData;
  funcionarioData = FuncionarioData;

  private async findUserForLogin(email: string) {
    
    const user = await this.userData.findByEmail(email);
    if (user) {
        return user; 
    }
    const funcionario = await this.funcionarioData.findByEmail(email);
    if (funcionario) {
        return { 
            ...funcionario, 
            role: 'user' 
        }; 
    }

    return undefined;
  }
  
  private async processSignup(
    input: SignupInput,
    role: "user" | "admin"
  ): Promise<AuthResponse> {
    try {
      if (!input.nome || !input.email || !input.password) {
        throw new Error(
          "Nome, e-mail e senha são obrigatórios para o cadastro."
        );
      }

      const existingUser = await this.userData.findByEmail(input.email);
      if (existingUser) {
        throw new Error("Este e-mail já está cadastrado.");
      }

      const senhaHash = await bcrypt.hash(input.password, SALT_ROUNDS);

      const newUser = await this.userData.create({
        nome: input.nome,
        email: input.email,
        telefone: input.telefone || "",
        senha: senhaHash,
        role: role,
      });

      const token = AuthUtils.generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      return {
        token,
        user: {
          id: newUser.id,
          name: newUser.nome,
          email: newUser.email,
          role: newUser.role,
        },
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async signup(input: SignupInput): Promise<AuthResponse> {
    return this.processSignup(input, "user");
  }

  public async signupUser(input: SignupInput): Promise<AuthResponse> {
    return this.processSignup(input, "user");
  }

  public async signupAdmin(input: SignupInput): Promise<AuthResponse> {
    return this.processSignup(input, "admin");
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      if (!input.email || !input.password) {
        throw new Error("Email e senha são obrigatórios");
      }

      const user: any = await this.findUserForLogin(input.email);
      if (!user) {
        throw new Error("Credenciais inválidas");
      }

      const passwordMatch = await bcrypt.compare(input.password, user.senha);
      if (!passwordMatch) {
        throw new Error("Credenciais inválidas");
      }

      const token = AuthUtils.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          name: user.nome,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
