import { AppError } from "./../../../../shared/errors/AppError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get statement operation", async () => {
    const user = {
      name: "user test",
      email: "test@gmail.com",
      password: "1234",
    };

    const userCreated = await inMemoryUsersRepository.create(user);

    if (userCreated && userCreated.id) {
      const newStatement: ICreateStatementDTO = {
        user_id: userCreated.id,
        type: OperationType.DEPOSIT,
        amount: 3000,
        description: "site de pizza",
      };

      const operation = await inMemoryStatementsRepository.create(newStatement);

      const statementOperation = await getStatementOperationUseCase.execute({
        user_id: userCreated.id,
        statement_id: operation.id!,
      });

      expect(statementOperation).toHaveProperty("id");
      expect(statementOperation.user_id).toBe(userCreated.id);
    }
  });

  it("should not be able to get statement operation with nonexistent user", async () => {
    expect(async () => {
      const newStatement: ICreateStatementDTO = {
        user_id: "1234",
        type: OperationType.DEPOSIT,
        amount: 3000,
        description: "site de pizza",
      };

      const operation = await inMemoryStatementsRepository.create(newStatement);

      await getStatementOperationUseCase.execute({
        user_id: "1234",
        statement_id: operation.id!,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to get statement operation with nonexistent statement", async () => {
    expect(async () => {
      const user = {
        name: "user test",
        email: "test@gmail.com",
        password: "1234",
      };

      const userCreated = await inMemoryUsersRepository.create(user);

      if (userCreated && userCreated.id) {
        await getStatementOperationUseCase.execute({
          user_id: userCreated.id,
          statement_id: "23345",
        });
      }
    }).rejects.toBeInstanceOf(AppError);
  });
});
