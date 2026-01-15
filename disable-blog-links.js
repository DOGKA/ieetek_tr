// Blog kartlarındaki linkleri tamamen kaldır - JavaScript ile
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        
        // #post-list içindeki tüm linkleri bul ve devre dışı bırak
        const postList = document.getElementById('post-list');
        if (postList) {
            const blogLinks = postList.querySelectorAll('.box-blog-post a');
            
            blogLinks.forEach(function(link) {
                // Click event'ini engelle
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
                
                // href'i kaldır
                link.removeAttribute('href');
                
                // Style ekle
                link.style.cursor = 'default';
                link.style.pointerEvents = 'none';
                link.style.textDecoration = 'none';
                link.style.color = 'inherit';
            });
            
            console.log('✅ Blog linkleri devre dışı bırakıldı:', blogLinks.length);
        }
        
        // Ana sayfadaki slider blog kartları
        const sliders = document.querySelectorAll('.row-slider .box-blog-post a, .slider .box-blog-post a');
        sliders.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            link.removeAttribute('href');
            link.style.cursor = 'default';
            link.style.pointerEvents = 'none';
        });
        
        if (sliders.length > 0) {
            console.log('✅ Slider blog linkleri devre dışı bırakıldı:', sliders.length);
        }
    });
})();

