<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Config::set('app.timezone', 'Asia/Ho_Chi_Minh');
        date_default_timezone_set('Asia/Ho_Chi_Minh');
        Carbon::setLocale('vi');
    }
}
