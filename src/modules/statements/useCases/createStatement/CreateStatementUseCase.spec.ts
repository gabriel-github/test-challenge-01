import { AppError } from "../../../../shared/errors/AppError";
import { OperationType } from "../../entities/Statement";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement of deposit", async () => {
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

      const operation = await createStatementUseCase.execute(newStatement);

      expect(operation).toHaveProperty("id");
      expect(operation.user_id).toBe(userCreated.id);
    }
  });

  it("should be able to create a new statement of withdraw", async () => {
    const user = {
      name: "user test",
      email: "test@gmail.com",
      password: "1234",
    };

    const userCreated = await inMemoryUsersRepository.create(user);

    if (userCreated && userCreated.id) {
      const newStatementDeposit: ICreateStatementDTO = {
        user_id: userCreated.id,
        type: OperationType.DEPOSIT,
        amount: 3000,
        description: "site de pizza",
      };

      await createStatementUseCase.execute(newStatementDeposit);

      const newStatementWithdraw: ICreateStatementDTO = {
        user_id: userCreated.id,
        type: OperationType.WITHDRAW,
        amount: 200,
        description: "comprar pizza",
      };

      const operation = await createStatementUseCase.execute(
        newStatementWithdraw
      );

      expect(operation).toHaveProperty("id");
      expect(operation.user_id).toBe(userCreated.id);
    }
  });

  it("should not be able to create a new statement with user nonexistent", async () => {
    expect(async () => {
      const newStatement: ICreateStatementDTO = {
        user_id: "12890",
        type: OperationType.DEPOSIT,
        amount: 3000,
        description: "site de pizza",
      };

      const operation = await createStatementUseCase.execute(newStatement);

      expect(operation).toHaveProperty("id");
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new statement if value in account is less of value required", async () => {
    expect(async () => {
      const user = {
        name: "user test",
        email: "test@gmail.com",
        password: "1234",
      };

      const userCreated = await inMemoryUsersRepository.create(user);

      if (userCreated && userCreated.id) {
        const newStatement: ICreateStatementDTO = {
          user_id: userCreated.id,
          type: OperationType.WITHDRAW,
          amount: 3000,
          description: "comprar pizza",
        };

        await createStatementUseCase.execute(newStatement);
      }
    }).rejects.toBeInstanceOf(AppError);
  });
});
