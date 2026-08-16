# المشاريع الطويلة — لازم للخدمات الطبية

موقع لعرض مشاريع لازم طويلة الأمد (عقود العيادات وسيارات الإسعاف مع العملاء)، بتصميم زجاجي (glassmorphism) بهوية لازم.

## هيكلة الملفات

```
lazem-projects/
├── index.html          الصفحة الرئيسية
├── css/
│   └── style.css       التنسيق الكامل
├── js/
│   └── app.js          منطق العرض + قراءة البيانات
├── data/
│   └── projects.json   بيانات المشاريع (عدّل هنا لإضافة/تعديل مشروع)
├── assets/
│   ├── logo-lazem.png  شعار لازم
│   ├── bg-photo.jpg    خلفية الأسطول
│   ├── logo-*.png      شعارات العملاء (8 ملفات)
│   └── icon-*.png      أيقونات نوع الخدمة (إسعاف / عيادة / كلاهما)
├── README.md
└── .gitignore
```

## التشغيل محليًا

الموقع HTML/CSS/JS بسيط بدون أي أدوات بناء (build tools). لكن لازم يفتح عبر سيرفر محلي صغير (مو بفتح الملف مباشرة من المتصفح) عشان `fetch('data/projects.json')` يشتغل:

```bash
# داخل مجلد lazem-projects
python3 -m http.server 8000
# ثم افتح http://localhost:8000
```

أو باستخدام إضافة **Live Server** في VS Code (يمين على `index.html` ← Open with Live Server).

## إضافة أو تعديل مشروع

عدّل `data/projects.json` فقط — لا حاجة لمس أي كود. كل مشروع كائن بهذا الشكل:

```json
{
  "client": "اسم الجهة بالعربي",
  "sub": "الاسم بالإنجليزي",
  "code": "كود المشروع",
  "logo": "assets/logo-xxx.png",
  "services": [
    { "type": "clinic", "level": "BLS" },
    { "type": "ambulance", "level": "ALS" }
  ],
  "days": 7,
  "hours": 24,
  "start": "2025-01-01",
  "end": "2026-01-01",
  "suspendedSince": "2026-03-12",
  "multiCity": "التشغيل في 5 مدن"
}
```

- `suspendedSince` و `multiCity` اختياريان — تُحذف إذا ما تنطبق على المشروع.
- الحالة (نشط / متوقف / منتهي) تُحسب تلقائيًا من `start`/`end`/`suspendedSince` مقارنة بتاريخ اليوم — لا تُكتب يدويًا.
- لإضافة شعار عميل جديد: ضيف ملف PNG في `assets/` واربطه بمسار `logo` في نفس السجل.

## النشر على GitHub Pages

1. ارفع المجلد إلى مستودع GitHub جديد.
2. من إعدادات المستودع (Settings → Pages)، اختر Deploy from branch، وحدد `main` والمجلد `/ (root)`.
3. بعد دقيقة أو دقيقتين يصير الموقع متاح على رابط من نوع:
   `https://<username>.github.io/<repo-name>/`

لا حاجة لأي سيرفر خلفي أو قاعدة بيانات حقيقية — البيانات ملف JSON ثابت يُقرأ مباشرة من المتصفح.
