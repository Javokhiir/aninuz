<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function alert($status, $message) 
    {
        session()->flash($status, $message);
    }
}
