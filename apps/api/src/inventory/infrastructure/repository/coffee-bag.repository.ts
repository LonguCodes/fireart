import { Inject, Injectable } from '@nestjs/common';
import { Maybe, ResultAsync, Unit } from 'typescript-functional-extensions';
import { Client } from 'pg';
import { CONNECTION } from '../../../core/database/database.module';
import { InventoryErrors } from '../../domain/errors';
import { CoffeeBagModel } from '../../domain/model/coffee-bag.model';

@Injectable()
export class CoffeeBagRepository {
  constructor(@Inject(CONNECTION) private readonly connection: Client) {}

  public find() {
    return ResultAsync.try(
      () =>
        this.connection.query(
          `select id, name, roasted_on as "roastedOn" from coffee_bag`,
        ),
      () => InventoryErrors.Internal,
    ).map((result) => result.rows);
  }

  public search(name: string) {
    return ResultAsync.try(
      () =>
        this.connection.query(
          `select id, name, roasted_on as "roastedOn" from coffee_bag where name ilike $1`,
          [`%${name}%`],
        ),
      (e) => {
        console.log(e);
        return InventoryErrors.Internal;
      },
    ).map((result) => result.rows);
  }

  public findById(id: string) {
    return ResultAsync.try(
      () =>
        this.connection.query(
          `select id, name, roasted_on as "roastedOn" from coffee_bag where id = $1 limit 1`,
          [id],
        ),
      (e) => {
        console.log(e);
        return 'asdf';
      },
    ).map((result) => Maybe.tryFirst(result.rows));
  }

  public create(name: string, roastedOn: Date) {
    return ResultAsync.try(
      () =>
        this.connection.query<CoffeeBagModel>(
          `insert into coffee_bag (name, roasted_on) values ($1, $2) returning id, name, roasted_on as "roastedOn"`,
          [name, roastedOn.toISOString()],
        ),
      () => InventoryErrors.Internal,
    ).map((result) => result.rows[0]);
  }

  public updateNameById(id: string, name: string) {
    return ResultAsync.try(
      () =>
        this.connection.query(
          `select id from coffee_bag where id = $1 limit 1`,
          [id],
        ),
      () => InventoryErrors.Internal,
    )
      .ensure(
        (result) => result.rows.length === 1,
        () => InventoryErrors.CoffeeBagNotFound,
      )
      .tap(() =>
        this.connection.query(`update coffee_bag set name = $1 where id = $2`, [
          name,
          id,
        ]),
      )
      .map(() => Unit.Instance);
  }
  public deleteById(id: string) {
    return ResultAsync.try(
      () =>
        this.connection.query(
          `select id from coffee_bag where id = $1 limit 1`,
          [id],
        ),
      () => InventoryErrors.Internal,
    )
      .ensure(
        (result) => result.rows.length === 1,
        () => InventoryErrors.CoffeeBagNotFound,
      )
      .tap(() =>
        this.connection.query(`delete from coffee_bag where id = $1`, [id]),
      )
      .map(() => Unit.Instance);
  }
}
