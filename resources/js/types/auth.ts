export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'staff';
    department?: string | null;
    contact_number?: string | null;
    status: 'active' | 'inactive';
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    active_borrowings_count?: number;
    total_borrowings_count?: number;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type SharedCounts = {
    pending_requests: number;
    overdue_keys: number;
    my_borrowed: number;
};
