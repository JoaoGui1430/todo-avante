import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export const tasksController = {
  async getAll(req: Request, res: Response) {
    const { status, listId } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status: String(status) }),
        ...(listId && { listId: String(listId) }),
      },
      include: { list: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: String(id) },
      include: { list: { select: { id: true, title: true } } },
    });

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.json(task);
  },

  async create(req: Request, res: Response) {
    const { title, description, status, endDate, listId } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'O título da tarefa é obrigatório' });
    }

    if (!listId) {
      return res.status(400).json({ error: 'A tarefa deve pertencer a uma lista' });
    }

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list) {
      return res.status(404).json({ error: 'Lista não encontrada' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        status: status || 'PENDING',
        endDate: endDate ? new Date(endDate) : null,
        listId,
      },
      include: { list: { select: { id: true, title: true } } },
    });

    res.status(201).json(task);
  },


  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, status, endDate } = req.body;

    const existing = await prisma.task.findUnique({ where: { id: String(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ error: 'O título da tarefa é obrigatório' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const task = await prisma.task.update({
      where: { id: String(id) },
      data: {
        title: title?.trim() ?? existing.title,
        description: description?.trim() ?? existing.description,
        status: status ?? existing.status,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.endDate,
      },
      include: { list: { select: { id: true, title: true } } },
    });

    res.json(task);
  },

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    const existing = await prisma.task.findUnique({ where: { id: String(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    await prisma.task.delete({ where: { id:String(id) } });

    res.status(204).send();
  },
};