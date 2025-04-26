# ألعاب الشايب - دليل التشغيل المحلي

## متطلبات التشغيل
- [Node.js](https://nodejs.org/) الإصدار 18 أو أعلى
- [npm](https://www.npmjs.com/) أو [yarn](https://yarnpkg.com/)

## خطوات التثبيت

### 1. نسخ المشروع من GitHub (إذا كان متاحًا) أو تنزيله كملف ZIP

```bash
git clone <رابط المستودع>
cd alshayeb-games
```

### 2. تثبيت المكتبات اللازمة

```bash
npm install
```

أو باستخدام yarn:

```bash
yarn install
```

### 3. بدء تشغيل التطبيق

#### على نظام Windows

في نظام Windows، يمكنك استخدام الأمر التالي لتشغيل التطبيق:

```bash
set NODE_ENV=development && npx tsx server/index.ts
```

أو يمكنك إنشاء ملف `run-dev.bat` بالمحتوى التالي:

```batch
@echo off
set NODE_ENV=development
npx tsx server/index.ts
```

ثم تشغيل هذا الملف بالنقر عليه أو كتابة `run-dev` في سطر الأوامر.

#### على نظام Linux/Mac

يمكنك تشغيل التطبيق بالأمر التالي:

```bash
npm run dev
```

أو باستخدام yarn:

```bash
yarn dev
```

سيقوم هذا الأمر بتشغيل خادم Express (الباكند) وخادم Vite (الفرونت إند) معًا.

## الوصول إلى التطبيق

بعد تشغيل الأمر، سيكون التطبيق متاحًا على العنوان التالي في المتصفح:

```
http://localhost:3000
```

## ملاحظة للمطورين

- قد تحتاج إلى تعديل ملف `package.json` للتأكد من أن الأوامر مناسبة لبيئة Windows.
- تأكد من إنشاء بيئة تطوير داخلية (in-memory storage) دون الحاجة لإعداد قاعدة بيانات.
- إذا واجهت أي مشكلات تتعلق بالمنافذ، يمكنك تعديل المنفذ في ملف `server/index.ts`.