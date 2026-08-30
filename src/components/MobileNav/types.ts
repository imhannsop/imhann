import { crumbLinks } from "@/lib/data";

export interface NavItem {
  /** Unique key for this nav entry (React key, not necessarily a DOM id). */
  id: string;
  /** The actual DOM element id to scroll to when this item is selected. */
  sectionId: string;
  label: string;
}

export interface Position {
  x: number;
  y: number;
}



/**
 * Mobile nav items are derived directly from `crumbLinks` — the same data
 * the desktop navbar uses — so the two can never drift out of sync.
 * crumbLinks: { id, value, label } → { sectionId: id, id: value, label }
 */
export const DEFAULT_NAV_ITEMS: NavItem[] = crumbLinks.map((c) => ({
  id: c.value,
  sectionId: c.id,
  label: c.label,
}));
