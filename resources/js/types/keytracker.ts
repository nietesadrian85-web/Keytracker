import { User } from './auth';

export type KeyStatus = 'available' | 'borrowed' | 'overdue' | 'lost' | 'damaged';

export type KeyType = 'Room' | 'Master' | 'Cabinet' | 'Padlock' | 'Vehicle' | string;

export type KeyItem = {
    id: number;
    key_code: string;
    name: string;
    description: string | null;
    location: string;
    key_type: KeyType;
    status: KeyStatus;
    created_at: string;
    updated_at: string;
    active_borrowing?: BorrowingItem | null;
};

export type BorrowingStatus =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'borrowed'
    | 'returned'
    | 'overdue'
    | 'lost'
    | 'damaged';

export type ReturnCondition = 'good' | 'damaged' | 'missing' | null;

export type BorrowingItem = {
    id: number;
    key_id: number;
    user_id: number;
    purpose: string;
    borrowed_at: string | null;
    expected_return_at: string | null;
    returned_at: string | null;
    status: BorrowingStatus;
    approved_by: number | null;
    return_condition: ReturnCondition;
    notes: string | null;
    created_at: string;
    updated_at: string;
    key?: KeyItem;
    user?: User;
    approver?: User | null;
};

export type ActivityLogItem = {
    id: number;
    user_id: number | null;
    action: string;
    description: string;
    created_at: string;
    user?: User | null;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

