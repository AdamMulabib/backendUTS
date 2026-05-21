import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// 1. GET ALL CATEGORIES

export const getAllCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil category.",
      error,
    });
  }
};

// 2. CREATE CATEGORY

export const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Nama wajib diisi",
      });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json({
      message: "Category berhasil dibuat",
      data: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal membuat category",
      error,
    });
  }
};

// 3. GET CATEGORY BY ID

export const getCategoryById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category tidak ditemukan",
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil category",
      error,
    });
  }
};

// 4. UPDATE CATEGORY

export const updateCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

  const { name, description } = req.body;

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      description,
    },
  });

    return res.status(200).json({
      message: "Category berhasil diupdate",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal update category",
      error,
    });
  }
};

// 5. DELETE CATEGORY

export const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Category berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal menghapus category",
      error,
    });
  }
};