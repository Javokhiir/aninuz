<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{$title}}</title>
</head>
<body>
    <table>
        <tbody>
            <tr>
                <td>@lang('admin.feedback.first-text')</td>
            </tr>
        </tbody>
    </table><br/><br/>
    <table>
        <tbody>
            <tr>
                <td><b>@lang('admin.feedback.author')</b>:</td>
                <td>{{$review->name}}</td>
            </tr>
            <tr>
                <td><b>@lang('admin.feedback.email')</b>:</td>
                <td>{{$review->email}}</td>
            </tr>
            <tr>
                <td><b>@lang('admin.feedback.phone')</b>:</td>
                <td>{{$review->phone}}</td>
            </tr>
        </tbody>
    </table><br/>
    <table>
        <tbody>
            <tr>
                <td><b>@lang('admin.feedback.message')</b></td>
            </tr>
            <tr>
                <td>{{$review->message}}</td>
            </tr>
        </tbody>
    </table><br/><br/>
    <table>
        <tbody>
            <tr>
                <td>@lang('admin.feedback.last-text')</td>
            </tr>
        </tbody>
    </table>
</body>
</html>