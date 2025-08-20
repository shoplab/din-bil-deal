<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CustomerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('customer.login')
                ->with('error', 'Du måste logga in för att komma åt denna sida.');
        }

        // Check if user is a customer
        if (!Auth::user()->isCustomer()) {
            Auth::logout();
            return redirect()->route('customer.login')
                ->with('error', 'Du har inte behörighet att komma åt denna sida.');
        }

        return $next($request);
    }
}