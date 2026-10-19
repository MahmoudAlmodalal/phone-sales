# Tasks: Role-Based Navigation

**Input**: Design documents from `/specs/001-role-based-navigation/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/ui-contracts.md

**Tests**: Verification will be performed manually following `specs/001-role-based-navigation/quickstart.md` scenarios, as well as typescript/linter checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Contains exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alignment and initial check

- [ ] T001 Verify active Next.js development server is running and clean in frontend/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Differentiating admin and vendor flags in the session store

- [ ] T002 Update the `useSession` hook in `frontend/src/stores/session.ts` so that `isVendor` is strictly defined as `role === 'vendor'` (separating it from the admin check)

---

## Phase 3: User Story 1 - Client Navigation (Priority: P1) 🎯 MVP

**Goal**: Dynamically display Client/Guest header links and hide dashboard views.

**Independent Test**: Verify Guest and Client user views in `frontend/src/components/Navbar.tsx` match the spec.

### Implementation for User Story 1

- [ ] T003 [US1] Define dynamic links rendering logic in `frontend/src/components/Navbar.tsx` for Guest (`role === 'guest'`) to show "الرئيسية" (`/`), "تصفّح" (`/search`), and "لالبائعين" (`/login`)
- [ ] T004 [US1] Define dynamic links rendering logic in `frontend/src/components/Navbar.tsx` for Client (`role === 'user'`) to show only "الرئيسية" (`/`) and "تصفّح" (`/search`)
- [ ] T005 [US1] Manually verify Guest and Client views in the browser following Scenario 1 and 2 in `specs/001-role-based-navigation/quickstart.md`

---

## Phase 4: User Story 2 - Vendor Navigation (Priority: P1)

**Goal**: Dynamically display the Vendor dashboard link in the header.

**Independent Test**: Verify Vendor view in `frontend/src/components/Navbar.tsx` matches the spec.

### Implementation for User Story 2

- [ ] T006 [US2] Update dynamic links rendering in `frontend/src/components/Navbar.tsx` for Vendor (`role === 'vendor'`) to show "الرئيسية" (`/`), "تصفّح" (`/search`), and "لوحة البائع" (`/vendor`)
- [ ] T007 [US2] Manually verify Vendor view in the browser following Scenario 3 in `specs/001-role-based-navigation/quickstart.md`

---

## Phase 5: User Story 3 - Administrator Navigation (Priority: P1)

**Goal**: Dynamically display the Administrator panel link in the header.

**Independent Test**: Verify Admin view in `frontend/src/components/Navbar.tsx` matches the spec.

### Implementation for User Story 3

- [ ] T008 [US3] Update dynamic links rendering in `frontend/src/components/Navbar.tsx` for Admin (`role === 'admin'`) to show "الرئيسية" (`/`), "تصفّح" (`/search`), and "الإدارة" (`/admin`)
- [ ] T009 [US3] Manually verify Admin view in the browser following Scenario 4 in `specs/001-role-based-navigation/quickstart.md`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify drawer alignment and check code quality.

- [ ] T010 Verify that the mobile navigation drawer (collapsible mobile menu) in `frontend/src/components/Navbar.tsx` correctly renders the same dynamic links as the desktop header
- [ ] T011 [P] Run project linter using `npm run lint` in `frontend/` to confirm typescript compilation and lint rules pass
- [ ] T012 Run the end-to-end verification checklist defined in `specs/001-role-based-navigation/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1. Must be completed before Phase 3, 4, or 5.
- **User Stories (Phases 3-5)**: Must run in priority order or concurrently once Phase 2 is complete. Since they edit the same navbar file, sequential execution (US1 → US2 → US3) is recommended to prevent merge conflicts.
- **Polish (Phase 6)**: Runs after all user story implementation is complete.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete setup and store updates (Phase 1 & 2).
2. Complete Client/Guest logic (Phase 3).
3. Test guest and client navigation manually to confirm MVP delivery.
4. Proceed to Vendor/Admin implementations (Phase 4 & 5).
