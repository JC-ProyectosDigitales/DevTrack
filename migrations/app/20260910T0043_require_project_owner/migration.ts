#!/usr/bin/env -S node

import type { Contract as End } from "../../snapshots/4f63d7223b22c5410ef0be9ed879be1265fdcfa16b81232b4fe539858d49034e/contract";
import endContract from "../../snapshots/4f63d7223b22c5410ef0be9ed879be1265fdcfa16b81232b4fe539858d49034e/contract.json" with { type: "json" };

import type { Contract as Start } from "../../snapshots/bc0622a91b92dd897c1abd052a9fe4e129ea847a110d64e77a258930838e1e39/contract";
import startContract from "../../snapshots/bc0622a91b92dd897c1abd052a9fe4e129ea847a110d64e77a258930838e1e39/contract.json" with { type: "json" };

import {
  Migration,
  MigrationCLI,
  rawSql,
} from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      rawSql({
        id: "project.ownerId.require",
        label: "Require project owner",
        operationClass: "destructive",
        target: {
          id: "postgres",
        },
        precheck: [
          {
            description: "Confirm no projects have a null owner",
            sql: `
              SELECT NOT EXISTS (
                SELECT 1
                FROM "public"."project"
                WHERE "ownerId" IS NULL
              ) AS ok
            `,
          },
        ],
        execute: [
          {
            description: "Set project ownerId as NOT NULL",
            sql: `
              ALTER TABLE "public"."project"
              ALTER COLUMN "ownerId" SET NOT NULL
            `,
          },
        ],
        postcheck: [
          {
            description: "Confirm project ownerId is required",
            sql: `
              SELECT is_nullable = 'NO' AS ok
              FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = 'project'
                AND column_name = 'ownerId'
            `,
          },
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);