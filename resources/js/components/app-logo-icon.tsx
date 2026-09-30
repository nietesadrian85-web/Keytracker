import { KeyRound } from 'lucide-react';
import type { SVGAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: SVGAttributes<SVGElement>) {
    return <KeyRound className={className || 'size-5'} {...props} />;
}
