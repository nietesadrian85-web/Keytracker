import type { ReactNode } from 'react';

interface AuthSimpleLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title = '',
    description = '',
}: AuthSimpleLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-medium tracking-tight text-black">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-2 text-sm text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
}