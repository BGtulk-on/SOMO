import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { pool } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const hasName = typeof body?.name === 'string';
    const hasData = typeof body?.data === 'object' && body?.data !== null;

    if (!hasName && !hasData) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    if (!pool) {
      return Response.json({ success: true });
    }

    const updates: string[] = ['"updatedAt" = NOW()'];
    const values: any[] = [];
    let idx = 1;

    if (hasName) {
      updates.push(`"name" = $${idx}`);
      values.push(body.name.trim());
      idx++;
    }

    if (hasData) {
      updates.push(`"data" = $${idx}`);
      values.push(JSON.stringify(body.data));
      idx++;
    }

    values.push(id);
    const idIdx = idx;
    idx++;

    values.push(session.user.id);
    const userIdx = idx;

    const query = `
      UPDATE "project"
      SET ${updates.join(', ')}
      WHERE "id" = $${idIdx} AND "userId" = $${userIdx}
      RETURNING "id", "name", "createdAt", "data"
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const updated = result.rows[0];

    return Response.json({
      project: {
        id: updated.id,
        name: updated.name,
        createdAt: new Date(updated.createdAt).getTime(),
        data: updated.data || {},
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!pool) {
      return Response.json({ success: true });
    }

    await pool.query(
      `DELETE FROM "project" WHERE "id" = $1 AND "userId" = $2`,
      [id, session.user.id]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
