<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->decimal('scanned_latitude', 10, 7)->nullable()->after('is_manual');
            $table->decimal('scanned_longitude', 10, 7)->nullable()->after('scanned_latitude');
            $table->integer('distance_from_department')->nullable()->after('scanned_longitude');
        });
    }

    public function down()
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['scanned_latitude', 'scanned_longitude', 'distance_from_department']);
        });
    }
};
