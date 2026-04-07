<?php

function dashboard_route($name, $params = [])
{
    return route($name, array_merge([
        'context' => config("app.context")
    ], $params));
}

function getDefaultFormat($date, $format = 'Y-m-d H:i:s')
{
    return $date ? date($format, strtotime($date)) : $date;
}

function getPriceFormat($number)
{
    return number_format($number, 0, '.', ' ');
}
