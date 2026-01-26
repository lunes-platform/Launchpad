## 2024-05-22 - Missing User Role Field causing Broken Access Control
**Vulnerability:** The `User` model in `prisma/schema.prisma` does not have a `role` field, but `backend/src/modules/users/user.routes.ts` relies on `user.role` to authorize Admin actions.
**Learning:** This architectural gap means `user.role` is always `undefined`, causing `user.role !== 'ADMIN'` to be true, blocking all access to Admin endpoints (Fail Safe / Denial of Service). It indicates a disconnect between the API implementation and the Database Schema design.
**Prevention:** Always verify that database schemas support the authorization logic required by the API. Use TypeScript interfaces generated from the DB schema (e.g., Prisma Client) to type-check `request.user` instead of `any` casting or loose typing.
