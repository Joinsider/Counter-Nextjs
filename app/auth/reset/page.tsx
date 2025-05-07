import dynamic from 'next/dynamic';

const ResetForm = dynamic(
    () => import('@/components/auth/resetForm'),
    { ssr: false }
);

export default function ResetRequestPage() {
    return <ResetForm mode="request" />;
}