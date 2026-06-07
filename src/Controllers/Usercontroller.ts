import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/db.js";

export const simpanUser = async (req: Request, res: Response) => {
  try {
    const { username, password, foto, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username sudah digunakan",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        foto: foto || null,
        role: role || "user",
      },
    });

    return res.status(201).json({
      message: "User berhasil disimpan",
      data: {
        id: user.id,
        username: user.username,
        foto: user.foto,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error simpan user:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        foto: user.foto,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error login user:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        foto: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error get users:", error);

    return res.status(500).json({
      message: "Gagal mengambil data user",
    });
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        foto: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error get user by id:", error);

    return res.status(500).json({
      message: "Gagal mengambil detail user",
    });
  }
};

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { username, password, foto, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const updatedData: {
      username?: string;
      password?: string;
      foto?: string | null;
      role?: string;
    } = {};

    if (username) updatedData.username = username;
    if (foto !== undefined) updatedData.foto = foto || null;
    if (role) updatedData.role = role;

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
      select: {
        id: true,
        username: true,
        foto: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "User berhasil diupdate",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error update user:", error);

    return res.status(500).json({
      message: "Gagal update user",
    });
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.error("Error delete user:", error);

    return res.status(500).json({
      message: "Gagal hapus user",
    });
  }
};