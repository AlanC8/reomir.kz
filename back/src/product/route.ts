import { Router } from "express";
import multer from "multer";
import { S3Service } from "./s3-service";
import getFinalStatus from "./utils";
import Product from "./model";
import authMiddleware from "../middlewares/auth-middleware";
import { UserRequest } from "../auth/auth-router";
import User from "../auth/models/User";
import axios from "axios";
const productRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const s3service = new S3Service();

productRouter.post(
  "/product",
  authMiddleware,
  upload.fields([
    { name: "first_pic", maxCount: 1 },
    { name: "second_pic", maxCount: 1 },
    { name: "third_pic", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (req.files === undefined) {
        return res.status(400).json({ message: "Фотографии не загружены" });
      }

      const user = req.user as UserRequest;
      const id = user.id;

      const firstPic = req.files["first_pic"]
        ? req.files["first_pic"][0]
        : null;
      const secondPic = req.files["second_pic"]
        ? req.files["second_pic"][0]
        : null;
      const thirdPic = req.files["third_pic"]
        ? req.files["third_pic"][0]
        : null;

      const uploadedPhotos: any = [];
      if (firstPic) uploadedPhotos.push(firstPic);
      if (secondPic) uploadedPhotos.push(secondPic);
      if (thirdPic) uploadedPhotos.push(thirdPic);

      if (uploadedPhotos.length === 0) {
        return res
          .status(400)
          .json({ message: "Необходимо загрузить хотя бы одну фотографию" });
      }

      const productResults: any = [];
      const productLinks: any = [];
      for await (const photo of uploadedPhotos) {
        const link = await s3service.getProductLink(
          photo.buffer,
          photo.originalname
        );
        const reslt = await s3service.checkClothStatus(link.base64);
        productResults.push(reslt);
        productLinks.push(link.imageUrl);
      }

      const finalStatus = getFinalStatus(productResults);

      const newProduct = new Product({
        title: req.body.title,
        photo: productLinks,
        brand: req.body.brand,
        price: req.body.price,
        size: req.body.size,
        description: req.body.description,
        status: finalStatus,
        user: id,
      });

      await newProduct.save();

      // Добавляем продукт в массив products пользователя
      await User.findByIdAndUpdate(id, { $push: { products: newProduct._id } });

      return res.status(201).json({
        message: "Продукт успешно создан и загружен",
        product: newProduct,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка при загрузке продукта" });
    }
  }
);

productRouter.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("user", "username email");
    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при загрузке продуктов" });
  }
});

productRouter.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "user",
      "username email"
    );
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }
    return res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при загрузке продукта" });
  }
});

interface UserRequestPicture {
  id: string;
  email: string;
  username: string;
  password: string;
  icon: string;
}
productRouter.post("/product/vton", authMiddleware, async (req, res) => {
  try {
    const user = req.user as UserRequestPicture;
    const human_img = user.icon;
    const response = await axios.post(
      "https://sande-back-production-35e5.up.railway.app/api/v1/vton-link",
      {
        human_img,
        garm_img: req.body.garm_img,
        category: req.body.category || "upper_body",
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при загрузке продукта" });
  }
});

export default productRouter;
