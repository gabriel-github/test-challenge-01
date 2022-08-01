import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be to able authenticate with user", async () => {
    const user = {
      name: "user authenticate",
      email: "authenticate@gmail.com",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const responseToken = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(responseToken.user).toHaveProperty("id");
    expect(responseToken).toHaveProperty("token");
  });

  it("should not be to able authenticate with user nonexistent", async () => {
    expect(async () => {
      const user = {
        name: "user nonexistent",
        email: "authenticate@gmail.com",
        password: "1234",
      };

      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be to able authenticate with incorrect password", async () => {
    expect(async () => {
      const user = {
        name: "user authenticate",
        email: "authenticate@gmail.com",
        password: "1234",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "1234567",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
