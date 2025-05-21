import { Client } from 'pg';

export async function migration0000Setup(connection: Client) {
  await connection.query(`create extension if not exists "uuid-ossp"`);
}
