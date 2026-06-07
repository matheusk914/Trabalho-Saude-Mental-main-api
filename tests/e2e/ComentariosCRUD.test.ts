import request from "supertest";
import { app } from "../../src/app";
import { connection } from "../../src/dbConnection";
import * as bcrypt from "bcryptjs";

const TEST_EMAIL_USER = "comentario.user@example.com";
const TEST_EMAIL_ADMIN = "comentario.admin@example.com";
const TEST_PASSWORD = "senha1234";
const UNIQUE_SERVICE_NAME = `Clínica Comentário Teste ${Date.now()}`;

let userToken: string;
let adminToken: string;
let userId: number;
let adminId: number;
let servicoId: number;
let comentarioId: number;

describe("Comentários E2E CRUD", () => {
    beforeAll(async () => {
        await connection.raw("SELECT 1");

        // Limpar dados anteriores
        await connection("usuarios").where({ email: TEST_EMAIL_USER }).del();
        await connection("usuarios").where({ email: TEST_EMAIL_ADMIN }).del();

        const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

        // Criar usuário comum
        const [user] = await connection("usuarios")
            .insert({
                nome: "User Comentário",
                email: TEST_EMAIL_USER,
                senha: passwordHash,
                role: "user",
                telefone: "11999999999",
            })
            .returning("*");
        userId = user.id;

        // Criar admin
        const [admin] = await connection("usuarios")
            .insert({
                nome: "Admin Comentário",
                email: TEST_EMAIL_ADMIN,
                senha: passwordHash,
                role: "admin",
                telefone: "11888888888",
            })
            .returning("*");
        adminId = admin.id;

        // Obter tokens
        const userLogin = await request(app)
            .post("/auth/login")
            .send({ email: TEST_EMAIL_USER, password: TEST_PASSWORD });
        userToken = userLogin.body.token;

        const adminLogin = await request(app)
            .post("/auth/login")
            .send({ email: TEST_EMAIL_ADMIN, password: TEST_PASSWORD });
        adminToken = adminLogin.body.token;

        // Criar serviço para os testes
        const [servico] = await connection("servicos")
            .insert({
                nome: UNIQUE_SERVICE_NAME,
                tipo: "Clínica",
                cidade: "Muriaé",
                endereco: "Rua dos Testes, 100",
                telefone: "32999999999",
                gratuito: false,
                categoria: "Psicologia",
                latitude: -21.13,
                longitude: -42.36,
            })
            .returning("*");
        servicoId = servico.id;
    });

    afterAll(async () => {
        await connection("comentarios").where({ servico_id: servicoId }).del();
        await connection("servicos").where({ id: servicoId }).del();
        await connection("usuarios").where({ email: TEST_EMAIL_USER }).del();
        await connection("usuarios").where({ email: TEST_EMAIL_ADMIN }).del();
        await connection.destroy();
    });

    test("1. deve listar comentários (GET /servicos/:id/comentarios) — público", async () => {
        const response = await request(app)
            .get(`/servicos/${servicoId}/comentarios`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
    });

    test("2. deve rejeitar criação sem autenticação (POST /servicos/:id/comentarios)", async () => {
        await request(app)
            .post(`/servicos/${servicoId}/comentarios`)
            .send({ texto: "Comentário sem token" })
            .expect(401);
    });

    test("3. deve criar comentário autenticado (POST /servicos/:id/comentarios)", async () => {
        const response = await request(app)
            .post(`/servicos/${servicoId}/comentarios`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ texto: "Ótimo atendimento, muito recomendo!" })
            .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body.texto).toBe("Ótimo atendimento, muito recomendo!");
        expect(response.body).toHaveProperty("nome_usuario");
        expect(response.body.usuario_id).toBe(userId);

        comentarioId = response.body.id;
    });

    test("4. deve rejeitar comentário com texto vazio", async () => {
        const response = await request(app)
            .post(`/servicos/${servicoId}/comentarios`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ texto: "   " })
            .expect(400);

        expect(response.body).toHaveProperty("error");
    });

    test("5. deve retornar o comentário criado na listagem", async () => {
        const response = await request(app)
            .get(`/servicos/${servicoId}/comentarios`)
            .expect(200);

        const encontrado = response.body.find((c: any) => c.id === comentarioId);
        expect(encontrado).toBeDefined();
        expect(encontrado.nome_usuario).toBeDefined();
    });

    test("6. deve editar o próprio comentário (PUT /comentarios/:id)", async () => {
        const response = await request(app)
            .put(`/comentarios/${comentarioId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ texto: "Texto editado pelo usuário" })
            .expect(200);

        expect(response.body.texto).toBe("Texto editado pelo usuário");
    });

    test("7. deve rejeitar edição de comentário de outro usuário (403)", async () => {
        const response = await request(app)
            .put(`/comentarios/${comentarioId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ texto: "Admin tentando editar" })
            .expect(403);

        expect(response.body).toHaveProperty("error");
    });

    test("8. admin deve conseguir deletar qualquer comentário (DELETE /comentarios/:id)", async () => {
        // Criar comentário novo para o admin deletar
        const criado = await request(app)
            .post(`/servicos/${servicoId}/comentarios`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ texto: "Comentário para admin deletar" });

        await request(app)
            .delete(`/comentarios/${criado.body.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(204);
    });

    test("9. usuário deve deletar seu próprio comentário (DELETE /comentarios/:id)", async () => {
        await request(app)
            .delete(`/comentarios/${comentarioId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(204);
    });

    test("10. deve retornar 404 para comentário inexistente", async () => {
        await request(app)
            .put(`/comentarios/999999`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ texto: "Texto" })
            .expect(404);
    });
});
