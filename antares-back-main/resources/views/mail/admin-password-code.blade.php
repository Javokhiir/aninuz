<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Password Change Code</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
  <tr>
    <td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#1d4ed8;padding:28px 40px;">
            <p style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;"><b>Antares</b> Admin</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 16px;color:#374151;font-size:15px;">Salom,</p>
            <p style="margin:0 0 24px;color:#374151;font-size:15px;">
              <strong>{{ $admin_email }}</strong> akkauntida parolni o'zgartirish so'rovi qabul qilindi.
              Tasdiqlash kodingiz:
            </p>
            <div style="text-align:center;margin:32px 0;">
              <span style="display:inline-block;background:#f0f4ff;border:2px dashed #1d4ed8;border-radius:12px;padding:18px 48px;font-size:38px;font-weight:bold;letter-spacing:10px;color:#1d4ed8;font-family:monospace;">
                {{ $code }}
              </span>
            </div>
            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;text-align:center;">
              Kod <strong>10 daqiqa</strong> ichida amal qiladi.
            </p>
            <p style="margin:24px 0 0;color:#ef4444;font-size:13px;">
              Agar siz bu so'rovni yubormagan bo'lsangiz — bu xabarni e'tiborsiz qoldiring va parolingizni darhol o'zgartiring.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">
              © {{ date('Y') }} Antares Investment Group. Ushbu xabar avtomatik yuborilgan.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
