<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Arrival extends Model
{
    protected $fillable = [
        'date',
        'arrival_time',
        'brand',
        'receipt_no',
        'po_no',
        'po_qty',
        'operator',
        'note',
    ];
}
