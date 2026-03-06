import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';

export async function createUser(req: Request, res: Response) {
    const validation = createUserSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.message });
    }

    const { first_name, last_name, email, phone, password, role } = validation.data;
    const password_hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
        `insert into "user" (first_name, last_name, email, phone, password_hash, role)
         values ($1,$2,$3,$4,$5,$6)
         returning id, first_name, last_name, email, phone, role, is_active, created_at, updated_at`,
        [first_name, last_name, email, phone, password_hash, role]
    );

    res.status(201).json(rows[0]);
}

export async function getUsers(_req: Request, res: Response) {
    const { rows } = await pool.query(
        `select id, first_name, last_name, email, phone, role, is_active, created_at, updated_at from "user" order by created_at desc`
    );
    res.json(rows);
}

export async function getUserById(req: Request, res: Response) {
    const { rows } = await pool.query(
        `select id, first_name, last_name, email, phone, role, is_active, created_at, updated_at from "user" where id = $1`,
        [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}

export async function deleteUser(req: Request, res: Response) {
    const { rowCount } = await pool.query(`delete from "user" where id = $1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Не найден' });
    res.json({ message: 'Удалено' });
}

export async function updateUser(req: Request, res: Response) {
    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ errors: validation.error.message });

    const { first_name, last_name, email, phone, password, role, is_active } = validation.data;
    const password_hash = password ? await bcrypt.hash(password, 10) : null;

    const { rows } = await pool.query(
        `update "user" set
            first_name = coalesce($1, first_name),
            last_name  = coalesce($2, last_name),
            email      = coalesce($3, email),
            phone      = coalesce($4, phone),
            password_hash = coalesce($5, password_hash),
            role       = coalesce($6, role),
            is_active  = coalesce($7, is_active),
            updated_at = now()
         where id = $8
         returning id, first_name, last_name, email, phone, role, is_active, created_at, updated_at`,
        [first_name, last_name, email, phone, password_hash, role, is_active, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}
