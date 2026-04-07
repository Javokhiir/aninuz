<?php

namespace App\Facades;

use Astrotomic\Translatable\Locales;
use Illuminate\Support\Facades\Facade;

class LocaleFacade extends Facade
{
    protected static function getFacadeAccessor()
    {
        return Locales::class;
    }
}