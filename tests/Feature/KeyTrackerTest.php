<?php

use App\Models\Borrowing;
use App\Models\Key;
use App\Models\User;
use App\Services\OverdueService;
use Carbon\Carbon;

test('keytracker end-to-end borrowing flow works seamlessly', function () {
    // 1. Setup Admin and Staff user
    $admin = User::factory()->create([
        'name' => 'Dr. Arthur Vance',
        'email' => 'admin.test@school.edu',
        'role' => 'admin',
        'department' => 'Administration',
        'status' => 'active',
    ]);

    $staff = User::factory()->create([
        'name' => 'Prof. John Doe',
        'email' => 'staff.test@school.edu',
        'role' => 'staff',
        'department' => 'Science Department',
        'status' => 'active',
    ]);

    // 2. Admin adds a new physical key
    $this->actingAs($admin);
    $response = $this->post(route('keys.store'), [
        'key_code' => 'KEY-BIO-999',
        'name' => 'Biology Greenhouse Main Door',
        'description' => 'Greenhouse botanical research door',
        'location' => 'Science Wing, Courtyard',
        'key_type' => 'Room',
        'status' => 'available',
    ]);
    $response->assertSessionHas('success');

    $key = Key::where('key_code', 'KEY-BIO-999')->first();
    expect($key)->not->toBeNull();
    expect($key->status)->toBe('available');

    // 3. Staff logs in and views dashboard & keys
    $this->actingAs($staff);
    $this->get(route('dashboard'))->assertOk();
    $this->get(route('keys.index'))->assertOk();

    // 4. Staff submits a borrow request for the key
    $expectedReturn = Carbon::now()->addDay();
    $response = $this->post(route('borrowing.store'), [
        'key_id' => $key->id,
        'purpose' => 'Biology specimen observation class.',
        'expected_return_at' => $expectedReturn->toDateTimeString(),
    ]);
    $response->assertSessionHas('success');

    $borrowing = Borrowing::where('key_id', $key->id)->where('user_id', $staff->id)->first();
    expect($borrowing)->not->toBeNull();
    expect($borrowing->status)->toBe('pending');

    // 5. Admin reviews requests queue and approves
    $this->actingAs($admin);
    $this->get(route('borrowing.requests'))->assertOk();

    $response = $this->post(route('borrowing.approve', $borrowing));
    $response->assertSessionHas('success');

    $borrowing->refresh();
    $key->refresh();
    expect($borrowing->status)->toBe('borrowed');
    expect($key->status)->toBe('borrowed');
    expect($borrowing->approved_by)->toBe($admin->id);

    // 6. Admin records return of key in good condition
    $response = $this->post(route('borrowing.return', $borrowing), [
        'returned_at' => Carbon::now()->toDateTimeString(),
        'return_condition' => 'good',
        'notes' => 'Returned on time and in perfect shape.',
    ]);
    $response->assertSessionHas('success');

    $borrowing->refresh();
    $key->refresh();
    expect($borrowing->status)->toBe('returned');
    expect($borrowing->return_condition)->toBe('good');
    expect($key->status)->toBe('available');

    // 7. Check transactions history shows the completed cycle
    $this->get(route('transactions.index'))->assertOk();
});

test('overdue detection service flags past-due borrowings and keys', function () {
    $staff = User::factory()->create(['role' => 'staff']);
    $admin = User::factory()->create(['role' => 'admin']);

    $key = Key::create([
        'key_code' => 'KEY-OVERDUE-001',
        'name' => 'Overdue Test Key',
        'location' => 'Library Archive',
        'key_type' => 'Room',
        'status' => 'borrowed',
    ]);

    $borrowing = Borrowing::create([
        'key_id' => $key->id,
        'user_id' => $staff->id,
        'purpose' => 'Late night reading study session.',
        'borrowed_at' => Carbon::now()->subDays(3),
        'expected_return_at' => Carbon::now()->subDay(), // 1 day past due!
        'status' => 'borrowed',
        'approved_by' => $admin->id,
    ]);

    // Run overdue service
    $count = OverdueService::checkAndUpdateOverdue();
    expect($count)->toBeGreaterThanOrEqual(1);

    $borrowing->refresh();
    $key->refresh();
    expect($borrowing->status)->toBe('overdue');
    expect($key->status)->toBe('overdue');
});

test('admin can mark key as lost or damaged', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $key = Key::create([
        'key_code' => 'KEY-LOST-001',
        'name' => 'Campus Transport Key',
        'location' => 'Garage',
        'key_type' => 'Vehicle',
        'status' => 'available',
    ]);

    $this->post(route('keys.lost', $key), [
        'date_reported' => Carbon::today()->toDateString(),
        'reported_by' => 'Security Patrol',
        'notes' => 'Dropped near north lawn.',
    ])->assertSessionHas('success');

    $key->refresh();
    expect($key->status)->toBe('lost');

    $this->post(route('keys.damaged', $key), [
        'notes' => 'Bent in door latch.',
    ])->assertSessionHas('success');

    $key->refresh();
    expect($key->status)->toBe('damaged');
});

test('reports page renders summary metrics and top keys', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $response = $this->get(route('reports.index', ['range' => 'all']));
    $response->assertOk();
});

test('admin can manage users and toggle active status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $targetUser = User::factory()->create([
        'role' => 'staff',
        'status' => 'active',
    ]);

    $this->actingAs($admin);

    // Toggle to inactive
    $this->post(route('users.toggle-status', $targetUser))->assertSessionHas('success');
    $targetUser->refresh();
    expect($targetUser->status)->toBe('inactive');

    // Toggle back to active
    $this->post(route('users.toggle-status', $targetUser))->assertSessionHas('success');
    $targetUser->refresh();
    expect($targetUser->status)->toBe('active');
});

