<?php

namespace App\Console\Commands;

use App\Exports\ParseExport;
use App\Imports\CompanyImport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class OrgParse extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:org-parse';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $links = [];
        $companies = Excel::toArray(new CompanyImport, storage_path('app/public/table4.xlsx'));
        foreach ($companies[0] as $company) {
            $tin = (int) $company['stir'];
            $ch = curl_init("https://orginfo.uz/search/all/?q={$tin}");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $html = curl_exec($ch);
            curl_close($ch);
            preg_match('/\/organization\/[A-Za-z0-9]+\//', $html, $url);
            $links[] = $url[0] ?? $tin;
        }
        Log::debug($links);
        $this->parser($links);
    }

    function parser($links)
    {
        $arr = [];
        foreach ($links as $key => $link) {
            $ch = curl_init("https://orginfo.uz{$link}");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $html = curl_exec($ch);
            curl_close($ch);
            if ($html) {
                $html = str_replace(["&nbsp;", "\u{A0}"], "", $html);
                $html = str_replace("&#x27;", "'", $html);
                $html = str_replace("&quot;", "\"", $html);
                preg_match('/<span>\d{1,2}\.\d{1,2}\.\d{2,4}/', $html, $date);
                preg_match('/ИНН-\d{9}/', $html, $tin);
                preg_match('/Активный|Ликвидирована/', $html, $status);
                preg_match_all('/\d{3,5}\s-\s\D+\W+<\/span/', $html, $num_matches1);
                preg_match('/Об организации\s-\s\D+/', $html, $title);
                preg_match("/\d+,\d{2}\s+(USD|UZS)\s+<\/span>/", $html, $amount);
                preg_match("/q=(\+998)?\d+/", $html, $phone);
                $arr[$key][] = str_replace(["Об организации - ", ", ИНН-"], "", isset($title[0]) ? $title[0] : '');
                $arr[$key][] = str_replace("<span>", "", $date[0]);
                $arr[$key][] = str_replace("ИНН-", "", $tin[0]);
                $arr[$key][] = $status[0];
                foreach ($num_matches1[0] as $value) {
                    $val = str_replace(["<span>", "</span", "<", "\n"], "", $value);
                    $val = preg_replace("/-\s+/", "", $val);
                    $arr[$key][] = $val;
                }
                $amount = str_replace([" ", "</span>", "\n"], "", isset($amount[0]) ? trim($amount[0]) : 0);
                $amount = str_replace(["USD", "UZS"], [" USD", " UZS"], $amount);
                $arr[$key][] = $amount;
                $arr[$key][] = str_replace("q=", "", isset($phone[0]) ? $phone[0] : '');
                Log::debug($arr);
            }
        }
        Log::debug($arr);
        return Excel::store(new ParseExport($arr), 'file.xlsx', 'public', \Maatwebsite\Excel\Excel::XLSX);
    }
}
