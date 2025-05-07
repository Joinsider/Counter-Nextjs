'use client'


import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const ResetForm = dynamic(
    () => import('@/components/auth/resetForm'),
    {
        loading: () => <div>Loading reset form...</div>,
        ssr: false
    }
);

export default function ResetPage() {
    const params = useParams();
    const token = params.token as string;

    return <ResetForm mode="reset" token={token} />;
}