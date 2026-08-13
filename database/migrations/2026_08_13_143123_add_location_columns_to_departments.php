<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('code');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->integer('allowed_radius')->default(100)->after('longitude');
            $table->boolean('geofencing_enabled')->default(true)->after('allowed_radius');
        });
    }

    public function down()
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude', 'allowed_radius', 'geofencing_enabled']);
        });
    }
};
