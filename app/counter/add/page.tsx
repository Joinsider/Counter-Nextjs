import {AuthNav} from "@/components/auth/authNav";
import {SideMenu} from "@/components/SideMenu";
import React from "react";

import AddCounterForm from "@/components/addCounterForm";

export default function CounterPage() {
    return <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AuthNav/>
        <SideMenu/>
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
                <AddCounterForm/>
            </div>
        </div>
    </main>
}