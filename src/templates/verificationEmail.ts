export const verificationEmail = (
  link: string
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Verify Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
  <h2>Welcome to Vault!</h2>

  <p>
    Thank you for creating your account.
  </p>

  <p>
    Please verify your email address by clicking the button below.
  </p>

  <p>
    <a
      href="${link}"
      style="
        display:inline-block;
        padding:12px 20px;
        background:#16a34a;
        color:white;
        text-decoration:none;
        border-radius:6px;
      "
    >
      Verify Email
    </a>
  </p>

  <p>
    If you didn't create this account,
    you can safely ignore this email.
  </p>

  <hr />

  <small>
    Vault Security Team
  </small>
</body>
</html>
`;