<?php

use App\Broadcasting\TelegramChannel;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('telegram', TelegramChannel::class);
