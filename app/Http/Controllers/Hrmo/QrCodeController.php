<?php

namespace App\Http\Controllers\Hrmo;

use App\Http\Controllers\Controller;
use SimpleSoftwareIO\QrCode\Facades\QrCode as SimpleQr;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;
use Inertia\Inertia;

class QrCodeController extends Controller
{
    public function show()
    {
        $this->authorize('viewAny', \App\Models\AttendanceSetting::class);

        $secret = config('app.attendance_qr_secret', 'OJT_ATTENDANCE_2025');
        $qrImage = SimpleQr::size(400)->generate($secret); // SVG

        return Inertia::render('Hrmo/QrCode/Show', [
            'qrImage' => $qrImage,
        ]);
    }

    public function download()
    {
        $this->authorize('viewAny', \App\Models\AttendanceSetting::class);

        $secret = config('app.attendance_qr_secret', 'OJT_ATTENDANCE_2025');

        // Generate PNG using endroid/qr-code (uses GD, no Imagick needed)
        $result = Builder::create()
            ->writer(new PngWriter())
            ->data($secret)
            ->size(400)
            ->build();

        $pngData = $result->getString();

        return response($pngData)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'attachment; filename="ojt_attendance_qr.png"');
    }
}
