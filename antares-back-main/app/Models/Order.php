<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    const CREATED = "CREATED";
    const PAYMENT_PROCESSING = "PAYMENT_PROCESSING";
    const PAYMENT_RECEIVED = "PAYMENT_RECEIVED";
    const WAITING_FOR_COD_APPROVAL = "WAITING_FOR_COD_APPROVAL";

    const APPROVED = "APPROVED";
    const PROCESSING = "PROCESSING";
    const COMPLETED = "COMPLETED";
    const CANCELLED = "CANCELLED";

    const STATUSES = [
        'Created' => self::CREATED,
        'Payment processing' => self::PAYMENT_PROCESSING,
        'Payment received' => self::PAYMENT_RECEIVED,
        'Waiting for COD approval' => self::WAITING_FOR_COD_APPROVAL,
    ];

    protected $fillable = [
        'id',
        'customer_name',
        'address',
        'phone',
        'email',
        'status',
        'note',
        'hash',
        'created_at',
        'updated_at',
    ];

    public $dates = [
        'created_at',
        'updated_at',
    ];

    // ****** BEGIN Actions ************


    public function getIsCompleteAttribute(): bool
    {
        return (bool)$this->completed_at;
    }

    public function getIsCancelAttribute(): bool
    {
        return (bool)$this->cancelled_at;
    }

    public function getPhone()
    {
        return preg_replace('/[^0-9.]+/', '', $this->phone);
    }

    public function register()
    {
        $this->save();
    }

    public function cancel(): void
    {
        $this->status = self::CANCELLED;
        $this->cancelled_at = now();
        $this->save();
    }

    public function complete(): void
    {
        $this->status = self::COMPLETED;
        $this->completed_at = now();
        $this->save();
    }

    public function statusLabel(): string
    {
        $class = $this->getStatusClassName();
        $status = ucfirst(str_replace("_", " ", $this->status));
        return "<span class='badge text-bg-$class'>{$status}</span>";
    }

    public function getStatusClassName(): string
    {
        $class = "";
        switch ($this->status) {
            case self::CREATED:
                $class = "secondary";
                break;
            case self::COMPLETED:
            case self::PAYMENT_RECEIVED:
                $class = "success";
                break;
            case self::WAITING_FOR_COD_APPROVAL:
                $class = "warning";
                break;
            case self::PROCESSING:
            case self::APPROVED:
                $class = "primary";
                break;
            case self::CANCELLED:
                $class = "danger";
                break;
        }
        return $class;
    }

    // ****** END Actions ************
    // ****** BEGIN Relations ************

    public function products()
    {
        return $this->belongsToMany(Product::class, "order_has_products", "order_id", "product_id")
            ->withPivot(['quantity', 'price']);
    }

    // ****** END Relations ************
}
