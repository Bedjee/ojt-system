<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Daily Time Record</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #000;
            margin: 10px 30px;
            padding: 0;
            position: relative;
        }
        /* Watermark */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.08;
            z-index: -1;
            width: 70%;
            max-width: 500px;
            pointer-events: none;
        }
        .watermark img {
            width: 100%;
            height: auto;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 6px;
            border-bottom: 1.5px solid #000;
            padding-bottom: 4px;
        }
        .header-logo {
            flex: 0 0 50px;
            text-align: left;
        }
        .header-logo img {
            width: 48px;
            height: auto;
        }
        .header-text {
            flex: 1;
            text-align: center;
        }
        .header-text .republic {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.3px;
        }
        .header-text .city {
            font-size: 16px;
            font-weight: 700;
            margin-top: 1px;
        }
        .header-text .title {
            font-size: 14px;
            font-weight: 700;
            margin-top: 2px;
            text-decoration: underline;
        }
        .header-text .subtitle {
            font-size: 11px;
            font-weight: 600;
            margin-top: 1px;
        }
        .info {
            margin: 6px 0 8px 0;
            font-size: 11px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin: 2px 0;
        }
        .info .label {
            font-weight: 600;
        }
        .info .value {
            font-weight: 400;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5px;
            margin-top: 4px;
        }
        table th {
            background: #f0f0f0;
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: center;
            font-weight: 700;
            font-size: 9.5px;
        }
        table td {
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: center;
            height: 16px;
            font-size: 9.5px;
            line-height: 1.2;
        }
        .col-day {
            width: 6%;
        }
        .col-am-in, .col-am-out, .col-pm-in, .col-pm-out {
            width: 16%;
        }
        .col-total {
            width: 10%;
        }
        .total-row td {
            font-weight: 700;
            background: #f8f8f8;
            padding: 6px 6px;
            font-size: 10.5px;
        }
       .signature-area {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    padding-top: 8px;
    border-top: 1.5px solid #000;
}
.signature-box {
    width: 45%;
    text-align: center;
    font-size: 11px;
}
.signature-box .signature-line {
    margin-top: 14px;
    border-top: 1px solid #000;
    width: 100%;
}
.signature-box .label {
    font-size: 10px;
    margin-top: 3px;
    font-weight: 600;
    margin-bottom: 12px;
}
.signature-box .name-line {
    margin-top: 2px;
    font-size: 10px;
    color: #333;
}
.signature-box .name-line span {
    font-weight: 600;
}
        .footer {
            margin-top: 8px;
            text-align: center;
            font-size: 8px;
            color: #555;
        }
        tfoot td {
            border: 1px solid #000;
        }
    </style>
</head>
<body>

    <!-- Watermark -->
    <div class="watermark">
        <img src="{{ public_path('images/opol.png') }}" alt="Opol">
    </div>

    <div class="header">

        <div class="header-text">
            <div class="republic">REPUBLIC OF THE PHILIPPINES</div>
            <div class="city">Municipality of Opol</div>
            <div class="title">DAILY TIME RECORD</div>
            <div class="subtitle">ON THE JOB TRAINING (OJT)</div>
        </div>
        <div class="header-logo" style="visibility:hidden;">
            <!-- empty spacer for balance -->
        </div>
    </div>

    <div class="info">
        <div class="info-row">
            <span><span class="label">Name:</span> <span class="value">{{ $trainee['name'] }}</span></span>
            <span><span class="label">Department:</span> <span class="value">{{ $trainee['department'] }}</span></span>
        </div>
        <div class="info-row">
            <span><span class="label">For the Month of:</span> <span class="value">{{ $month_year }}</span></span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th class="col-day">Day</th>
                <th class="col-am-in">AM IN</th>
                <th class="col-am-out">AM OUT</th>
                <th class="col-pm-in">PM IN</th>
                <th class="col-pm-out">PM OUT</th>
                <th class="col-total">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($records as $day => $rec)
                <tr>
                    <td>{{ $day }}</td>
                    <td>{{ $rec['morning_in'] ?? '' }}</td>
                    <td>{{ $rec['lunch_out'] ?? '' }}</td>
                    <td>{{ $rec['afternoon_in'] ?? '' }}</td>
                    <td>{{ $rec['time_out'] ?? '' }}</td>
                    <td>
                        @php
                            $total = $rec['total_hours'] ?? 0;
                        @endphp
                        {{ $total > 0 ? \App\Helpers\TimeHelper::formatHoursShort($total) : '' }}
                    </td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="5" style="text-align:right; font-weight:700;">TOTAL RENDERED HOURS:</td>
                <td>{{ \App\Helpers\TimeHelper::formatHoursShort($total_rendered) }}</td>
            </tr>
        </tfoot>
    </table>

  <div class="signature-area">
    <div class="signature-box">
        <div class="signature-line"></div>
        <div class="label">Trainee's Signature</div>

    </div>
    <div class="signature-box">
        <div class="signature-line"></div>
        <div class="label">Department Head</div>
        <div class="name-line"><span>Signature Over Printed name</span> </div>
    </div>
</div>

    <div class="footer">
        Generated on {{ now()->format('F d, Y h:i A') }} &bull; OJT Management System
    </div>

</body>
</html>
