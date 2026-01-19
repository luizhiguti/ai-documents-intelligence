import dotenv from "dotenv";
import { createApp } from "./app";
import { connectMongo } from "./db/mongo";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await connectMongo();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.log("Failed to start server: ", err);
  process.exit(1);
});
