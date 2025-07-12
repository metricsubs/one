import { api } from 'convex/_generated/api';
import { useQuery } from 'convex/react';
import type { Tag } from 'convex/schema';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useListData } from 'react-stately';
import { TagField } from '../ui';

export interface TagInputProps {
    tagNames: string[];
    onChange: (tagNames: string[]) => void;
    isReadOnly?: boolean;
}

export function TagInput({ tagNames, onChange }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const allTags: Tag[] = useQuery(api.projects.tags.getTags, {}) ?? [];

    // Filter tags based on input and exclude already selected ones
    const filteredTags = useMemo(() => {
        if (!inputValue.trim()) return [];

        const searchTerm = inputValue.toLowerCase();

        return allTags.filter(
            (tag) =>
                tag.name.toLowerCase().includes(searchTerm) &&
                !tagNames.includes(tag.name)
        );
    }, [allTags, inputValue, tagNames]);

    // Simple listData without complex synchronization
    const listData = useListData({
        initialItems: tagNames.map((tagName, index) => ({
            id: index,
            name: tagName,
        })),
    });

    const triggerRef = useRef<HTMLDivElement>(null);

    // Calculate position using useLayoutEffect to prevent flashing
    useLayoutEffect(() => {
        if (
            !triggerRef.current ||
            inputValue.length === 0 ||
            filteredTags.length === 0
        ) {
            return;
        }

        const rect = triggerRef.current.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // Estimate popup height based on content
        const headerHeight = 60; // Header with title and description
        const itemHeight = 40; // Each tag item
        const maxItems = 8; // Maximum items to show before scrolling
        const actualItems = Math.min(filteredTags.length, maxItems);
        const estimatedHeight = headerHeight + actualItems * itemHeight;
        const popoverHeight = Math.min(estimatedHeight, 320); // Max height

        const spaceBelow = viewport.height - rect.bottom;
        const spaceAbove = rect.top;
        const spacing = 8; // Gap between input and popup

        // Determine if popup should go above or below
        const shouldPositionAbove =
            spaceBelow < popoverHeight + spacing && spaceAbove > spaceBelow;

        let top: number;
        if (shouldPositionAbove) {
            // Position above with spacing
            top = rect.top - popoverHeight - spacing;
            // Ensure it doesn't go off-screen at the top
            top = Math.max(spacing, top);
        } else {
            // Position below with spacing
            top = rect.bottom + spacing;
            // Ensure it doesn't go off-screen at the bottom
            if (top + popoverHeight > viewport.height) {
                top = viewport.height - popoverHeight - spacing;
            }
        }

        // Ensure horizontal position stays within viewport
        let left = rect.left;
        const popupWidth = Math.max(rect.width, 200);
        if (left + popupWidth > viewport.width) {
            left = viewport.width - popupWidth - spacing;
        }
        left = Math.max(spacing, left);

        setPosition({
            top,
            left,
            width: rect.width,
        });
    }, [inputValue, filteredTags.length]);

    // Reset focused index when filtered tags change
    useEffect(() => {
        setFocusedIndex(-1);
    }, [filteredTags]);

    // Handle tag selection - simplified
    const handleTagSelect = (tag: Tag) => {
        listData.append({
            id: Date.now(),
            name: tag.name,
        });
        setInputValue('');
        setFocusedIndex(-1);
        const newTagNames = [...tagNames, tag.name];
        onChange(newTagNames);
    };

    // Handle clicks outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is inside trigger
            if (triggerRef.current?.contains(target)) {
                return;
            }

            // Check if click is inside popup (search in portaled content)
            const popupElements = document.querySelectorAll(
                '[style*="z-index: 9999"]'
            );
            for (const popup of popupElements) {
                if (popup.contains(target)) {
                    return;
                }
            }

            // Click is outside - close popup
            setInputValue('');
            setFocusedIndex(-1);
        };

        if (inputValue.length > 0) {
            document.addEventListener('mousedown', handleClickOutside);
            return () =>
                document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [inputValue]);

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        const shouldShowPopup =
            inputValue.length > 0 && filteredTags.length > 0;

        // Always handle Escape to clear input
        if (event.key === 'Escape') {
            event.preventDefault();
            setInputValue('');
            setFocusedIndex(-1);
            return;
        }

        // Only handle arrow keys and Enter when popup is showing
        if (!shouldShowPopup) {
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setFocusedIndex((prev) =>
                    prev < filteredTags.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setFocusedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredTags.length - 1
                );
                break;
            case 'Enter':
                // Only prevent default if we have a focused tag to select
                if (focusedIndex >= 0 && focusedIndex < filteredTags.length) {
                    event.preventDefault();
                    handleTagSelect(filteredTags[focusedIndex]);
                }
                break;
        }
    };

    // Compute if should be open directly during render
    const shouldShowPopup = inputValue.length > 0 && filteredTags.length > 0;

    const popup = shouldShowPopup ? (
        <div
            className="fixed z-[9999] rounded-lg border bg-overlay text-overlay-fg shadow-lg"
            style={{
                top: position.top,
                left: position.left,
                width: Math.max(position.width, 200),
                maxHeight: '300px',
                overflow: 'hidden',
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-2 border-b">
                <h3 className="font-semibold text-sm">Available Tags</h3>
                <p className="text-xs text-muted-fg">
                    Click to add • {filteredTags.length} match
                    {filteredTags.length !== 1 ? 'es' : ''} • Use ↑↓ and Enter
                </p>
            </div>
            <div className="max-h-60 overflow-y-auto">
                {filteredTags.map((tag, index) => (
                    <div
                        key={tag._id}
                        className={`cursor-pointer rounded-md px-3 py-2 text-sm flex items-center gap-2 ${
                            index === focusedIndex
                                ? 'bg-accent text-accent-fg'
                                : 'hover:bg-accent hover:text-accent-fg'
                        }`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTagSelect(tag);
                        }}
                        onMouseEnter={() => setFocusedIndex(index)}
                    >
                        <span className="w-2 h-2 rounded-full bg-primary/20"></span>
                        <span>{tag.name}</span>
                    </div>
                ))}
            </div>
        </div>
    ) : null;

    return (
        <div className="relative">
            <div ref={triggerRef}>
                <TagField
                    list={listData}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onKeyDown={handleKeyDown}
                    onItemCleared={(item) => {
                        if (!item) return;
                        const newTagNames = tagNames.filter(
                            (tagName) => tagName !== item.name
                        );
                        onChange(newTagNames);
                    }}
                    onItemInserted={(item) => {
                        if (!item) return;
                        const newTagNames = [...tagNames, item.name];
                        onChange(newTagNames);
                    }}
                />
            </div>
            {typeof document !== 'undefined' &&
                popup &&
                createPortal(popup, document.body)}
        </div>
    );
}
