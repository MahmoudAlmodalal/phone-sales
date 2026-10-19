# Research: Role-Based Navigation

## Technical Decisions

### Decision 1: Navigation Link Configuration
- **Choice**: Statically define all navigation links in a configuration array and dynamically filter them inside the React component using the active role from the session store.
- **Rationale**: Keeps the rendering logic simple, centralized, and easy to maintain when new roles or links are added.
- **Alternatives considered**:
  - Exposing distinct `<NavbarAdmin>`, `<NavbarVendor>`, and `<NavbarClient>` components. (Rejected because of excessive code duplication and high maintenance overhead).

### Decision 2: State Reactivity
- **Choice**: Utilize the custom hook `useSession()` which subscribes to the Zustand `useSessionStore` to dynamically fetch `role`, `isAuthed`, `isVendor`, and `isAdmin` flags.
- **Rationale**: Ensures the navbar renders correctly and reactively when the session state changes, without manual trigger events.
- **Alternatives considered**:
  - Subscribing directly to `useSessionStore.getState()` inside `useEffect`. (Rejected because React components would not automatically re-render when the state changes).

### Decision 3: Client vs. Vendor Role Separation
- **Choice**: Logged-in clients (`role === 'user'`) do not see the "للبائعين" (For Vendors) link in the header. Only guests see "للبائعين". Standard clients can apply for vendor accounts via the account/profile section, preserving navbar space.
- **Rationale**: Minimizes header clutter for active sessions and avoids confusing users who are already logged in as clients.
- **Alternatives considered**:
  - Keep "للبائعين" visible for standard logged-in clients. (Rejected to keep the header bar clean and focus clients on search/browse).
