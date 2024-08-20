import { uploadFile } from "../middlewares/s3-middleware";
import openai from "../openai";

export class S3Service {
  async getProductLink(imageBuffer: Buffer, imageFileName: string) {
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const imageKey = `sustex/${Date.now().toString()}-${imageFileName}`;

    const imageUrl = await uploadFile(bucketName, imageBuffer, imageKey);
    const base64 = imageBuffer.toString("base64");

    return { imageUrl, base64 };
  }
  async checkClothStatus(base64: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Ты виртуальный контент-модератор, чья задача — анализировать изображения одежды и точно определять её состояние. Используй только следующие категории: "Новая с биркой", "Новая без бирки", "Надевалась один раз", "Надевалась несколько раз", "Есть дефекты", "На утиль". Дай один точный ответ, выбрав только из указанных категорий. 
          
          Никогда не отправляй ответ в вот таком формате: [На утиль], [Новая с биркой] и тд.

          Ответ должен всегда быть вот таким строго: "Новая с биркой", "Надевалась один раз" и тд.

          Если на изображении нет одежды или она не поддаётся определению, верни пустой массив [].`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
              },
            },
          ],
        },
      ],
    });

    const resJson = response.choices[0]?.message?.content;
    return resJson;
  }
}
