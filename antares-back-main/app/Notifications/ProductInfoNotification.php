<?php

namespace App\Notifications;

use App\Broadcasting\TelegramChannel;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProductInfoNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public array $data)
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
        $product = Product::where('id', $this->data['product_id'])->first();
        return (new MailMessage)->view('mail.product', [
                'title' => 'Product Info',
                'data' => $this->data,
                'product' => $product
            ]
        );
    }

    public function toTelegram(object $notifiable): array
    {
        return [
            'type' => '',
            'data' => $this->data
        ];
    }
}
