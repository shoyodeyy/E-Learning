<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserBannedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $reason;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $reason)
    {
        $this->user = $user;
        $this->reason = $reason;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Your Account Has Been Banned')
            ->view('emails.user_banned');
    }
}
