export const passwordResetEmail = (
  link: string
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
  <h2>Reset Your Vault Password</h2>

  <p>
    We received a request to reset your password.
  </p>

  <p>
    Click the button below to create a new password.
  </p>

  <p>
    <a
      href="${link}"
      style="
        display:inline-block;
        padding:12px 20px;
        background:#2563eb;
        color:white;
        text-decoration:none;
        border-radius:6px;
      "
    >
      Reset Password
    </a>
  </p>

  <p>
    This link will expire in
    <strong>15 minutes</strong>.
  </p>

  <p>
    If you didn't request a password reset,
    you can safely ignore this email.
  </p>

  <hr />

  <small>
    Vault Security Team
  </small>
</body>
</html>
`;