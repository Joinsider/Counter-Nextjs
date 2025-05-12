'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function Main() {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-center min-h-screen flex-col">
            <Image src={'/counter.webp'} width={320} height={320} className="rounded-full"
                alt="Icon of the website showing a mechanical counter device" priority />
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
                {t('main.title')}
            </h1>
            <p>
                {t('main.description')}
            </p>
            <Link href="/counter/">
                <Button variant="outline" className="bg-white dark:bg-gray-600">
                    {t('main.counterButton')}
                </Button>
            </Link>
        </div>
    )
}