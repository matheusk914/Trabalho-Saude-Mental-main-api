import { connection } from "../src/dbConnection";

describe("Conexão com o banco de dados e tratamento de erros", () => {
  test("deve conectar ao banco de dados", async () => {
    const result = await connection.raw("SELECT 1+1 AS result"); 

 expect(result.rows[0].result).toBe(2);  });

  afterAll(async () => {
    await connection.destroy();
  });
});
