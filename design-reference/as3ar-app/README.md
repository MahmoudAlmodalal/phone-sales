# أسعار — منصة مقارنة أسعار الجوالات والحجز المسبق

هيكل تطبيق ويب (Front-End) مبني بـ **React 18 + Vite + Tailwind CSS**، مع تنقّل كامل (React Router v6) وحالة عامة للدور (Global Role State).

هذه المرحلة تُنشئ **الهيكل الخارجي فقط**: الـ Navbar، نظام المسارات، وإدارة الحالة. محتوى الصفحات الداخلية يأتي في مراحل لاحقة (الصفحات حالياً بطاقات "قيد الإنشاء").

---

## التشغيل

```bash
cd as3ar-app
npm install
npm run dev
```

ثم افتح العنوان الذي يظهره Vite (عادة http://localhost:5173).

للبناء للإنتاج: `npm run build` ثم `npm run preview`.

> ملاحظة: هذا المشروع يحتاج `npm install` وخادم تطوير (Vite) — لا يعمل بفتح `index.html` مباشرة في المتصفح.

---

## الهوية البصرية (Design Tokens)

مأخوذة من دليل هوية "أسعار". معرّفة في `tailwind.config.js`:

| Token (Tailwind) | Hex | الاستخدام |
|---|---|---|
| `green` | `#007A3D` | الأزرار الأساسية، الرأس، انخفاض السعر |
| `green-deep` | `#00532A` | Hover، التذييل الثانوي |
| `green-tint` | `#E6F2EB` | خلفيات التوفير، أفضل قيمة |
| `ink` | `#0E1311` | النص، التذييل |
| `paper` | `#FFFFFF` | خلفية المحتوى |
| `surface` | `#F4F6F5` | خلفية الصفحة |
| `line` | `#DDE3E0` | الحدود |
| `muted` | `#6B7772` | نص ثانوي |
| `star` | `#CE1126` | الأحمر النجمي — **استخدام مقيّد** |
| `star-tint` | `#FDECEE` | خلفية تحذير/عدّاد |

**الخطوط:** `font-heading` = Tajawal، `font-sans` = IBM Plex Sans Arabic، `font-mono` = IBM Plex Mono (للأرقام والأسعار). محمّلة في `index.html`.

**قاعدة الأحمر:** لا يُستخدم `star`/`star-tint` إلا في: العدّاد التنازلي، ارتفاع السعر، الحذف/الأخطاء المدمّرة، "آخر قطعة". والنجمة الخماسية محجوزة للشعار ومؤشر الحجز وشارة "موثّق" فقط.

الاتجاه **RTL** مفعّل على مستوى `<html dir="rtl">`؛ استخدم خصائص `ms-*/me-*/ps-*/pe-*` المنطقية في Tailwind.

---

## بنية المشروع

```
as3ar-app/
├─ index.html                 # جذر الصفحة + تحميل الخطوط + dir="rtl"
├─ tailwind.config.js         # توكنز الألوان والخطوط
├─ src/
│  ├─ main.jsx                # التهيئة: BrowserRouter + AppProvider
│  ├─ App.jsx                 # تعريف كل المسارات (Routes)
│  ├─ index.css               # Tailwind + إعدادات أساسية + حلقة التركيز
│  ├─ context/
│  │  └─ AppContext.jsx       # الحالة العامة: الدور، المفضلة، المقارنة
│  ├─ layouts/
│  │  └─ RootLayout.jsx       # Navbar + Outlet + Footer + DevRoleSwitcher
│  ├─ components/
│  │  ├─ Navbar.jsx           # الرأس الأخضر الثابت (متجاوب مع قائمة جوال)
│  │  ├─ Footer.jsx           # التذييل الأسود
│  │  ├─ Star.jsx             # النجمة التوقيعية (مكوّن مشترك)
│  │  ├─ DashboardLayout.jsx  # قشرة لوحات التحكم (تبويبات + Outlet)
│  │  ├─ ProtectedRoute.jsx   # حارس المسارات حسب الدور
│  │  ├─ PlaceholderPage.jsx  # بطاقة "قيد الإنشاء"
│  │  └─ DevRoleSwitcher.jsx  # مبدّل الدور (تطوير فقط)
│  └─ pages/
│     ├─ Home.jsx  Search.jsx  Product.jsx  Compare.jsx
│     ├─ Booking.jsx  Auth.jsx  NotFound.jsx
```

---

## نظام التنقّل (Routes)

| المسار | الصفحة | الحماية |
|---|---|---|
| `/` | الرئيسية | عامة |
| `/search` | البحث والنتائج | عامة |
| `/product/:id` | صفحة المنتج | عامة |
| `/compare` | المقارنة | عامة |
| `/booking/:id` | تدفّق الحجز | عامة |
| `/login` | المصادقة | عامة |
| `/account` `/account/favorites` `/account/alerts` `/account/bookings` | لوحة المستخدم | user / vendor / admin |
| `/vendor` `/vendor/products` `/vendor/import` `/vendor/bookings` | لوحة البائع | vendor / admin |
| `/admin` `/admin/users` `/admin/reviews` `/admin/backup` | لوحة الإدارة | admin |
| `*` | 404 | عامة |

لوحات التحكم تستخدم مسارات متداخلة (Nested Routes) مع تبويبات عبر `DashboardLayout`.

---

## إدارة الحالة (Global State)

`AppContext` يوفّر:

- **`role`** — الدور الحالي: `guest` / `user` / `vendor` / `admin` (محفوظ في `localStorage`).
- مشتقات: `isAuthed` · `isVendor` · `isAdmin` · `roleLabel`.
- **`login(role)`** / **`logout()`** — تبديل الدور.
- **`favorites` + `toggleFavorite(id)`** — قائمة المفضلة.
- **`compare` + `toggleCompare(id)` + `clearCompare()`** — المقارنة (حد أقصى ٤).

الوصول من أي مكوّن: `const { role, login } = useApp()`.

### التبديل بين الواجهات أثناء التطوير

يظهر **مبدّل الدور** أسفل يمين الشاشة (في وضع التطوير فقط، مخفي في الإنتاج). اختر زائر/مستخدم/بائع/مدير النظام للانتقال الفوري بين الواجهات. كما يمكن "الدخول السريع" بأي دور من صفحة `/login`.

المسارات المحمية تعيد التوجيه إلى `/login` إذا لم يكن الدور مسموحاً، مع تذكّر الوجهة الأصلية للرجوع إليها بعد الدخول.

---

## الخطوة التالية

بناء محتوى الصفحات الداخلية (الرئيسية بشريط الأسعار الحيّ، البحث بالفلاتر، صفحة المنتج، تدفّق الحجز، ثم اللوحات) مع نفس التوكنز والمكوّنات المشتركة.
