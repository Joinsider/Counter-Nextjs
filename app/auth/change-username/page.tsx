'use client'

import ChangeUsernameForm from "@/components/changeUsernameForm";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from '@geist-ui/icons';
import {useRouter} from "next/navigation";

export default function ChangeUsernamePage() {
    const router = useRouter();

    return (
        <div>
            <Button
                variant={"outline"}
                className="fixed top-4 left-4 bg-white dark:bg-gray-700"
                onClick={() => router.push("/counter/")}
            >
                <ArrowLeft size={20}/>
            </Button>
            <ChangeUsernameForm/>;
        </div>
    )
}