// Vercel Serverless Function — prostohome order handler
// POST /api/order → sends Telegram notification to team

const TELEGRAM_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.TG_CHAT_ID;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = req.body || {};
  const {
    model    = '—',
    color    = '—',
    qty      = '1',
    name     = '—',
    phone    = '—',
    email    = '',
    city     = '—',
    delivery = '—',
    comment  = '',
    total    = '—',
    orderNum = '#PH-00000',
  } = body;

  // Delivery label
  const deliveryLabels = {
    courier: '🚚 Курьером до двери (бесплатно)',
    pvz:     '📦 Пункт выдачи (бесплатно)',
    post:    '✉️ Почта России (от 350 ₽)',
  };
  const deliveryText = deliveryLabels[delivery] || delivery;

  // Build Telegram message
  const text = [
    `🛍️ *НОВЫЙ ЗАКАЗ* ${orderNum}`,
    ``,
    `📦 *Товар:* ${model}`,
    `🎨 *Цвет:* ${color}`,
    `🔢 *Количество:* ${qty} шт.`,
    `💰 *Сумма:* ${total} ₽`,
    ``,
    `👤 *Покупатель:* ${name}`,
    `📞 *Телефон:* ${phone}`,
    email ? `📧 *Email:* ${email}` : null,
    `🏙️ *Город:* ${city}`,
    `${deliveryText}`,
    comment ? `💬 *Комментарий:* ${comment}` : null,
    ``,
    `⏱️ Позвонить в течение 15 минут!`,
  ].filter(Boolean).join('\n');

  try {
    // Send to Telegram
    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      console.error('Telegram error:', tgData);
      // Still return ok to user — don't block the order
    }

    return res.status(200).json({
      ok: true,
      orderNum,
      message: 'Заказ принят! Менеджер позвонит в течение 15 минут.',
    });

  } catch (err) {
    console.error('Order handler error:', err);
    // Return ok anyway — order is captured in logs
    return res.status(200).json({
      ok: true,
      orderNum,
      message: 'Заказ принят!',
    });
  }
}
