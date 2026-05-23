import UsuarioBusiness from "../src/business/UsuarioBusiness";
import UsuarioController from "../src/controller/UsuarioController";
import { Usuario } from "../src/types/Usuario";
import UsuarioData from "../src/data/UsuarioData";

jest.mock("../src/data/UsuarioData", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findAllWithFilters: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

describe("Integração Usuário Business <-> Data", () => {
  const MOCK_ID = 5;

  const MOCK_USUARIO: Usuario = {
    id: 5,
    nome: "Usuário Beta",
    email: "betatester@gmail.com",
    senha: "123456789",
    telefone: "(55)5555-5555",
    role: "user",
    data_cadastro: new Date("2024-01-01"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Deve chamar FindById na camada Data ao detalhar um usuário", async () => {
    const mockData = UsuarioData as jest.Mocked<typeof UsuarioData>;

    mockData.findById.mockResolvedValue(MOCK_USUARIO);

    const result = await UsuarioBusiness.detalhar(MOCK_ID);

    expect(mockData.findById).toHaveBeenCalledWith(MOCK_ID);
    expect(result).toEqual(MOCK_USUARIO);
  });

  test("Deve retornar undefined quando o usuário não for encontrado", async () => {
    const mockData = UsuarioData as jest.Mocked<typeof UsuarioData>;

    mockData.findById.mockResolvedValue(undefined);

    const result = await UsuarioBusiness.detalhar(MOCK_ID);

    expect(result).toBeUndefined();
    expect(mockData.findById).toHaveBeenCalledTimes(1);
  });

  test("Deve criar um novo usuário quando o e-mail não existe", async () => {
    const mockData = UsuarioData as jest.Mocked<typeof UsuarioData>;

    mockData.findByEmail.mockResolvedValue(undefined);
    mockData.create.mockResolvedValue(MOCK_USUARIO);

    const result = await UsuarioBusiness.cadastrar({
    nome: "Usuário Beta",
    email: "betatester@gmail.com",
    senha: "123456789",
    telefone: "(55)5555-5555",
    role: "user",
    });

    expect(mockData.findByEmail).toHaveBeenCalledWith("betatester@gmail.com");
    expect(result).toEqual(MOCK_USUARIO);
  });

  test("Deve retornar erro quando o e-mail já existe", async () => {
    const mockData = UsuarioData as jest.Mocked<typeof UsuarioData>;

    mockData.findByEmail.mockResolvedValue(MOCK_USUARIO);

    const result = await UsuarioBusiness.cadastrar({
    nome: "Usuário Beta",
    email: "betatester@gmail.com",
    senha: "123456789",
    telefone: "(55)5555-5555",
    role: "user",
    });

    expect(result).toEqual({ error: "E-mail já cadastrado." });
  });

  test("Deve chamar update e retornar o usuário atualizado", async () => {
    const mockData = UsuarioData as jest.Mocked<typeof UsuarioData>;

    mockData.update.mockResolvedValue(1);
    mockData.findById.mockResolvedValue(MOCK_USUARIO);

    const result = await UsuarioBusiness.atualizar(MOCK_ID, { nome: "Novo Nome" });

    expect(mockData.update).toHaveBeenCalled();
    expect(result).toEqual(MOCK_USUARIO);
  });

  test("Deve retornar verdadeiro quando a remoção ocorre", async () => {
    const mockData = UsuarioData as jest.Mocked<typeof UsuarioData>;
    mockData.remove.mockResolvedValue(1);

    const result = await UsuarioBusiness.remover(MOCK_ID);

    expect(result).toBe(true);
  });

});
