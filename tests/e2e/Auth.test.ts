import request from "supertest";
import { app } from "../../src/app";
import { connection } from "../../src/dbConnection";
import * as bcrypt from "bcryptjs";
import { AuthUtils, TokenPayload } from "../../src/utils/AuthUtils";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test_secret";
process.env.JWT_EXPIRES_IN = "1h";

const TEST_EMAIL = "auth.test@example.com";
const TEST_PASSWORD = "password1234";
const TEST_TELEFONE = "(00) 0000-0000";
const TEST_NOME = "User Teste Auth";
const TEST_ROLE = "user"
const jwtVerifyMock = jest.spyOn(jwt, "verify");

describe("AuthUtils", () => {
  const mockPayload: TokenPayload = {
    userId: 1,
    email: "test@example.com",
    role: "user",
  };

  // Teste: Verifica se generateToken retorna uma string não vazia
  test("should generate a non-empty token", () => {
    const token = AuthUtils.generateToken(mockPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  // Teste: Verifica se verifyToken retorna o payload correto para um token válido
  test("should verify a valid token and return the payload", () => {
    const token = AuthUtils.generateToken(mockPayload);
    const payload = AuthUtils.verifyToken(token);
    expect(payload.userId).toBe(mockPayload.userId);
    expect(payload.email).toBe(mockPayload.email);
    expect(payload.role).toBe(mockPayload.role);
  });

  // Teste: Verifica se verifyToken lança um erro para um token inválido
  test("should throw an error for an invalid token", () => {
    jwtVerifyMock.mockImplementationOnce(() => {
      throw new Error("jwt malformed");
    });

     // Espera que a função lance o erro específico
    expect(() => AuthUtils.verifyToken("invalid.token.string")).toThrow(
      "Token inválido ou expirado"
    );
  });
});


describe("Testes E2E de Autenticação", () => {
  beforeEach(async () => {
    await connection.raw("SELECT 1"); 

    await connection("usuarios").where({ email: TEST_EMAIL }).del();

    const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

    await connection("usuarios").insert({
      nome: TEST_NOME,
      email: TEST_EMAIL,
      senha: passwordHash,
      telefone: TEST_TELEFONE,
      role: TEST_ROLE
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("deve logar um usuário com credenciais válidas com sucesso", async () => {
    const validCredentials = {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    };

    const response = await request(app)
      .post("/auth/login")
      .send(validCredentials)
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });

  test("deve retornar 401 para credenciais inválidas", async () => {
    const invalidCredentials = {
      email: "invalid@example.com",
      password: "wrongpassword",
    };

    const response = await request(app)
      .post("/auth/login")
      .send(invalidCredentials)
      .expect(401);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Credenciais inválidas");
  });
});
