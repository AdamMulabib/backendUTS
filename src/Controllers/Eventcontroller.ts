import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// 1. GET ALL EVENTS
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const allEvents = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        speakers: {
          include: {
            pembicara: true,
          },
        },
      },
    });

    return res.status(200).json(allEvents);
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil data event.",
      error,
    });
  }
};

// 2. GET EVENT BY ID
export const getEventById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        speakers: {
          include: {
            pembicara: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event tidak ditemukan.",
      });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil event.",
      error,
    });
  }
};

// 3. CREATE EVENT
export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      name,
      categoryId,
      dateEvent,
      description,
      location,
      pembicaraIds,
    } = req.body;

    if (!name || !categoryId || !location || !dateEvent || !description) {
      return res.status(400).json({
        message: "Semua field wajib diisi.",
      });
    }

    const newEvent = await prisma.event.create({
      data: {
        name,
        categoryId,
        location,
        dateEvent: new Date(dateEvent),
        description,
        speakers: {
          create:
            pembicaraIds?.map((id: string) => ({
              pembicaraId: id,
            })) || [],
        },
      },
      include: {
        category: true,
        speakers: {
          include: {
            pembicara: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Event berhasil dibuat.",
      data: newEvent,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Gagal membuat event.",
      error: error.message,
    });
  }
};

// 4. UPDATE EVENT
export const updateEvent = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    const {
      name,
      categoryId,
      dateEvent,
      description,
      location,
      pembicaraIds,
    } = req.body;

    await prisma.eventPembicara.deleteMany({
      where: {
        eventId: id,
      },
    });

    const updatedEvent = await prisma.event.update({
      where: {
        id,
      },
      data: {
        name,
        categoryId,
        dateEvent: new Date(dateEvent),
        description,
        location,
        speakers: {
          create:
            pembicaraIds?.map((pembicaraId: string) => ({
              pembicaraId,
            })) || [],
        },
      },
      include: {
        category: true,
        speakers: {
          include: {
            pembicara: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Event berhasil diupdate.",
      data: updatedEvent,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Gagal update event.",
      error: error.message,
    });
  }
};

// 5. DELETE EVENT
export const deleteEvent = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    await prisma.eventPembicara.deleteMany({
      where: {
        eventId: id,
      },
    });

    await prisma.event.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Event berhasil dihapus.",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Gagal menghapus event.",
      error: error.message,
    });
  }
};