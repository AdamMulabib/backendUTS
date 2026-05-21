import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// 1. GET ALL

export const getAllPembicara = async (
  req: Request,
  res: Response
) => {
  try {
    const pembicara = await prisma.pembicara.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(pembicara);
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil data pembicara",
      error,
    });
  }
};

// 2. GET BY ID

export const getPembicaraById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    const pembicara = await prisma.pembicara.findUnique({
      where: {
        id,
      },
    });

    if (!pembicara) {
      return res.status(404).json({
        message: "Pembicara tidak ditemukan",
      });
    }

    return res.status(200).json(pembicara);
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil pembicara",
      error,
    });
  }
};

// 3. CREATE

export const createPembicara = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, bio, image } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Nama wajib diisi",
      });
    }

    const newPembicara = await prisma.pembicara.create({
      data: {
        name,
        bio,
        image,
      },
    });

    return res.status(201).json({
      message: "Pembicara berhasil dibuat",
      data: newPembicara,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal membuat pembicara",
      error,
    });
  }
};

// 4. UPDATE

export const updatePembicara = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    const { name, bio, image } = req.body;

    const updatedPembicara = await prisma.pembicara.update({
      where: {
        id,
      },
      data: {
        name,
        bio,
        image,
      },
    });

    return res.status(200).json({
      message: "Pembicara berhasil diupdate",
      data: updatedPembicara,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal update pembicara",
      error,
    });
  }
};

// 5. DELETE

export const deletePembicara = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    await prisma.pembicara.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Pembicara berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal menghapus pembicara",
      error,
    });
  }
};