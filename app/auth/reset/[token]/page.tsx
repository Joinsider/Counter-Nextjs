'use client'

import ResetForm from "@/components/auth/resetForm";
import {useParams} from "next/navigation";


export default function ResetPage() {
    const params = useParams();
    const token = params.token as string;

    return <ResetForm mode="reset" token={token}/>;
}