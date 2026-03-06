import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

app.use(
  cors({
    origin: process.env.WEB_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.WEB_ORIGIN, credentials: true },
});

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("join", ({ userId }) => {
    if (!userId) return;

    socket.join(`user:${userId}`);
    console.log(userId, "has joined");
  });
  socket.on("disconnect", (reason) => {
    console.log("disconnected:", socket.id);
    console.log("reason:", reason);

    if (socket.userId) {
      console.log(socket.userId, "has disconnected");
    }
  });
  socket.on("join", ({ userId }) => {
    if (!userId) return;

    socket.userId = userId;
    socket.join(`user:${userId}`);
  });
});

app.post("/emit-notification", (req, res) => {
  const key = req.header("x-internal-key");
  if (key !== process.env.INTERNAL_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { userId, notification } = req.body || {};
  if (!userId || !notification) {
    return res.status(400).json({ error: "userId and notification required" });
  }

  io.to(`user:${userId}`).emit("notification:new", notification);
  console.log(notification)
  return res.json({ ok: true });
});

const port = Number(process.env.PORT || 4000);
server.listen(port, () => console.log(`Socket server running on ${port}`));
