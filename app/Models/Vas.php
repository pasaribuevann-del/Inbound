<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vas extends Model
{
    protected $table = 'vas';

    protected $fillable = [
        'date',
        'start_time',
        'end_time',
        'duration',
        'brand',
        'sku',
        'vas_type',
        'qty',
        'operator',
    ];
}
