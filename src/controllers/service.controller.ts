import type { Request, Response } from 'express';
import pool from '../db.js';
import { createServiceSchema, updateServiceSchema } from '../schemas/service.schema.js';

export async function createService(req: Request, res: Response) {
    const validation = createServiceSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ errors: validation.error.message });

    const { name, description, code, price, duration } = validation.data;
    const { rows } = await pool.query(
        `insert into service (name, description, code, price, duration)
         values ($1,$2,$3,$4,$5)
         returning *`,
        [name, description, code, price, duration]
    );
    res.status(201).json(rows[0]);
}

export async function getServices(_req: Request, res: Response) {
    const { rows } = await pool.query(`select * from service order by created_at desc`);
    res.json(rows);
}

export async function getServiceById(req: Request, res: Response) {
    const { rows } = await pool.query(`select * from service where id = $1`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}

export async function deleteService(req: Request, res: Response) {
    const { rowCount } = await pool.query(`delete from service where id = $1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Не найден' });
    res.json({ message: 'Удалено' });
}

export async function updateService(req: Request, res: Response) {
    const validation = updateServiceSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ errors: validation.error.message });

    const { name, description, code, price, duration } = validation.data;
    const { rows } = await pool.query(
        `update service set
            name = coalesce($1, name),
            description = coalesce($2, description),
            code = coalesce($3, code),
            price = coalesce($4, price),
            duration = coalesce($5, duration),
            updated_at = now()
         where id = $6
         returning *`,
        [name, description, code, price, duration, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}
