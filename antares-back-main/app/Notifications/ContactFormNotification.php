<?php

namespace App\Notifications;

use App\Broadcasting\TelegramChannel;
use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactFormNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Review $review)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', TelegramChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)->view('mail.feedback', [
                'title' => 'Feedback',
                'review' => $this->review
            ]
        );
    }

    public function toTelegram(object $notifiable): array
    {
        return [
            'type' => 'feedback',
            'review' => $this->review
        ];
    }
}
