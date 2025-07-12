import { api } from 'convex/_generated/api';
import { useQuery } from 'convex/react';
import type { Tag } from 'convex/schema';
import { useEffect, useMemo, useRef, useState } from 'react';
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
        const selectedTagNames = new Set(
            tagNames.map((name) => name.toLowerCase())
        );

        return allTags.filter(
            (tag) =>
                tag.name.toLowerCase().includes(searchTerm) &&
                !selectedTagNames.has(tag.name.toLowerCase())
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

    // Calculate position when input changes
    useEffect(() => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        const popoverHeight = Math.min(300, 200);
        const spaceBelow = viewport.height - rect.bottom;
        const spaceAbove = rect.top;

        const shouldPositionAbove =
            spaceBelow < popoverHeight && spaceAbove > spaceBelow;

        setPosition({
            top: shouldPositionAbove ? rect.top - popoverHeight : rect.bottom,
            left: rect.left,
            width: rect.width,
        });
    }, [inputValue]);

    // Reset focused index when filtered tags change
    useEffect(() => {
        setFocusedIndex(-1);
    }, [filteredTags]);

    // Handle tag selection - simplified
    const handleTagSelect = (tag: Tag) => {
        console.log('🏷️ Tag selected:', tag.name);
        const newTagNames = [...tagNames, tag.name];
        console.log('🆕 Calling onChange with:', newTagNames);
        onChange(newTagNames);
        setInputValue('');
        setFocusedIndex(-1);
    };

    // Handle clicks outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setInputValue('');
                setFocusedIndex(-1);
            }
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

        if (!shouldShowPopup) {
            if (event.key === 'Escape') {
                setInputValue('');
                setFocusedIndex(-1);
            }
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                console.log('⬇️ Arrow down');
                event.preventDefault();
                setFocusedIndex((prev) =>
                    prev < filteredTags.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                console.log('⬆️ Arrow up');
                event.preventDefault();
                setFocusedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredTags.length - 1
                );
                break;
            case 'Enter':
                console.log('↩️ Enter pressed');
                event.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < filteredTags.length) {
                    handleTagSelect(filteredTags[focusedIndex]);
                }
                break;
            case 'Escape':
                event.preventDefault();
                setInputValue('');
                setFocusedIndex(-1);
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
        >
            <div className="p-2 border-b">
                <h3 className="font-semibold text-sm">Available Tags</h3>
                <p className="text-xs text-muted-fg">
                    Click to add • {filteredTags.length} match
                    {filteredTags.length !== 1 ? 'es' : ''}
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
                        onClick={() => {
                            console.log('🖱️ Tag clicked:', tag.name);
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
            <div ref={triggerRef} onKeyDown={handleKeyDown}>
                <TagField
                    list={listData}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                />
            </div>
            {typeof document !== 'undefined' &&
                popup &&
                createPortal(popup, document.body)}
        </div>
    );
}
