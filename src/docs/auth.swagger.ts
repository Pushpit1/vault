/**
 * @openapi
 *
 * /users:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Email already exists
 *
 * /users/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *
 * /users/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 *
 * /users/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 *
 * /users/change-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Change current user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Current password is incorrect
 *
 * /users/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Send password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 *
 * /users/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset password using reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       401:
 *         description: Invalid or expired token
 *
 * /users/verify-email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Send email verification link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *     responses:
 *       200:
 *         description: Verification email sent
 *       404:
 *         description: User not found
 */
export {};