// components/ContextMenu.tsx
import {CSSProperties} from 'react';

interface ContextMenuProps {
    position: { x: number; y: number };
    items: Array<{ label: string; action: () => void }>;
}

const ContextMenu = ({position, items}: ContextMenuProps) => {
    const menuStyle: CSSProperties = {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000
    };

    return (
        <div style={menuStyle} className="bg-white dark:bg-gray-800 shadow-md rounded-lg py-2">
            {items.map((item, index) => (
                <div
                    key={index}
                    onClick={item.action}
                    className="px-8 py-2 cursor-pointer hover:bg-gray-500 dark:hover:bg-gray-700"
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
};



export default ContextMenu;
