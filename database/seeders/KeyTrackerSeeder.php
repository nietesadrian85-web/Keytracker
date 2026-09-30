<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Borrowing;
use App\Models\Key;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class KeyTrackerSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        // Create Admin
        $admin = User::create([
            'name' => 'Dr. Arthur Vance (Admin)',
            'email' => 'admin@school.edu',
            'password' => $password,
            'role' => 'admin',
            'department' => 'Administration & Security',
            'contact_number' => '+1 (555) 019-2831',
            'status' => 'active',
        ]);

        // Create Staff Users
        $staff1 = User::create([
            'name' => 'Prof. John Doe',
            'email' => 'john.doe@school.edu',
            'password' => $password,
            'role' => 'staff',
            'department' => 'Science Department',
            'contact_number' => '+1 (555) 014-9823',
            'status' => 'active',
        ]);

        $staff2 = User::create([
            'name' => 'Sarah Jenkins',
            'email' => 'sarah.jenkins@school.edu',
            'password' => $password,
            'role' => 'staff',
            'department' => 'IT & Computer Science',
            'contact_number' => '+1 (555) 018-7744',
            'status' => 'active',
        ]);

        $staff3 = User::create([
            'name' => 'Coach Michael Brown',
            'email' => 'michael.brown@school.edu',
            'password' => $password,
            'role' => 'staff',
            'department' => 'Athletics & Physical Ed',
            'contact_number' => '+1 (555) 012-3321',
            'status' => 'active',
        ]);

        $staff4 = User::create([
            'name' => 'Elena Rostova',
            'email' => 'elena.rostova@school.edu',
            'password' => $password,
            'role' => 'staff',
            'department' => 'Library & Media Arts',
            'contact_number' => '+1 (555) 017-6655',
            'status' => 'active',
        ]);

        // Create Campus Keys
        $key1 = Key::create([
            'key_code' => 'KEY-SCI-101',
            'name' => 'Science Lab 101 Main Door',
            'description' => 'Access to Biology and General Science experimental laboratory.',
            'location' => 'Science Wing, Rm 101',
            'key_type' => 'Room',
            'status' => 'borrowed',
        ]);

        $key2 = Key::create([
            'key_code' => 'KEY-SCI-102',
            'name' => 'Chemistry Prep Room',
            'description' => 'Reagents, glassware, and hazardous material storage.',
            'location' => 'Science Wing, Rm 102B',
            'key_type' => 'Room',
            'status' => 'available',
        ]);

        $key3 = Key::create([
            'key_code' => 'KEY-IT-201',
            'name' => 'Computer Lab Alpha',
            'description' => 'High-performance workstation lab with 40 desktop stations.',
            'location' => 'Technology Complex, 2nd Fl',
            'key_type' => 'Room',
            'status' => 'borrowed',
        ]);

        $key4 = Key::create([
            'key_code' => 'KEY-IT-202',
            'name' => 'Server & Network Rack Master',
            'description' => 'Master key for central school networking and blade servers.',
            'location' => 'Tech Center, Data Vault',
            'key_type' => 'Master',
            'status' => 'available',
        ]);

        $key5 = Key::create([
            'key_code' => 'KEY-ATH-301',
            'name' => 'Gymnasium Equipment Lockup',
            'description' => 'Heavy padlocks for athletic equipment, mats, and balls.',
            'location' => 'Sports Pavilion, Ground Level',
            'key_type' => 'Padlock',
            'status' => 'overdue',
        ]);

        $key6 = Key::create([
            'key_code' => 'KEY-AUD-401',
            'name' => 'Auditorium Stage & Sound Console',
            'description' => 'Main theater stage access and sound engineering booth.',
            'location' => 'Performing Arts Center',
            'key_type' => 'Room',
            'status' => 'available',
        ]);

        $key7 = Key::create([
            'key_code' => 'KEY-LIB-105',
            'name' => 'Library Rare Archive Room',
            'description' => 'Climate-controlled historical book preservation room.',
            'location' => 'Central Library, 2nd Floor',
            'key_type' => 'Room',
            'status' => 'available',
        ]);

        $key8 = Key::create([
            'key_code' => 'KEY-ADM-100',
            'name' => 'Principal Executive Office',
            'description' => 'Executive suite and confidential student records archive.',
            'location' => 'Administration Block, Suite 100',
            'key_type' => 'Room',
            'status' => 'available',
        ]);

        $key9 = Key::create([
            'key_code' => 'KEY-SCI-109',
            'name' => 'Chemical Safety Cabinet',
            'description' => 'Fireproof lockable storage for flammable solvents and acids.',
            'location' => 'Chemistry Lab 104',
            'key_type' => 'Cabinet',
            'status' => 'available',
        ]);

        $key10 = Key::create([
            'key_code' => 'KEY-VEH-002',
            'name' => 'Campus Transport Van #02',
            'description' => 'School 12-seater passenger van for academic field trips.',
            'location' => 'Motor Pool / Parking Bay 4',
            'key_type' => 'Vehicle',
            'status' => 'lost',
        ]);

        $key11 = Key::create([
            'key_code' => 'KEY-MNT-501',
            'name' => 'Outdoor Maintenance Workshop',
            'description' => 'Groundskeeping tools, power mowers, and electrical panels.',
            'location' => 'Facilities Compound',
            'key_type' => 'Room',
            'status' => 'damaged',
        ]);

        $key12 = Key::create([
            'key_code' => 'KEY-FAC-110',
            'name' => 'Faculty Meeting Lounge',
            'description' => 'Staff resource center, microwave kitchenette, and conference room.',
            'location' => 'Main Building, 1st Floor',
            'key_type' => 'Room',
            'status' => 'available',
        ]);

        // Create Seed Borrowings
        // 1. Currently Borrowed (Science Lab 101 by Prof. John Doe)
        Borrowing::create([
            'key_id' => $key1->id,
            'user_id' => $staff1->id,
            'purpose' => 'Grade 11 AP Biology Cell Division dissection session.',
            'borrowed_at' => Carbon::now()->subHours(4),
            'expected_return_at' => Carbon::now()->addHours(20),
            'status' => 'borrowed',
            'approved_by' => $admin->id,
            'notes' => 'Handed over in good condition.',
        ]);

        // 2. Currently Borrowed (Computer Lab Alpha by Sarah Jenkins)
        Borrowing::create([
            'key_id' => $key3->id,
            'user_id' => $staff2->id,
            'purpose' => 'Robotics programming club hackathon preparation.',
            'borrowed_at' => Carbon::now()->subHours(8),
            'expected_return_at' => Carbon::now()->addDays(2),
            'status' => 'borrowed',
            'approved_by' => $admin->id,
            'notes' => 'Badge scanned and confirmed.',
        ]);

        // 3. Overdue Borrowing (Gymnasium Lockup by Coach Michael Brown)
        Borrowing::create([
            'key_id' => $key5->id,
            'user_id' => $staff3->id,
            'purpose' => 'Varsity basketball tournament equipment access.',
            'borrowed_at' => Carbon::now()->subDays(4),
            'expected_return_at' => Carbon::now()->subDays(2), // Overdue!
            'status' => 'overdue',
            'approved_by' => $admin->id,
            'notes' => 'Expected return was Friday afternoon.',
        ]);

        // 4. Pending Request (Elena Rostova wants Library Rare Archive)
        Borrowing::create([
            'key_id' => $key7->id,
            'user_id' => $staff4->id,
            'purpose' => 'Annual rare manuscripts inventory and photography cataloging.',
            'borrowed_at' => null,
            'expected_return_at' => Carbon::now()->addDays(3),
            'status' => 'pending',
            'approved_by' => null,
            'notes' => 'Awaiting security clearance check.',
        ]);

        // 5. Pending Request (Prof. John Doe wants Chemistry Prep Room)
        Borrowing::create([
            'key_id' => $key2->id,
            'user_id' => $staff1->id,
            'purpose' => 'Preparation of chemical solutions for tomorrow morning exam.',
            'borrowed_at' => null,
            'expected_return_at' => Carbon::now()->addHours(6),
            'status' => 'pending',
            'approved_by' => null,
            'notes' => 'Special ventilation protocol required.',
        ]);

        // 6. Returned (Good condition) - Elena Rostova
        Borrowing::create([
            'key_id' => $key6->id,
            'user_id' => $staff4->id,
            'purpose' => 'Drama club rehearsal staging.',
            'borrowed_at' => Carbon::now()->subDays(6),
            'expected_return_at' => Carbon::now()->subDays(5),
            'returned_at' => Carbon::now()->subDays(5)->addHour(),
            'status' => 'returned',
            'approved_by' => $admin->id,
            'return_condition' => 'good',
            'notes' => 'Returned promptly with all sound keys present.',
        ]);

        // 7. Returned (Damaged condition) - Coach Michael Brown
        Borrowing::create([
            'key_id' => $key11->id,
            'user_id' => $staff3->id,
            'purpose' => 'Grounds preparation for cross-country running event.',
            'borrowed_at' => Carbon::now()->subDays(7),
            'expected_return_at' => Carbon::now()->subDays(6),
            'returned_at' => Carbon::now()->subDays(6),
            'status' => 'damaged',
            'approved_by' => $admin->id,
            'return_condition' => 'damaged',
            'notes' => 'Key shank bent during use in rusted workshop padlock.',
        ]);

        // 8. Lost Key record - Prof. John Doe
        Borrowing::create([
            'key_id' => $key10->id,
            'user_id' => $staff1->id,
            'purpose' => 'Transporting science fair students to regional fair.',
            'borrowed_at' => Carbon::now()->subDays(10),
            'expected_return_at' => Carbon::now()->subDays(8),
            'status' => 'lost',
            'approved_by' => $admin->id,
            'return_condition' => 'missing',
            'notes' => 'Key ring slipped out during field excursion; security incident filed.',
        ]);

        // Seed Activity Logs
        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'SYSTEM_INIT',
            'description' => 'KeyTracker Key Management System initialized for Campus Facilities.',
            'created_at' => Carbon::now()->subDays(10),
        ]);

        ActivityLog::create([
            'user_id' => $staff1->id,
            'action' => 'BORROW_REQUEST',
            'description' => "Prof. John Doe requested to borrow 'Science Lab 101 Main Door'.",
            'created_at' => Carbon::now()->subHours(5),
        ]);

        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'APPROVE_BORROW',
            'description' => "Approved borrowing of 'Science Lab 101 Main Door' for Prof. John Doe.",
            'created_at' => Carbon::now()->subHours(4),
        ]);

        ActivityLog::create([
            'user_id' => $staff3->id,
            'action' => 'KEY_OVERDUE',
            'description' => "Key 'Gymnasium Equipment Lockup' (KEY-ATH-301) borrowed by Coach Michael Brown is overdue.",
            'created_at' => Carbon::now()->subDays(2),
        ]);

        ActivityLog::create([
            'user_id' => $staff4->id,
            'action' => 'RETURN_KEY',
            'description' => "Key 'Auditorium Stage & Sound Console' returned in 'good' condition.",
            'created_at' => Carbon::now()->subDays(5),
        ]);
    }
}

