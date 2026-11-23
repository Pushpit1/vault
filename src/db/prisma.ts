/**
 * @deprecated Import from "../config/prisma" instead.
 * This shim exists for backwards compatibility only; it re-exports the
 * single canonical Prisma instance so that all repositories share one
 * connection pool.
 */
import { prisma } from "../config/prisma";

export default prisma;
