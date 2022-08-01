import { AppError } from "./../../../../shared/errors/AppError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to return user profile", async () => {
    const user = {
      name: "show profile test user",
      email: "test@email.com",
      password: "123",
    };

    const userCreated = await inMemoryUsersRepository.create(user);

    if (userCreated && userCreated.id) {
      const userProfile = await showUserProfileUseCase.execute(userCreated.id);

      expect(userProfile).toHaveProperty("id");
      expect(userProfile.email).toBe(user.email);
    }
  });

  it("should not be able to return user profile if user not exists", async () => {
    expect(async () => {
      const user = {
        id: "1234",
      };

      await showUserProfileUseCase.execute(user.id);
    }).rejects.toBeInstanceOf(AppError);
  });
});
