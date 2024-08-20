import apiClient from "./Interceptors";

interface UserDTO {
  email: string;
  username: string;
  password: string;
  city: string;
}

interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  city: string;
  treeCount: number;
  icon: string;
  bonus: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export class UserService {
  private static instance: UserService;
  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async login(email: string, password: string) {
    try {
      const response = await apiClient.post("/api/v1/login", {
        email,
        password,
      });

      return response;
    } catch (error) {
      throw new Error("Login failed");
    }
  }

  public async register(userDTO: UserDTO) {
    try {
      const response = await apiClient.post("/api/v1/register", userDTO);
      return response.data;
    } catch (error) {
      throw new Error("Registration failed");
    }
  }

  public async userInfo(): Promise<User> {
    try {
      const response = await apiClient.get("/api/v1/auth/me");
      return response.data;
    } catch (error) {
      throw new Error("Failed to get user info");
    }
  }
}
