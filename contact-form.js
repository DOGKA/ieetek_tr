// İletişim Formu JavaScript
(function() {
  // Sayfa yüklendiğinde çalış
  document.addEventListener('DOMContentLoaded', function() {
    // Tüm contact formları bul
    const contactForms = document.querySelectorAll('form[action*="contact"], .wpcf7-form, form.contact-form');
    
    contactForms.forEach(function(form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Form verilerini topla
        const formData = new FormData(form);
        const data = {
          name: formData.get('your-name') || formData.get('name') || '',
          email: formData.get('your-email') || formData.get('email') || '',
          phone: formData.get('your-phone') || formData.get('phone') || '',
          message: formData.get('your-message') || formData.get('message') || ''
        };
        
        // Buton durumu
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent || submitBtn.value : '';
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Gönderiliyor...';
          submitBtn.style.opacity = '0.6';
        }
        
        try {
          // PHP API'ye gönder
          const response = await fetch('/contact.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });
          
          const result = await response.json();
          
          if (response.ok && result.success) {
            // Başarılı mesaj göster
            showMessage(form, 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
            form.reset();
          } else {
            // Hata mesajı göster
            showMessage(form, result.error || 'Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
          }
        } catch (error) {
          console.error('Form gönderim hatası:', error);
          showMessage(form, 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.', 'error');
        } finally {
          // Buton durumunu geri al
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
          }
        }
      });
    });
  });
  
  // Mesaj gösterme fonksiyonu
  function showMessage(form, message, type) {
    // Eski mesajları temizle
    const oldMessages = form.querySelectorAll('.form-message');
    oldMessages.forEach(msg => msg.remove());
    
    // Yeni mesaj oluştur
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message form-message-' + type;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      padding: 15px 20px;
      margin: 15px 0;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease-in-out;
      ${type === 'success' 
        ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
        : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;
    
    // Formu önüne ekle
    form.insertBefore(messageDiv, form.firstChild);
    
    // 5 saniye sonra kaldır
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }
})();

