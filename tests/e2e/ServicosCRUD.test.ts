import request from "supertest";
import { app } from "../../src/app";
import { connection } from "../../src/dbConnection";
import * as bcrypt from "bcryptjs";

const TEST_EMAIL_CRUD = "crud.safetest@example.com";
const TEST_PASSWORD = "safepassword";
const TEST_ADMIN_NOME = "Admin CRUD Seguro";
const UNIQUE_SERVICE_NAME = `Hospital de Teste Seguro ${Date.now()}`;

let adminToken: string;
let createdServiceId: number;

describe("Serviços E2E CRUD (Limpeza Focada e Segura)", () => {

    beforeAll(async () => {
        await connection.raw("SELECT 1");

        await connection("usuarios").where({ email: TEST_EMAIL_CRUD }).del();
        
        const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

        await connection("usuarios").insert({
            nome: TEST_ADMIN_NOME,
            email: TEST_EMAIL_CRUD,
            senha: passwordHash,
            role: "admin",
            telefone: "99999999999"
        });

        const loginResponse = await request(app)
            .post("/auth/login")
            .send({ email: TEST_EMAIL_CRUD, password: TEST_PASSWORD });

        adminToken = loginResponse.body.token;
    });

    afterAll(async () => {
        if (createdServiceId) {
            await connection("servicos").where({ id: createdServiceId }).del();
        }
        
        await connection("usuarios").where({ email: TEST_EMAIL_CRUD }).del();
        
        await connection.destroy();
    });

   
    test("1. deve criar um novo serviço com nome único (POST /servicos)", async () => {
        const novoServico = {
            nome: UNIQUE_SERVICE_NAME,
            tipo: "Urgência",
            cidade: "Muriaé",
            endereco: "Rua do Teste E2E, 10",
            telefone: "32555555555",
            gratuito: true,
            categoria: "Saúde",
        };

        const response = await request(app)
            .post("/servicos")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(novoServico)
            .expect(201);

        createdServiceId = response.body.id; 
        
        expect(response.body).toHaveProperty("id");
        expect(response.body.nome).toBe(UNIQUE_SERVICE_NAME);
        expect(response.body).toHaveProperty("latitude");
    });
    
 
    test("2. deve buscar o serviço recém-criado por ID (GET /servicos/:id)", async () => {
        
        const response = await request(app)
            .get(`/servicos/${createdServiceId}`)
            .expect(200);

        expect(response.body).toHaveProperty("id", createdServiceId);
        expect(response.body.nome).toBe(UNIQUE_SERVICE_NAME);
    });

    test("3. deve atualizar o serviço criado com sucesso (PUT /servicos/:id)", async () => {
        
        const dadosParaAtualizar = {
            cidade: "São Paulo", 
            gratuito: false,     
        };

        const response = await request(app)
            .put(`/servicos/${createdServiceId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(dadosParaAtualizar)
            .expect(200);

        expect(response.body).toHaveProperty("id", createdServiceId);
        expect(response.body.cidade).toBe("São Paulo");
        expect(response.body.gratuito).toBe(false);
    });
});