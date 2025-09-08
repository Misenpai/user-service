import express from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Create user
app.post("/users", async (req, res) => {
  try {
    const users = req.body; // expecting an array of users

    const finalUsers = users.map((u) => ({
      username: u.username,
      employeeId: u.employeeId,
      empClass: u.empClass,
      projectKey: u.projectKey || crypto.randomBytes(8).toString("hex"),
    }));

    const createdUsers = await prisma.user.createMany({
      data: finalUsers,
    });

    res.json({ count: createdUsers.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// List all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, // You might want to select the new integer ID
        username: true,
        employeeId: true,
        empClass: true,
        projectKey: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 4090;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});