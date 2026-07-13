# مساعد سياسات إخاء

## خطوات النشر على Vercel (5 دقائق)

### 1. حمّل المشروع على GitHub
- افتح github.com وأنشئ حساب لو ما عندك
- أنشئ Repository جديد اسمه `ekhaa-policy-assistant`
- ارفع ملفات المشروع كاملة

### 2. افتح Vercel
- روح vercel.com وسجّل بحساب GitHub
- اضغط "Add New Project"
- اختر الـ Repository اللي رفعته

### 3. أضف الـ API Key (الخطوة المهمة)
- في صفحة الإعدادات قبل النشر
- اضغط "Environment Variables"
- أضف:
  - **Name:** `ANTHROPIC_API_KEY`
  - **Value:** مفتاحك من console.anthropic.com
- اضغط Deploy

### 4. خلاص!
- Vercel بيعطيك رابط مثل: `https://ekhaa-policy-assistant.vercel.app`
- أرسل هذا الرابط لأي شخص — يشتغل فوراً بدون ما يعرف الـ API key
