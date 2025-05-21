import { Client } from 'pg';

export async function migration0002InventoryCoffeeBag(connection: Client) {
  await connection.query(
    `create table coffee_bag (id text primary key default uuid_generate_v4(), name text not null, roasted_on timestamp not null)`,
  );
}
