<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - FPT Polytechnic</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #ffffff;
            padding: 30px;
            border-bottom: 1px solid #e9ecef;
            text-align: center;
        }

        .logo {
            max-width: 200px;
            height: auto;
        }

        .content {
            padding: 40px 30px;
            color: #333333;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #2c3e50;
        }

        .message {
            font-size: 16px;
            margin-bottom: 15px;
            color: #555555;
        }

        .reset-button {
            display: inline-block;
            background-color: #333333;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            font-size: 16px;
            margin: 25px 0;
            transition: background-color 0.3s ease;
        }

        .reset-button:hover {
            background-color: #555555;
        }

        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
            font-size: 14px;
        }

        .support-link {
            color: #007bff;
            text-decoration: none;
        }

        .support-link:hover {
            text-decoration: underline;
        }

        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer-text {
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 15px;
        }

        .footer-logo {
            max-width: 150px;
            height: auto;
            opacity: 0.7;
        }

        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }

            .content {
                padding: 30px 20px;
            }

            .header {
                padding: 20px;
            }

            .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
<div class="email-container">
    <!-- Header with Logo -->
    <div class="header">
        <img src="{{ $message->embed(public_path('images/logo.webp')) }}" alt="FPT Polytechnic" class="logo">
    </div>

    <!-- Main Content -->
    <div class="content">
        <div class="greeting">Hi {{ $user->name ?? 'there' }},</div>

        <div class="message">
            A password reset for your account was requested.
        </div>

        <div class="message">
            Please click the button below to change your password.
        </div>

        <div class="warning">
            <strong>Note:</strong> This link is valid for 24 hours. After the time limit has expired, you will have to resubmit the request for a password reset.
        </div>

        <div style="text-align: center;">
            <a href="{{ $resetUrl }}" class="reset-button">Change Your Password</a>
        </div>

        <div class="message">
            If you did not make this request, please
            <a href="mailto:support@fpt.edu.vn" class="support-link">contact Support</a>.
        </div>

        <!-- Alternative link for email clients that don't support buttons -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #6c757d;">
            If the button above doesn't work, copy and paste this link into your browser:<br>
            <a href="{{ $resetUrl }}" style="color: #007bff; word-break: break-all;">{{ $resetUrl }}</a>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="footer-text">
            Delivered by FPT Polytechnic<br>
            Hanoi, Vietnam
        </div>
        <img src="{{ $message->embed(public_path('images/udemy.png')) }}" alt="FPT Polytechnic" class="footer-logo">
    </div>
</div>
</body>
</html>
