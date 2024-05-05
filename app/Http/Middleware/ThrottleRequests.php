<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class ThrottleRequests
{
    protected $limiter;

    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    public function handle($request, Closure $next, $maxRequests = 100, $decayMinutes = 1)
    {
        $key = $request->ip();

        if ($this->limiter->tooManyAttempts($key, $maxRequests, $decayMinutes)) {
            return response()->json(['message' => 'Too Many Requests'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $this->limiter->hit($key, $decayMinutes);

        return $next($request);
    }
}
