@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Order Create',
        'list' => [
            [
                'name' => 'Order Create',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<form class="checkout" action="{{dashboard_route('dashboard.orders.store')}}" method="post" enctype="multipart/form-data">
    @csrf
    <div class="col mb-3">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-end">
                    <div class="btn-group gap-2" role="group">
                        <button type="submit" class="btn btn-form">@lang('admin.save')</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-7">
            <div class="card mb-4">
                <div class="card-header">
                    Customer information
                </div>
                <div class="card-body">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="customer_name" name="customer_name" placeholder="John Doe" required>
                        <label for="customer_name">Customer Name</label>
                    </div>
                    <div class="row row-cols-1 row-cols-md-2 g-2 mb-3">
                        <div class="col form-floating">
                            <input type="text" class="form-control" id="phone" name="phone" placeholder="+998 00 000-00-00" required>
                            <label for="customer_name">Phone</label>
                        </div>
                        <div class="col form-floating">
                            <input type="email" class="form-control" id="email" name="email" placeholder="john.doe@domain.com">
                            <label for="email">Email</label>
                        </div>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="address" name="address" placeholder="Address">
                        <label for="address">Address</label>
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" placeholder="Leave a comment here" id="note" name="note" style="height: 100px"></textarea>
                        <label for="note">Comments</label>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    Payments
                </div>
                <div class="card-body">
                    <div class="row row-cols-2 row-cols-md-3 g-2">
                        @php
                        $current = config('payment.systems',[])[config('payment.default')];
                        $payments =
                        array_merge([config('payment.default')=>$current],Arr::except(config('payment.systems'),$payment_method));
                        @endphp
                        @foreach ($payments as $payment => $info)
                        <div class="col">
                            <div class="form-group">
                                <input type="radio" name="payment" id="payment{{$payment}}" value="{{$payment}}"
                                    @if(\Cart::getTotal() < $info['min'] || \Cart::getTotal()> $info['max']) disabled @endif
                                    @if($payment_method===$payment) checked @endif
                                >
                                <label for="payment{{$payment}}" class="radio-input">
                                    <div class="col-8 radio-label_title">{{$payment}}</div>
                                    <div class="col-4 radio-label__img">
                                        @if($img = Arr::get($info,'img',false))
                                        <img src="{{asset($img)}}" alt="{{$payment}} Logo">
                                        @endif
                                    </div>
                                </label>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-5">
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <div class="col-10">
                            <label for="products" class="form-label">@lang('admin.products')</label>
                            <select class="form-select custom-select" id="products" aria-label="Floating label select example">
                                <option selected disabled>@lang('admin.select_product')</option>
                                @foreach ($products as $p)
                                    <option value="{{$p->id}}">
                                        {{$p->name}}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-2">
                            <button type="button" class="btn btn-form mt-3" id="addProduct">@lang('admin.add')</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="row row-cols-1 product-row g-2"></div>
                </div>
            </div>
        </div>
    </div>
</form>
@endsection

@section('css')
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" />
@endsection

@section('js')
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
@endsection