import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import AuthController from "./auth-controller";
import AuthService from "./auth-service";
import User from "./models/User";
import mongoose from "mongoose";
import multer from "multer";
import { uploadFile } from "../middlewares/s3-middleware";
const authRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const authService = new AuthService();
const authController = new AuthController(authService);

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.get("/users", authController.getAllUsers);
export interface UserRequest {
  id: string;
  email: string;
  username: string;
  password: string;
}

authRouter.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = req.user as UserRequest;

    // Попробуем использовать populate
    const populatedUser = await User.findById(user.id).populate({
      path: "products", // Явно указываем поле для populate
      model: "Product", // Указываем модель, на которую ссылаемся
    });

    if (!populatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Authenticated user with populated products:", populatedUser);

    res.json(populatedUser);
  } catch (error) {
    console.error("Error in /auth/me route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

authRouter.put(
  "/user/icon",
  authMiddleware,
  upload.single("icon"), // Используем multer для загрузки одного файла с именем 'icon'
  async (req, res) => {
    try {
      const user = req.user as UserRequest; // Данные о пользователе, который делает запрос, из middleware
      const iconFile = req.file; // Получаем загруженный файл из запроса

      if (!iconFile) {
        return res.status(400).json({ message: "Файл не загружен" });
      }
      const bucketName = process.env.AWS_BUCKET_NAME!;
      // Создаем уникальное имя файла на основе user.id и текущего времени
      const imageKey = `sustex/${Date.now().toString()}-${
        iconFile.originalname
      }`;

      // Загружаем файл на S3
      const iconUrl = await uploadFile(bucketName, iconFile.buffer, imageKey);

      if (!iconUrl) {
        return res.status(500).json({ message: "Ошибка загрузки файла" });
      }

      // Обновляем иконку пользователя
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { icon: iconUrl },
        { new: true } // Возвращает обновленного пользователя
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      res.status(200).json({
        message: "Аватарка успешно обновлена",
        icon: updatedUser.icon,
      });
    } catch (error) {
      console.error("Ошибка при обновлении аватарки:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
);

authRouter.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You have access to this route!" });
});

export default authRouter;
