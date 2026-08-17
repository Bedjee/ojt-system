<?php

namespace App\Helpers;

class TimeHelper
{
    /**
     * Convert decimal hours to human-readable hours and minutes.
     * Examples:
     * 0.83   → "50 minutes"
     * 1.00   → "1 hour"
     * 1.50   → "1 hour 30 minutes"
     * 8.25   → "8 hours 15 minutes"
     *
     * @param float $hours
     * @return string
     */
   public static function formatHoursShort($hours)
{
    if (empty($hours) || $hours == 0) {
        return '0m';
    }

    $totalMinutes = round($hours * 60);
    $h = floor($totalMinutes / 60);
    $m = $totalMinutes % 60;

    $parts = [];
    if ($h > 0) {
        $parts[] = $h . 'h';
    }
    if ($m > 0) {
        $parts[] = $m . 'm';
    }

    return implode(' ', $parts);
}


}
