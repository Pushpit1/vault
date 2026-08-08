/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve users with pagination, filtering, searching, and sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number.
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page.
 *
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN]
 *         description: Filter users by role.
 *
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *         description: Filter verified or unverified users.
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name or email.
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, email, role, createdAt, updatedAt]
 *         description: Sort field.
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order.
 *
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /api/v1/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /api/v1/users/admin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Admin dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/v1/users/me/avatar:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Upload avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /api/v1/users/test:
 *   get:
 *     tags:
 *       - Development
 *     summary: Test user routes
 *     description: Development endpoint to verify user routing.
 *     responses:
 *       200:
 *         description: User routes are working
 */

export {};