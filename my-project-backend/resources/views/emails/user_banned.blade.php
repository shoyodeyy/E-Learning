<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Suspended - FPT Polytechnic</title>
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

        .ban-notice {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            padding: 20px;
            margin: 25px 0;
            color: #721c24;
        }

        .ban-notice-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #721c24;
            display: flex;
            align-items: center;
        }

        .ban-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 10px;
            background-color: #dc3545;
            border-radius: 50%;
            position: relative;
        }

        .ban-icon::before {
            content: "!";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 14px;
        }

        .ban-details {
            background-color: #fff;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #dc3545;
        }

        .ban-detail-row {
            display: flex;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .ban-detail-label {
            font-weight: 600;
            min-width: 100px;
            color: #495057;
        }

        .ban-detail-value {
            color: #212529;
            flex: 1;
        }

        .reason-text {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 3px;
            font-style: italic;
            margin-top: 5px;
            border-left: 3px solid #dc3545;
        }

        .support-section {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
            color: #0c5460;
        }

        .support-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #0c5460;
        }

        .support-link {
            color: #007bff;
            text-decoration: none;
            font-weight: 500;
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

        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
        }

        .signature-title {
            font-weight: 600;
            color: #495057;
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

            .ban-detail-row {
                flex-direction: column;
            }

            .ban-detail-label {
                min-width: auto;
                margin-bottom: 5px;
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
        <div class="greeting">Hello {{ $user->name }},</div>

        <div class="message">
            We regret to inform you that your account has been suspended due to a violation of our terms of service.
        </div>

        <div class="ban-notice">
            <div class="ban-notice-title">
                <span class="ban-icon"></span>
                Account Suspended
            </div>

            <div class="ban-details">
                <div class="ban-detail-row">
                    <span class="ban-detail-label">Account: </span>
                    <span class="ban-detail-value">{{ $user->email }}</span>
                </div>

                <div class="ban-detail-row">
                    <span class="ban-detail-label">Suspended until: </span>
                    <span class="ban-detail-value">
                        @if($user->banned_until && $user->banned_until->format('Y') == '9999')
                            Permanent
                        @else
                            {{ $user->banned_until->format('d/m/Y H:i') }}
                        @endif
                    </span>
                </div>

                <div class="ban-detail-row">
                    <span class="ban-detail-label">Reason:</span>
                    <span class="ban-detail-value">
                        <div class="reason-text">{{ $reason ?: 'Violation of terms of service' }}</div>
                    </span>
                </div>
            </div>

            <div style="font-size: 14px; margin-top: 15px;">
                During this period, you will not be able to access your account or use our services.
            </div>
        </div>

        <div class="support-section">
            <div class="support-title">Need Help?</div>
            <div style="font-size: 14px;">
                If you believe this suspension was made in error or if you have any questions,
                please contact our support team at
                <a href="mailto:support@fpt.edu.vn" class="support-link">support@fpt.edu.vn</a>
            </div>
            <div style="font-size: 12px; margin-top: 10px; color: #6c757d;">
                Please include your account email and this suspension notice in your message.
            </div>
        </div>

        <div class="message">
            We appreciate your understanding and look forward to resolving this matter.
        </div>

        <div class="signature">
            <div>Best regards,</div>
            <div class="signature-title">E-Learning Administration Team</div>
            <div>FPT Polytechnic</div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="footer-text">
            This email was sent by FPT Polytechnic E-Learning Platform<br>
            Hanoi, Vietnam
        </div>
        <img src="{{ $message->embed(public_path('images/udemy.png')) }}" alt="FPT Polytechnic" class="footer-logo">
    </div>
</div>
</body>
</html>
