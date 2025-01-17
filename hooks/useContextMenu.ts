// hooks/useContextMenu.ts
import { useState, useEffect } from 'react';

const useContextMenu = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const showMenu = (x: number, y: number) => {
        setMenuPosition({ x, y });
        setMenuVisible(true);
    };

    const hideMenu = () => {
        setMenuVisible(false);
    };

    useEffect(() => {
        const handleClick = () => hideMenu();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return { menuVisible, menuPosition, showMenu, hideMenu };
}

export default useContextMenu;
