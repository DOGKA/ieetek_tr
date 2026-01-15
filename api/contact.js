// IEETek Turkey - İletişim Formu API (Node.js Serverless Function)
// Vercel Edge Function

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };

  // OPTIONS request (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Sadece POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const data = await request.json();

    // Form verilerini al
    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const phone = (data.phone || '').trim();
    const message = (data.message || '').trim();

    // Validasyon
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Ad, email ve mesaj alanları zorunludur' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Email validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Geçerli bir email adresi giriniz' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Resend API ile mail gönder
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Mail servisi yapılandırılmamış' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    // HTML email içeriği
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        .header { color: #2bb826; border-bottom: 2px solid #2bb826; padding-bottom: 10px; margin-bottom: 20px; }
        .info-box { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .message-box { background-color: #fff; padding: 15px; border-left: 4px solid #2bb826; margin: 15px 0; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="header">🔔 Yeni İletişim Formu Mesajı</h2>
        
        <div class="info-box">
            <p><strong>👤 Ad Soyad:</strong> ${escapeHtml(name)}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            ${phone ? `<p><strong>📱 Telefon:</strong> ${escapeHtml(phone)}</p>` : ''}
        </div>
        
        <div class="message-box">
            <h3>💬 Mesaj:</h3>
            <p style="white-space: pre-wrap;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        </div>
        
        <div class="footer">
            <p>Bu mesaj <strong>ieetekturkey.com</strong> iletişim formundan gönderilmiştir.</p>
            <p>Gönderim zamanı: ${now}</p>
        </div>
    </div>
</body>
</html>`;

    // Resend API çağrısı
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'IEETek Turkey <onboarding@resend.dev>', // Doğrulanmış domain sonrası: noreply@ieetekturkey.com
        to: ['fusionmarktofficial@gmail.com'],
        reply_to: email,
        subject: `IEETek Turkey - Yeni İletişim: ${name}`,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Resend API Error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Mail gönderilemedi. Lütfen tekrar deneyin.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mesajınız başarıyla gönderildi!'
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// HTML escape fonksiyonu
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

