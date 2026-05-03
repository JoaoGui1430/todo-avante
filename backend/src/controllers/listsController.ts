import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listsController = {
  async getAll(req: Request, res: Response) {
    const lists = await prisma.list.findMany({
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(lists);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const list = await prisma.list.findUnique({
      where: { id: String(id) },
      include: {
        tasks: { orderBy: { createdAt: 'desc' } },
        _count: { select: { tasks: true } },
      },
    });

    if (!list) {
      return res.status(404).json({ error: 'Lista não encontrada' });
    }

    res.json(list);
  },

  async create(req: Request, res: Response) {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'O título da lista é obrigatório' });
    }

    const list = await prisma.list.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
      },
    });

    res.status(201).json(list);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'O título da lista é obrigatório' });
    }

    const existing = await prisma.list.findUnique({ where: { id: String(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Lista não encontrada' });
    }

    const list = await prisma.list.update({
      where: { id: String(id) },
      data: {
        title: title.trim(),
        description: description?.trim() ?? existing.description,
      },
    });

    res.json(list);
  },

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    const existing = await prisma.list.findUnique({ where: { id: String(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Lista não encontrada' });
    }

    await prisma.list.delete({ where: { id: String(id) } });

    res.status(204).send();
  },
};