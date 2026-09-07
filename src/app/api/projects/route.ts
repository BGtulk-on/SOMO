import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!pool) {
      return Response.json({ projects: [] });
    }

    const result = await pool.query(
      `SELECT "id", "name", "createdAt", "data" FROM "project" WHERE "userId" = $1 ORDER BY "createdAt" ASC`,
      [session.user.id]
    );

    const projects = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: new Date(row.createdAt).getTime(),
      data: row.data || {},
    }));

    return Response.json({ projects });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const data = typeof body?.data === 'object' && body?.data !== null ? body.data : {};

    if (!name) {
      return Response.json({ error: 'Project name is required' }, { status: 400 });
    }

    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

    if (!pool) {
      return Response.json({
        project: {
          id,
          name,
          createdAt: Date.now(),
          data,
        },
      }, { status: 201 });
    }

    const result = await pool.query(
      `INSERT INTO "project" ("id", "name", "userId", "createdAt", "updatedAt", "data") VALUES ($1, $2, $3, NOW(), NOW(), $4) RETURNING "id", "name", "createdAt", "data"`,
      [id, name, session.user.id, JSON.stringify(data)]
    );

    const created = result.rows[0];

    return Response.json({
      project: {
        id: created.id,
        name: created.name,
        createdAt: new Date(created.createdAt).getTime(),
        data: created.data || {},
      },
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
