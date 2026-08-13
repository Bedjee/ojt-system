<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case HRMO = 'hrmo';
    case TRAINEE = 'trainee';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
