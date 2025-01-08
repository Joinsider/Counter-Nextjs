'use client';

import {useEffect} from "react";
import {pb} from "@/lib/pocketbase";
import {useRouter} from "next/navigation";

export default function Main() {
    const router = useRouter();


    useEffect(() => {
        const loggedIn = pb.authStore.isValid;

        if(loggedIn) {
            router.replace('/counter');
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen flex-col">
            <img src={'counter.webp'} className="w-80 rounded-full" alt="Icon of the website showing a mechanical counter device"></img>
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
                Welcome to our Counter App!
            </h1>
            <p>
                Please login using your i24 e-mail address.
            </p>
        </div>
    )
}