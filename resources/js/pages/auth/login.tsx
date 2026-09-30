import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck, UserCheck } from 'lucide-react';
import type { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword?: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    const fillAndLogin = (email: string) => {
        setData((prev) => ({
            ...prev,
            email,
            password: 'password123',
        }));
    };

    return (
        <AuthLayout
            title="KeyTracker Management Portal"
            description="School Key Management & Physical Security System"
        >
            <Head title="Sign In - KeyTracker" />

            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-800 uppercase dark:text-blue-300">
                    <span>Quick Demo Credentials</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => fillAndLogin('admin@school.edu')}
                        className="flex flex-col items-start rounded-lg border border-blue-200 bg-white p-2.5 text-left text-xs transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                        <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400">
                            <ShieldCheck className="size-3.5" />
                            <span>Login as Admin</span>
                        </div>
                        <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            admin@school.edu
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillAndLogin('john.doe@school.edu')}
                        className="flex flex-col items-start rounded-lg border border-slate-200 bg-white p-2.5 text-left text-xs transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                            <UserCheck className="size-3.5" />
                            <span>Login as Staff</span>
                        </div>
                        <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            john.doe@school.edu
                        </span>
                    </button>
                </div>
                <div className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
                    Password for demo accounts is <code className="font-mono font-semibold text-blue-700 dark:text-blue-300">password123</code>
                </div>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="email" className="font-medium text-slate-700 dark:text-slate-300">
                        Institutional Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="email"
                        placeholder="faculty@school.edu"
                        className="border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="font-medium text-slate-700 dark:text-slate-300">
                            Password
                        </Label>
                        {canResetPassword && (
                            <TextLink href={request()} className="text-xs text-blue-600 hover:underline">
                                Forgot password?
                            </TextLink>
                        )}
                    </div>
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={data.remember}
                        onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                        tabIndex={3}
                    />
                    <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                        Keep me signed in on this workstation
                    </Label>
                </div>

                <Button
                    type="submit"
                    className="mt-2 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700 shadow-sm"
                    tabIndex={4}
                    disabled={processing}
                >
                    {processing && <Spinner className="mr-2" />}
                    Sign in to KeyTracker
                </Button>

                <div className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                    New staff member?{' '}
                    <TextLink href={register()} className="font-semibold text-blue-600 hover:underline">
                        Register Account
                    </TextLink>
                </div>
            </form>

            {status && (
                <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-xs font-medium text-emerald-700">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
