# Quickstart: Role-Based Navigation Validation Guide

This guide details the scenarios to validate that the navigation header correctly displays links matching the current user role.

## Prerequisites
- A running development server for the frontend application.
- Access to the DevRoleSwitcher or local storage manipulation to alter user roles.

## Verification Steps

### Scenario 1: Guest (Unauthenticated) View
1. Open the application homepage `/` in a browser session where you are logged out.
2. Inspect the header navigation bar.
3. **Expected Outcome**:
   - The navigation links visible are: **الرئيسية** (`/`) and **تصفّح** (`/search`).
   - The vendor link visible is: **لالبائعين** (`/login` or `/auth/register-vendor`).
   - No link is visible for **لوحة البائع** (`/vendor`) or **الإدارة** (`/admin`).
   - The action button displays **تسجيل الدخول** (Login).

### Scenario 2: Logged-in Client User View
1. Log in as a standard user (`role === 'user'`).
2. Inspect the header navigation bar.
3. **Expected Outcome**:
   - The navigation links visible are: **الرئيسية** (`/`) and **تصفّح** (`/search`).
   - No link is visible for **لالبائعين**, **لوحة البائع** (`/vendor`), or **الإدارة** (`/admin`).
   - The action area displays **حسابي** (My Account) and **تسجيل الخروج** (Logout).

### Scenario 3: Logged-in Vendor View
1. Log in as a vendor (`role === 'vendor'`).
2. Inspect the header navigation bar.
3. **Expected Outcome**:
   - The navigation links visible are: **الرئيسية** (`/`), **تصفّح** (`/search`), and **لوحة البائع** (`/vendor`).
   - No link is visible for **لالبائعين** or **الإدارة** (`/admin`).
   - The action area displays **حسابي** (My Account) and **تسجيل الخروج** (Logout).

### Scenario 4: Logged-in Admin View
1. Log in as an administrator (`role === 'admin'`).
2. Inspect the header navigation bar.
3. **Expected Outcome**:
   - The navigation links visible are: **الرئيسية** (`/`), **تصفّح** (`/search`), and **الإدارة** (`/admin`).
   - No link is visible for **لالبائعين** or **لوحة البائع** (`/vendor`).
   - The action area displays **حسابي** (My Account) and **تسجيل الخروج** (Logout).

## Automated/Lint Verification
Run the linter to ensure code syntax is correct:
```bash
npm run lint
```
