/**
 * @openapi
 * components:
 *   schemas:
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: clr8abc123xyz
 *         name:
 *           type: string
 *           example: Pushpit
 *         email:
 *           type: string
 *           format: email
 *           example: pushpit@example.com
 *         role:
 *           type: string
 *           example: USER
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Pushpit
 *         email:
 *           type: string
 *           format: email
 *           example: pushpit@example.com
 *         password:
 *           type: string
 *           example: Password@123
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: pushpit@example.com
 *         password:
 *           type: string
 *           example: Password@123
 *
 *     RefreshTokenRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIs...
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: Password@123
 *         newPassword:
 *           type: string
 *           example: NewPassword@123
 *
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: pushpit@example.com
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           example: abc123xyz
 *         newPassword:
 *           type: string
 *           example: Password@123
 *
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: pushpit@example.com
 *
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Pushpit Kumar
 *         email:
 *           type: string
 *           format: email
 *           example: pushpit@example.com
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation completed successfully
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Invalid request
 */
export {};