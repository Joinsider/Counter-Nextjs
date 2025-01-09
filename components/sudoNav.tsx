import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {pb} from "@/lib/pocketbase";

export default function SudoNav() {
    const [isSudo, setIsSudo] = useState(false);

    useEffect(() => {
        const checkSudoState = async () => {
            const sudo = pb.authStore.model?.sudo;
            console.log("Sudo: " + sudo);
            if (sudo) {
                setIsSudo(true);
            }else {
                setIsSudo(false);
            }
        }

        checkSudoState();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {
                isSudo ? (
                    <div className="">
                        <Link href={"/counter/add"}>
                            <Button variant="outline" className="bg-white dark:bg-gray-700">
                                Add Counter
                            </Button>
                        </Link>
                    </div>
                ) : null
            }
        </div>
    );
}