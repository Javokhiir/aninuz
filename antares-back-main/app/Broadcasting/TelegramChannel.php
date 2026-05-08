<?php

namespace App\Broadcasting;

use App\Models\Product;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Telegram\Bot\FileUpload\InputFile;
use Telegram\Bot\Laravel\Facades\Telegram;

interface TelegramNotifiable
{
    public function toTelegram(object $notifiable): array;
}

class TelegramChannel
{
    public function send(object $notifiable, Notification $notification): void
    {
        if (!method_exists($notification, 'toTelegram')) {
            Log::warning('TelegramChannel: toTelegram method not found on ' . get_class($notification));
            return;
        }

        $message  = $notification->toTelegram($notifiable);
        $chat_ids = $this->getChatIds();

        Log::info('TelegramChannel: sending to ' . count($chat_ids) . ' chat(s)', ['chat_ids' => $chat_ids, 'type' => $message['type']]);

        foreach ($chat_ids as $chat_id) {
            try {
                if ($message['type'] === 'feedback') {
                    $html = view("telegram.feedback", ['message' => $message])->render();
                    Telegram::sendMessage([
                        'chat_id'    => $chat_id,
                        'text'       => $html,
                        'parse_mode' => 'HTML',
                    ]);
                    Log::info('TelegramChannel: message sent to ' . $chat_id);
                    } else {
                        $product  = Product::where('id', $message['data']['product_id'])->first();
                        $url      = route('site.products.show', ['slug' => $product->slug]);
                        $html     = view("telegram.product", ['message' => $message])->render();
                        if ($img = $product->leadImage()) {
                            $image = InputFile::create($img->preview_url);
                            Telegram::sendPhoto(['chat_id' => $chat_id, 'photo' => $image, 'parse_mode' => 'HTML', 'caption' => $html, 'reply_markup' => $this->productMenu($url)]);
                        } else {
                            $no_image = InputFile::create(public_path('/images/no-image.jpg'));
                            Telegram::sendPhoto(['chat_id' => $chat_id, 'photo' => $no_image, 'parse_mode' => 'HTML', 'caption' => $html, 'reply_markup' => $this->productMenu($url)]);
                        }
                    }
            } catch (\Throwable $e) {
                Log::error('TelegramChannel: failed for chat_id ' . $chat_id . ' — ' . $e->getMessage());
            }
        }
    }

    private function getChatIds(): array
    {
        $raw = config('telegram.bots.mybot.chat_id', '');
        return array_values(array_filter(array_map('trim', explode(',', (string) $raw))));
    }

    public function productMenu(string $url): string
    {
        return $this->inlineKeyboard([[['text' => 'Show', 'url' => $url]]]);
    }

    private function inlineKeyboard(array $keyboard): string
    {
        return json_encode(['inline_keyboard' => $keyboard], JSON_THROW_ON_ERROR);
    }
}
