<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Daily Time Record</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 7.5px;
            color: #000;
            margin: 6px 150px;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 3px;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
        }
        .header .republic {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.3px;
        }
        .header .city {
            font-size: 11px;
            font-weight: 700;
            margin-top: 0;
        }
        .header .title {
            font-size: 9px;
            font-weight: 700;
            margin-top: 1px;
            text-decoration: underline;
        }
        .info {
            margin: 2px 0 3px 0;
            font-size: 9px;   /* increased for readability */
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin: 0;
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
            font-size: 7px;
            margin-top: 2px;
        }
        table th {
            background: #f0f0f0;
            border: 1px solid #000;
            padding: 1px 2px;
            text-align: center;
            font-weight: 700;
            font-size: 7px;
        }
        table td {
            border: 1px solid #000;
            padding: 1px 2px;
            text-align: center;
            height: 11px;
            font-size: 7px;
            line-height: 1.1;
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
            padding: 2px 2px;
            font-size: 7.5px;
        }
        .signature-area {
            margin-top: 6px;
            display: flex;
            justify-content: space-between;
            padding-top: 4px;
            border-top: 1px solid #000;
        }
        .signature-box {
            width: 45%;
            text-align: center;
            font-size: 8.5px;
        }
        .signature-box .line {
            margin-top: 6px;
            border-top: 1px solid #000;
            width: 100%;
        }
        .signature-box .label {
            font-size: 8px;
            margin-top: 1px;
        }
        .signature-box .name {
            margin-top: 4px;
            font-weight: 600;
            font-size: 9px;
        }
        .footer {
            margin-top: 4px;
            text-align: center;
            font-size: 6px;
            color: #555;
        }
        tfoot td {
            border: 1px solid #000;
        }
    </style>
</head>
<body>

    <div class="header">
    <div class="republic">REPUBLIC OF THE PHILIPPINES</div>
    <div class="city">Municipality of Opol</div>

    <div class="title">DAILY TIME RECORD</div>
    <div class="subtitle">ON-THE-JOB TRAINING (OJT)</div>
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
        <div class="signature-line">_________________________________</div>
        <div class="label">Trainee's Signature</div>
    </div>

    <div class="signature-box">
        <div class="signature-line">_________________________________</div>
        <div class="label">Signature of Immediate Supervisor</div>
    </div>
</div>

    <div class="footer">
        Generated on {{ now()->format('F d, Y h:i A') }} &bull; OJT Management System
    </div>

</body>
</html>
