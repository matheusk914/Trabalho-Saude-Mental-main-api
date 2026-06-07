import { ComentarioBusiness } from "../src/business/ComentarioBusiness";
import { ComentarioData } from "../src/data/ComentarioData";
import { ComentarioComAutor } from "../src/types/Comentario";

jest.mock("../src/data/ComentarioData");

const MockComentarioData = ComentarioData as jest.MockedClass<typeof ComentarioData>;

const MOCK_COMENTARIO_COM_AUTOR: ComentarioComAutor = {
    id: 1,
    servico_id: 10,
    usuario_id: 5,
    texto: "Ótimo atendimento!",
    criado_em: new Date("2024-01-01"),
    atualizado_em: new Date("2024-01-01"),
    nome_usuario: "João Silva",
};

const MOCK_COMENTARIO_RAW = {
    id: 1,
    servico_id: 10,
    usuario_id: 5,
    texto: "Ótimo atendimento!",
    criado_em: new Date("2024-01-01"),
    atualizado_em: new Date("2024-01-01"),
};

describe("ComentarioBusiness", () => {
    let business: ComentarioBusiness;
    let mockDataInstance: jest.Mocked<ComentarioData>;

    beforeEach(() => {
        MockComentarioData.mockClear();
        business = new ComentarioBusiness();
        mockDataInstance = MockComentarioData.mock.instances[0] as jest.Mocked<ComentarioData>;
    });

    // ─── getByServicoId ───
    describe("getByServicoId", () => {
        test("deve retornar lista de comentários para servico_id válido", async () => {
            mockDataInstance.getByServicoId.mockResolvedValue([MOCK_COMENTARIO_COM_AUTOR]);

            const result = await business.getByServicoId(10);

            expect(mockDataInstance.getByServicoId).toHaveBeenCalledWith(10);
            expect(result).toHaveLength(1);
            expect(result[0].nome_usuario).toBe("João Silva");
        });

        test("deve lançar erro para servico_id inválido (NaN)", async () => {
            await expect(business.getByServicoId(NaN)).rejects.toThrow("servico_id inválido.");
        });
    });

    // ─── create ───
    describe("create", () => {
        test("deve criar comentário com dados válidos", async () => {
            mockDataInstance.create.mockResolvedValue(MOCK_COMENTARIO_COM_AUTOR);

            const result = await business.create({
                servico_id: 10,
                usuario_id: 5,
                texto: "Ótimo atendimento!",
            });

            expect(mockDataInstance.create).toHaveBeenCalledWith({
                servico_id: 10,
                usuario_id: 5,
                texto: "Ótimo atendimento!",
            });
            expect(result.id).toBe(1);
        });

        test("deve lançar erro se texto estiver vazio", async () => {
            await expect(
                business.create({ servico_id: 10, usuario_id: 5, texto: "   " })
            ).rejects.toThrow("O texto do comentário é obrigatório.");
        });

        test("deve lançar erro se texto ultrapassar 1000 caracteres", async () => {
            const textoLongo = "a".repeat(1001);
            await expect(
                business.create({ servico_id: 10, usuario_id: 5, texto: textoLongo })
            ).rejects.toThrow("O comentário não pode ultrapassar 1000 caracteres.");
        });

        test("deve lançar erro se servico_id for inválido", async () => {
            await expect(
                business.create({ servico_id: NaN, usuario_id: 5, texto: "Texto válido" })
            ).rejects.toThrow("servico_id é obrigatório.");
        });

        test("deve remover espaços extras do texto antes de salvar", async () => {
            mockDataInstance.create.mockResolvedValue(MOCK_COMENTARIO_COM_AUTOR);

            await business.create({
                servico_id: 10,
                usuario_id: 5,
                texto: "  Texto com espaços  ",
            });

            expect(mockDataInstance.create).toHaveBeenCalledWith(
                expect.objectContaining({ texto: "Texto com espaços" })
            );
        });
    });

    // ─── update ───
    describe("update", () => {
        test("deve atualizar comentário do próprio usuário", async () => {
            mockDataInstance.getById.mockResolvedValue(MOCK_COMENTARIO_RAW);
            mockDataInstance.update.mockResolvedValue({
                ...MOCK_COMENTARIO_COM_AUTOR,
                texto: "Texto atualizado",
            });

            const result = await business.update(1, "Texto atualizado", 5, "user");

            expect(result?.texto).toBe("Texto atualizado");
        });

        test("deve permitir que admin atualize comentário de outro usuário", async () => {
            mockDataInstance.getById.mockResolvedValue(MOCK_COMENTARIO_RAW);
            mockDataInstance.update.mockResolvedValue(MOCK_COMENTARIO_COM_AUTOR);

            await expect(
                business.update(1, "Novo texto", 99, "admin")
            ).resolves.not.toThrow();
        });

        test("deve lançar erro se usuário tentar editar comentário de outro", async () => {
            mockDataInstance.getById.mockResolvedValue(MOCK_COMENTARIO_RAW);

            await expect(
                business.update(1, "Texto", 99, "user")
            ).rejects.toThrow("Você só pode editar seus próprios comentários.");
        });

        test("deve lançar erro se comentário não existir", async () => {
            mockDataInstance.getById.mockResolvedValue(undefined);

            await expect(
                business.update(999, "Texto", 5, "user")
            ).rejects.toThrow("Comentário não encontrado.");
        });

        test("deve lançar erro se texto estiver vazio", async () => {
            await expect(
                business.update(1, "  ", 5, "user")
            ).rejects.toThrow("O texto do comentário é obrigatório.");
        });
    });

    // ─── delete ───
    describe("delete", () => {
        test("deve deletar comentário do próprio usuário", async () => {
            mockDataInstance.getById.mockResolvedValue(MOCK_COMENTARIO_RAW);
            mockDataInstance.delete.mockResolvedValue(true);

            const result = await business.delete(1, 5, "user");
            expect(result).toBe(true);
        });

        test("deve permitir que admin delete comentário de outro usuário", async () => {
            mockDataInstance.getById.mockResolvedValue(MOCK_COMENTARIO_RAW);
            mockDataInstance.delete.mockResolvedValue(true);

            await expect(business.delete(1, 99, "admin")).resolves.toBe(true);
        });

        test("deve lançar erro se usuário tentar deletar comentário de outro", async () => {
            mockDataInstance.getById.mockResolvedValue(MOCK_COMENTARIO_RAW);

            await expect(
                business.delete(1, 99, "user")
            ).rejects.toThrow("Você só pode excluir seus próprios comentários.");
        });

        test("deve lançar erro se comentário não existir", async () => {
            mockDataInstance.getById.mockResolvedValue(undefined);

            await expect(
                business.delete(999, 5, "user")
            ).rejects.toThrow("Comentário não encontrado.");
        });
    });
});
