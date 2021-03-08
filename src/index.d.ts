import React, { HTMLAttributes } from 'react';
declare type Props = HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    /** Called when the user starts a sorting gesture. */
    onSortStart: () => void;
    /** Called when the user finishes a sorting gesture. */
    onSortEnd: (oldIndex: number, newIndex: number) => void;
    /** Class applied to the item being dragged */
    draggedItemClassName?: string;
};
declare const SortableList: ({ children, onSortStart, onSortEnd, draggedItemClassName, ...rest }: Props) => JSX.Element;
export default SortableList;
declare type ItemProps = {
    children: React.ReactElement;
};
/**
 * SortableItem only adds a ref to its children so that we can register it to the main Sortable
 */
export declare const SortableItem: ({ children }: ItemProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
//# sourceMappingURL=index.d.ts.map