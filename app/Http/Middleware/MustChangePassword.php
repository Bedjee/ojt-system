<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class MustChangePassword
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

     if ($user && $user->must_change_password && !$request->routeIs('password.change') && !$request->routeIs('password.change.update')) {
    return redirect()->route('password.change');
}

        return $next($request);
    }
}
