#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6baaaede8e94cc322e6c5952591b5e7c707e272ca198863b0396b5d0121c9087/contract';
import startContract from '../../snapshots/6baaaede8e94cc322e6c5952591b5e7c707e272ca198863b0396b5d0121c9087/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/bc0622a91b92dd897c1abd052a9fe4e129ea847a110d64e77a258930838e1e39/contract';
import endContract from '../../snapshots/bc0622a91b92dd897c1abd052a9fe4e129ea847a110d64e77a258930838e1e39/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'project',
        column: col('ownerId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'project',
        index: 'project_ownerId_idx_e2d0c1ef',
        columns: ['ownerId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'project',
        foreignKey: {
          name: 'project_ownerId_fkey',
          columns: ['ownerId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
