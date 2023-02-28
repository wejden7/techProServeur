import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
//* Helpers import => #helpers
import connectDB from "#helpers/connect_db.js";
import JwtStrategy from "#helpers/jwt_strategy.js";

//* Middleware import => #middleware
import auth from "#middleware/auth.middleware.js";
//import { AuthorizationMiddleware } from "#middleware/authorization.middleware.js";
import { AuthorizationAdminMiddleware } from "#middleware/authorization.middleware.js";

//* Routes import => #routes
import authRouter from "#routes/auth.routes.js";
import etablissementRouter from "#routes/etablissement.routes.js";
import brancheRouter from "#routes/branch.routes.js";
import zoneRouter from "#routes/zone.routes.js";
import postRouter from "#routes/post.routes.js";
import employerRouter from "#routes/employer.routes.js";
import permissionTagsRouter from "#routes/permissionTags.routes.js";
import presenceRouter from "#routes/presence.routes.js";
import autorizationRouter from "#routes/autorization.routes.js";
import parametresRouter from "#routes/parametres.routes.js";
import merchandiseRouter from "#routes/merchandise.routes.js";
import entreeMerchandiseRouter from "#routes/entreeMerchandise.routes.js";
import demondMerchandiseRouter from "#routes/demeondMerchandise.routes.js";
import outMerchandiseRouter from "#routes/outMerchandise.routes.js";
import destroyMerchandiseRouter from "./src/routes/destroyMerchandise.routes.js";
//* Setup Environment Variables
dotenv.config();

const { PORT } = process.env;
const app = express();

//* passport Middleware
passport.use(JwtStrategy);

//* Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

//* Root Route
app.get("/", (req, res) =>
  res.status(200).json({ status: "Backend running." })
);

// * Error Handler Auth
const errorHandler = (error, req, res, next) => {
  console.log("hi err", error);
  return res.status(500).json({
    send2: "La connexion a échouée, merci de réessayer",
    error: error,
  });
};

//* Use Routes
app.use("/api/auth", authRouter);

app.use("/api", auth);

app.use("/api", etablissementRouter);
app.use("/api", brancheRouter);
app.use("/api", autorizationRouter);
//app.use("/api", AuthorizationMiddleware);
app.use("/api", parametresRouter);
app.use("/api", postRouter);
app.use("/api", zoneRouter);
app.use("/api", employerRouter);
app.use("/api", presenceRouter);
app.use("/api", merchandiseRouter);
app.use("/api", entreeMerchandiseRouter);
app.use("/api", demondMerchandiseRouter);
app.use("/api", outMerchandiseRouter);
app.use("/api", destroyMerchandiseRouter);
//app.use("/api", AuthorizationAdminMiddleware);
app.use("/api", permissionTagsRouter);
app.use("/api", errorHandler);

//* 404 Route
app.use((req, res) => res.status(404).json({ status: "Page not found." }));

const initializeApp = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () =>
      console.log(`Backend listening on port ${PORT}`)
    );
    // Socket setup
    const io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", function (socket) {
      console.log("connection : " + socket.id);

      socket.on("join-room", (data) => {
        socket.join(data);
      });

      socket.on("UPDATE-PRESENCE", (data) => {
        io.in(data).emit("RELODE-PRESECE", "room");
      });
    });
  } catch (e) {
    console.log(e);
  }
};
initializeApp();
