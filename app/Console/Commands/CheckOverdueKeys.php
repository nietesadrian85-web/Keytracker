<?php

namespace App\Console\Commands;

use App\Services\OverdueService;
use Illuminate\Console\Command;

class CheckOverdueKeys extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'keys:check-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and update status of keys whose return date has passed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for overdue borrowings...');
        $count = OverdueService::checkAndUpdateOverdue();
        $this->info("Updated {$count} overdue borrowing(s).");

        return Command::SUCCESS;
    }
}

