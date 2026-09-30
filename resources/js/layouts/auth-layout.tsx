import { KeyRound } from 'lucide-react';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">

                    {/* ONE KEY ICON ONLY */}
                    <div className="mb-5 flex justify-center">
                        <KeyRound
                            className="h-12 w-12 text-black"
                            strokeWidth={3}
                        />
                    </div>

                    <AuthLayoutTemplate
                        title={title}
                        description={description}
                    >
                        {children}
                    </AuthLayoutTemplate>

                </div>
            </div>
        </div>
    );
}