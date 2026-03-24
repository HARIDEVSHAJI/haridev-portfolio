# Upgrading from Previous Version

If you already have a running database from the previous version, run these commands to add the new columns:

```bash
# Re-generate Prisma client with new schema
npm run db:generate

# Push schema changes (adds phone and typingTexts columns)
npm run db:push

# Optional: re-seed default data
npm run db:seed
```

The `db:push` command will safely add the new `phone` and `typingTexts` columns with defaults — existing data is preserved.
