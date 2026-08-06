/**
 * @openapi
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @openapi
 * /users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @openapi
 * /users/admin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Admin dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @openapi
 * /users/avatar:
 *   post:
 *     tags:
 *       - Users
 *     summary: Upload avatar
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

export {};