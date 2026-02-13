<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'date',
        'time_transaction',
        'receipt_no',
        'sku',
        'operate_type',
        'qty',
        'operator',
    ];
}
