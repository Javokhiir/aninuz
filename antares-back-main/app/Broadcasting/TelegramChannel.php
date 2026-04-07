<?php

namespace App\Broadcasting;

use App\Models\Product;
use App\Models\User;
use Illuminate\Notifications\Notification;
use Telegram\Bot\FileUpload\InputFile;
use Telegram\Bot\Laravel\Facades\Telegram;

class TelegramChannel
{
    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
    }

    public function send(object $notifiable, Notification $notification)
    {
        $message = $notification->toTelegram($notifiable);
        $chat_id = config("telegram.bots.mybot.chat_id");
        if ($message['type'] == 'feedback') {
            $html = view("telegram-bot::feedback", ['message' => $message])->render();
            Telegram::sendMessage([
                'chat_id' => $chat_id,
                'text' => $html,
                'parse_mode' => "HTML",
            ]);
        } else {
            $product = Product::where('id', $message['data']['product_id'])->first();
            $url = route('site.products.show', ['slug' => $product->slug]);
            $html = view("telegram-bot::product", ['message' => $message])->render();
            if ($img = $product->leadImage()) {
                $image = InputFile::create($img->preview_url);
                Telegram::sendPhoto(['chat_id' => $chat_id, 'photo' => $image, 'parse_mode' => "HTML", 'caption' => $html, 'reply_markup' => $this->productMenu($url)]);
            } else {
                $no_image = InputFile::create(public_path("/images/no-image.jpg"));
                Telegram::sendPhoto(['chat_id' => $chat_id, 'photo' => $no_image, 'parse_mode' => "HTML", 'caption' => $html, 'reply_markup' => $this->productMenu($url)]);
            }
        }
        
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user): array|bool
    {
        //
    }

    public function productMenu($url)
    {
        $keyboard = [
            [
                [
                    'text' => 'Show',
                    'url' => $url
                ]
            ],
        ];

        return $this->_inlineKeyboard($keyboard);
    }

    private function _inlineKeyboard($keyboard)
    {
        return json_encode([
            'inline_keyboard' => $keyboard
        ], JSON_THROW_ON_ERROR);
    }
}
