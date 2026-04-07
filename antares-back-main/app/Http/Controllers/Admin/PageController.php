<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ParseExport;
use App\Http\Controllers\Controller;
use App\Imports\CompanyImport;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class PageController extends Controller
{
    public function dashboard()
    {
        return view('admin.pages.dashboard');
    }

    public function settings()
    {
        return view('admin.pages.settings');
    }

    public function profile()
    {
        $user = Auth::user();
        return view('admin.pages.profile', [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'about' => $user->about,
            'role' => $user->getRoleNames()->first()
        ]);
    }

    public function parse()
    {
        $ch = curl_init("https://tritorc.com/tsf-series-pipe-cutting-machine");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $html = curl_exec($ch);
        curl_close($ch);
        if ($html) {
            preg_match('/<h1>(.*?)<\/h1>/', $html, $title);
            preg_match_all('/<p>(.*?)<\/p>/', $html, $desc);
            preg_match_all('/<li style="list-style:square">(.*?)<\/li>/', $html, $features);
            dd($desc);
        }
        dd($html);
    }
}
