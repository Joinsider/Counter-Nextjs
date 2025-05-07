'use client'

import { Button } from "@/components/ui/button";
import { ArrowLeft } from '@geist-ui/icons';
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const ChangeUsernameForm = dynamic(
    () => import('@/components/auth/changeUsernameForm'),
    {
        loading: () => <div>Loading username form...</div>,
        ssr: false
    }
);

export default function ChangeUsernamePage() {
    const router = useRouter();

    return (
        <div>
            <Button
                variant={"outline"}
                className="fixed top-4 left-4 bg-white dark:bg-gray-700"
                onClick={() => router.push("/counter/")}
            >
                <ArrowLeft size={20} />
            </Button>
            <ChangeUsernameForm />;
        </div>
    )
}