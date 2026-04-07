<?php

namespace TelegramBot\Http;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Telegram\Bot\Api;

class TelegramBotController extends Controller
{
    protected $telegram;

    public function __construct(Api $telegram)
    {
        $this->telegram = $telegram;
    }

    public function getMe()
    {
        $response = $this->telegram->getMe();
        return $response;
    }

    public function setWebHook()
    {
        try {
            $response = $this->telegram->setWebHook(['url' => config("app.url").'/telegram-bot/webhook']);
            Log::debug($response);
            return response()->json($response);
        } catch (\Throwable $exception) {
            return response()->json(['error' => $exception->getMessage()], 400);
        }
    }

    public function delWebHook()
    {
        try {
            $response = $this->telegram->removeWebhook();
            Log::debug($response);
            return response()->json($response);
        } catch (\Throwable $exception) {
            return response()->json(['error' => $exception->getMessage()], 400);
        }
    }
}
