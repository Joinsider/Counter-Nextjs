'use client';

import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";

export default function Main() {

    return (
        <div className="flex items-center justify-center min-h-screen flex-col">
            <Image src={'/counter.webp'} width={320} height={320} className="rounded-full"
                   alt="Icon of the website showing a mechanical counter device" priority/>
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
                Welcome to our Counter App!
            </h1>
            <p>
                Please login using your i24 e-mail address.
            </p>
            <Link href="/counter/">
                <Button variant="outline" className="bg-white dark:bg-gray-600">
                    Go to the counters
                </Button>
            </Link>
        </div>
    )
}