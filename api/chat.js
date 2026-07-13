export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  const SYSTEM_PROMPT = `أنت مساعد متخصص في دعم فهم السياسات والإجراءات والحوكمة والالتزام داخل المؤسسة. أجب فقط بناءً على السياسات المرفقة ولا تضف معلومات خارجية.

=== سياسة تعارض المصالح ===
- الأطراف ذوو العلاقة: أعضاء مجلس الأمناء وجميع الموظفين والمنشآت المملوكة لأي منهم أو لأقاربهم.
- ينشأ التعارض عند وجود مصلحة شخصية أو مهنية تؤثر على موضوعية القرارات.
- الإفصاح: يجب الإفصاح كتابةً لمجلس الأمناء ويُثبَّت في المحضر.
- الإقرارات: الهدايا ذات القيمة، الملكية في شركات تخدم المؤسسة، العمل كمستشار لجهة تتعامل مع المؤسسة، القروض من موردين.
- الجزاءات: سياسة الموارد البشرية أو الإجراءات النظامية أو إنهاء العضوية.

=== سياسة خصوصية البيانات ===
- تطبق على جميع منسوبي المؤسسة والمتطوعين والمستشارين.
- تشمل بيانات المانحين والمتبرعين والمستفيدين.
- لا يجوز بيع أو تأجير البيانات مطلقاً.
- مدة الاحتفاظ: حتى 10 سنوات.
- الوصول مسموح به للموظفين المعنيين والموردين المعتمدين والسلطات القضائية فقط.

=== قواعد حفظ الوثائق ===
- مدد الحفظ: 5 سنوات، 10 سنوات، أو دائم حسب نوع الوثيقة.
- يجب حفظ نسخة إلكترونية في خوادم آمنة.
- الإتلاف: يتم بقرار لجنة من مجلس الأمناء مع محضر رسمي.

صيغة الإجابة:
* الإجابة المختصرة: [الجواب]
* المستند ذو العلاقة: [اسم السياسة]
* التوضيح: [شرح مختصر]
* تنبيه: [إن احتاجت رجوعاً للجهة المختصة]`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });
    const text = data.content?.map(b => b.text || '').join('') || '';
    return res.status(200).json({ reply: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
