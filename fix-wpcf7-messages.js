// WordPress Contact Form 7 mesajlarını Türkçe yap
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // WPCF7 mesajlarını override et
        document.addEventListener('wpcf7mailsent', function(event) {
            // Başarı mesajını Türkçe yap
            const responseOutput = event.target.querySelector('.wpcf7-response-output');
            if (responseOutput) {
                responseOutput.innerHTML = 'Mesajınız gönderildi. Teşekkür ederiz.';
            }
        });
        
        // Sayfa yüklendiğinde mevcut mesajları çevir
        setTimeout(function() {
            document.querySelectorAll('.wpcf7-response-output, .wpcf7-mail-sent-ok').forEach(function(el) {
                if (el.textContent.includes('Thank you')) {
                    el.textContent = 'Mesajınız gönderildi. Teşekkür ederiz.';
                }
            });
            
            // Form başlıklarını çevir
            document.querySelectorAll('.cf7-title, h2, h3').forEach(function(el) {
                if (el.textContent.includes('We will answer')) {
                    el.textContent = 'E-postanıza kısa sürede yanıt vereceğiz!';
                }
            });
        }, 100);
    });
})();

