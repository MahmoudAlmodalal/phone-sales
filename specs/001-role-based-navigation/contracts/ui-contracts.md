# Interface Contracts: Navigation & Session

This document details the API and properties exposed by the navigation component and the session store hooks.

## 1. Navbar Component

```typescript
export default function Navbar(): React.JSX.Element;
```

- **Props**: None.
- **Behavior**: Reads active user role from `useSession` and dynamically filters the visible links.
- **Links Configuration**:
  ```typescript
  interface NavigationLink {
    href: string;
    label: string;
  }
  ```

## 2. Session Hook Interface

```typescript
export function useSession(): {
  role: Role;
  roleLabel: string;
  isAuthed: boolean;
  isVendor: boolean;
  isAdmin: boolean;
};
```

- **Role values**: `'guest' | 'user' | 'vendor' | 'admin'`
