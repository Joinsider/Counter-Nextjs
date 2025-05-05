"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { LanguageSwitcher } from "./languageSwitcher";
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/lib/store/slices/themeSlice';
import { RootState } from '@/lib/store/store';

export function ThemeSwitcher() {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme.theme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') || 'system';
            dispatch(setTheme(savedTheme));
        }
    }, [dispatch]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' 
            ? 'dark' 
            : theme === 'dark' 
                ? 'system' 
                : 'light';
        
        dispatch(setTheme(newTheme));
        
        if (newTheme === 'system') {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? 'dark'
                : 'light';
            document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        } else {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
    };

    if (!mounted) return null;

    return (
        <div className="fixed bottom-4 left-4 z-10">
            <Button
                variant="outline"
                size="icon"
                className="bg-white dark:bg-gray-700 rounded-r-none"
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                {theme === 'system' ? (
                    <Monitor className="h-5 w-5" />
                ) : theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                ) : (
                    <Sun className="h-5 w-5" />
                )}
            </Button>
            <LanguageSwitcher />
        </div>
    );
}