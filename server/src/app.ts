import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { env, isProduction } from "./config/env.js";
import routes from "./routes/index.js";
import { getRobotsTxt, getSitemap } from "./controllers/sitemap.controller.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(isProduction ? "combined" : "dev"));

  // Global rate limit; auth routes layer a stricter one on top (see auth.routes.ts)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // Served only when Cloudinary isn't configured - see utils/cloudinary.ts
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  // Mounted at the app root (not /api/v1) since these need to live at the
  // real site root for crawlers - see the deployment note in
  // sitemap.controller.ts for how that maps onto a split frontend/backend.
  app.get("/sitemap.xml", getSitemap);
  app.get("/robots.txt", getRobotsTxt);

  app.use("/api/v1", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
