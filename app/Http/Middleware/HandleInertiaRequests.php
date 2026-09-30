<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $counts = [
            'pending_requests' => 0,
            'overdue_keys' => 0,
            'my_borrowed' => 0,
        ];

        if ($user) {
            if ($user->isAdmin()) {
                $counts['pending_requests'] = \App\Models\Borrowing::where('status', 'pending')->count();
                $counts['overdue_keys'] = \App\Models\Borrowing::where('status', 'overdue')->count();
            } else {
                $counts['pending_requests'] = \App\Models\Borrowing::where('user_id', $user->id)->where('status', 'pending')->count();
                $counts['my_borrowed'] = \App\Models\Borrowing::where('user_id', $user->id)->whereIn('status', ['borrowed', 'overdue'])->count();
                $counts['overdue_keys'] = \App\Models\Borrowing::where('user_id', $user->id)->where('status', 'overdue')->count();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'counts' => $counts,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
