import { Client } from 'pg';

export async function migration0001Identity(connection: Client) {
  await connection.query(
    `create table identity (id text primary key default uuid_generate_v4(), email text unique not null, password text not null)`,
  );

  await connection.query(
    `create table password_reset_request (id text primary key default uuid_generate_v4(), identity_id text not null, expire_at timestamp not null, foreign key (identity_id) references identity(id))`,
  );
}
