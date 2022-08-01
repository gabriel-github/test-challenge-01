import { AppError } from "./../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able get balance account", async () => {
    const user = {
      name: "user test",
      email: "test@gmail.com",
      password: "1234",
    };

    const userCreated = await inMemoryUsersRepository.create(user);

    if (userCreated && userCreated.id) {
      const balance = await getBalanceUseCase.execute({
        user_id: userCreated.id,
      });

      expect(balance).toHaveProperty("statement");
      expect(balance).toHaveProperty("balance");
    }
  });

  it("should be able get balance by nonexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
