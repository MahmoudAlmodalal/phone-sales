# Data Model: Role-Based Navigation

## Entities

### 1. User Session (Client State)
Represents the current session information stored in the Zustand client-side store (`useSessionStore`).

- **Properties**:
  - `role`: `'guest' | 'user' | 'vendor' | 'admin'` (The tier of the active user session).
  - `hydrated`: `boolean` (Indicates if the state has successfully rehydrated from persistent storage).

- **Computed Properties / Flags** (`useSession` helper):
  - `isAuthed`: `boolean` (true if `role !== 'guest'`).
  - `isVendor`: `boolean` (true only if `role === 'vendor'`).
  - `isAdmin`: `boolean` (true if `role === 'admin'`).

> [!NOTE]
> In `session.ts`, the original implementation defined `isVendor` as `role === 'vendor' || role === 'admin'`. To isolate the Admin and Vendor dashboard views, `isVendor` must be updated to only match `role === 'vendor'`.

---

### 2. Navigation Link
Represents a navigation target displayed in the header.

- **Properties**:
  - `href`: `string` (The absolute page path, e.g., `/`, `/search`, `/vendor`, `/admin`, `/login`).
  - `label`: `string` (The localized display name, e.g., `"الرئيسية"`, `"تصفّح"`, `"لوحة البائع"`, `"الإدارة"`, `"للبائعين"`).
