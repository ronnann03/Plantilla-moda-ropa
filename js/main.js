
(function ($) {
    "use strict";

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div class="loader05"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*==================================================================
    [ Fixed Header ]*/
    var headerDesktop = $('.container-menu-desktop');
    var wrapMenu = $('.wrap-menu-desktop');

    if($('.top-bar').length > 0) {
        var posWrapHeader = $('.top-bar').height();
    }
    else {
        var posWrapHeader = 0;
    }
    

    // El topbar es fixed en top:0; el navbar siempre queda debajo (top: posWrapHeader)
    if($(window).scrollTop() > posWrapHeader) {
        $(headerDesktop).addClass('fix-menu-desktop');
        $(wrapMenu).css('top', posWrapHeader);
    }
    else {
        $(headerDesktop).removeClass('fix-menu-desktop');
        $(wrapMenu).css('top', posWrapHeader);
    }

    $(window).on('scroll', function(){
        if($(this).scrollTop() > posWrapHeader) {
            $(headerDesktop).addClass('fix-menu-desktop');
            $(wrapMenu).css('top', posWrapHeader);
        }
        else {
            $(headerDesktop).removeClass('fix-menu-desktop');
            $(wrapMenu).css('top', posWrapHeader);
        }
    });


    /*==================================================================
    [ Menu mobile ]*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu-m');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu-m').slideToggle();
            $(this).toggleClass('turn-arrow-main-menu-m');
        })
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.menu-mobile').css('display') == 'block') {
                $('.menu-mobile').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }

            $('.sub-menu-m').each(function(){
                if($(this).css('display') == 'block') { console.log('hello');
                    $(this).css('display','none');
                    $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
                }
            });
                
        }
    });


    /*==================================================================
    [ Show / hide modal search ]*/
    $('.js-show-modal-search').on('click', function(){
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity','0');
    });

    $('.js-hide-modal-search').on('click', function(){
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity','1');
    });

    $('.container-search-header').on('click', function(e){
        e.stopPropagation();
    });


    /*==================================================================
    [ Isotope ]*/
    var $topeContainer = $('.isotope-grid');
    var $filter = $('.filter-tope-group');
    var currentFilter = '*';
    var searchQuery = '';
    var priceMin = null;
    var priceMax = null;
    var sortBy = 'original-order';
    var sortAscending = true;

    function parsePriceFromText(text) {
        var match = String(text || '').replace(',', '.').match(/(\d+(?:\.\d+)?)/g);
        if (!match || match.length === 0) return null;
        return Number(match[0]);
    }

    function parsePriceRangeFromText(text) {
        var matches = String(text || '').replace(',', '.').match(/(\d+(?:\.\d+)?)/g);
        if (!matches || matches.length === 0) return { min: null, max: null };
        if (matches.length === 1) return { min: Number(matches[0]), max: null };
        return { min: Number(matches[0]), max: Number(matches[1]) };
    }

    function applyIsotope() {
        $topeContainer.isotope({
            filter: function() {
                var $item = $(this);
                var matchesCategory = currentFilter === '*' ? true : $item.is(currentFilter);
                if (!matchesCategory) return false;

                var q = String(searchQuery || '').trim().toLowerCase();
                if (q) {
                    var name = $item.find('.js-name-b2').text().trim().toLowerCase();
                    if (name.indexOf(q) === -1) return false;
                }

                if (priceMin !== null || priceMax !== null) {
                    var priceText = $item.find('.stext-105').first().text();
                    var price = parsePriceFromText(priceText);
                    if (price === null) return false;
                    if (priceMin !== null && price < priceMin) return false;
                    if (priceMax !== null && price > priceMax) return false;
                }

                return true;
            },
            sortBy: sortBy,
            sortAscending: sortAscending
        });
    }

    // filter items on button click
    $filter.each(function () {
        $filter.on('click', 'button', function () {
            currentFilter = $(this).attr('data-filter') || '*';
            applyIsotope();
        });
        
    });

    // init Isotope
    $(window).on('load', function () {
        $topeContainer.each(function () {
            $(this).isotope({
                itemSelector: '.isotope-item',
                layoutMode: 'fitRows',
                percentPosition: true,
                animationEngine : 'best-available',
                getSortData: {
                    price: function (itemElem) {
                        var priceText = $(itemElem).find('.stext-105').first().text();
                        var price = parsePriceFromText(priceText);
                        return price === null ? 0 : price;
                    },
                    name: function (itemElem) {
                        return $(itemElem).find('.js-name-b2').text().trim().toLowerCase();
                    }
                }
            });
        });
        applyIsotope();
    });

    var isotopeButton = $('.filter-tope-group button');

    $(isotopeButton).each(function(){
        $(this).on('click', function(){
            for(var i=0; i<isotopeButton.length; i++) {
                $(isotopeButton[i]).removeClass('how-active1');
            }

            $(this).addClass('how-active1');
        });
    });

    $('.panel-search input[name="search-product"]').on('input', function() {
        searchQuery = $(this).val();
        applyIsotope();
    });

    $(document).on('click', '.panel-filter .filter-link', function(e) {
        e.preventDefault();
        var $link = $(this);
        var text = $link.text().trim().toLowerCase();

        if (text.indexOf('precio: menor a mayor') !== -1) {
            sortBy = 'price';
            sortAscending = true;
        } else if (text.indexOf('precio: mayor a menor') !== -1) {
            sortBy = 'price';
            sortAscending = false;
        } else if (text === 'predeterminado' || text === 'popularidad' || text === 'calificación promedio' || text === 'novedades') {
            sortBy = 'original-order';
            sortAscending = true;
        } else if (text === 'todo') {
            priceMin = null;
            priceMax = null;
        } else if (text.indexOf('+') !== -1 || text.indexOf('-') !== -1) {
            var range = parsePriceRangeFromText(text);
            priceMin = range.min;
            priceMax = range.max;
        }

        $link.closest('ul').find('.filter-link').removeClass('filter-link-active');
        $link.addClass('filter-link-active');
        applyIsotope();
    });

    $(document).on('click', '[data-isotope-filter]', function(e) {
        e.preventDefault();
        var filterValue = $(this).attr('data-isotope-filter') || '*';
        currentFilter = filterValue;

        isotopeButton.removeClass('how-active1');
        $filter.find('button[data-filter="' + filterValue + '"]').addClass('how-active1');
        applyIsotope();

        var productsEl = document.getElementById('productos');
        if (productsEl && productsEl.scrollIntoView) productsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $(document).on('click', 'a.js-show-cart, a.js-show-modal-search, a.js-show-modal1, a.js-addwish-b2, a.js-addwish-detail, a.js-noop', function(e) {
        e.preventDefault();
    });

    /*==================================================================
    [ Filter / Search product ]*/
    $('.js-show-filter').on('click',function(){
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);

        if($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search');
            $('.panel-search').slideUp(400);
        }    
    });

    $('.js-show-search').on('click',function(){
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);

        if($('.js-show-filter').hasClass('show-filter')) {
            $('.js-show-filter').removeClass('show-filter');
            $('.panel-filter').slideUp(400);
        }    
    });




    /*==================================================================
    [ Cart ]*/
    $('.js-show-cart').on('click',function(){
        $('.js-panel-cart').addClass('show-header-cart');
    });

    $('.js-hide-cart').on('click',function(){
        $('.js-panel-cart').removeClass('show-header-cart');
    });

    /*==================================================================
    [ Cart ]*/
    $('.js-show-sidebar').on('click',function(){
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click',function(){
        $('.js-sidebar').removeClass('show-sidebar');
    });

    /*==================================================================
    [ +/- num product ]*/
    $('.btn-num-product-down').on('click', function(){
        var numProduct = Number($(this).next().val());
        if(numProduct > 0) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(){
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });

    /*==================================================================
    [ Rating ]*/
    $('.wrap-rating').each(function(){
        var item = $(this).find('.item-rating');
        var rated = -1;
        var input = $(this).find('input');
        $(input).val(0);

        $(item).on('mouseenter', function(){
            var index = item.index(this);
            var i = 0;
            for(i=0; i<=index; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });

        $(item).on('click', function(){
            var index = item.index(this);
            rated = index;
            $(input).val(index+1);
        });

        $(this).on('mouseleave', function(){
            var i = 0;
            for(i=0; i<=rated; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });
    });
    
    /*==================================================================
    [ Show modal1 — inyecta imagen, nombre y precio de la card clickeada ]*/
    $('.js-show-modal1').on('click', function(e) {
        e.preventDefault();

        var $card  = $(this).closest('.block2');
        var imgSrc = $card.find('.block2-pic img').first().attr('src') || '';
        var name   = $card.find('.js-name-b2').text().trim();
        var price  = $card.find('.stext-105').text().trim();

        // Inyectar datos en el modal
        $('#modal1-img').attr('src', imgSrc).attr('alt', name);
        $('.js-name-detail').text(name);
        $('.js-price-detail').text(price);

        $('.js-modal1').addClass('show-modal1');
    });

    $('.js-hide-modal1').on('click', function() {
        $('.js-modal1').removeClass('show-modal1');
    });

    var applyLocale = function() {
        var textReplacements = [
            { from: /\bFree shipping for standard order over\b/g, to: 'Envío gratis por compras mayores a' },
            { from: /\bYour Cart\b/g, to: 'Tu carrito' },
            { from: /\bView Cart\b/g, to: 'Ver carrito' },
            { from: /\bCheck Out\b/g, to: 'Finalizar compra' },
            { from: /\bAdd to cart\b/g, to: 'Agregar al carrito' },
            { from: /\bQuick View\b/g, to: 'Vista rápida' },
            { from: /\bLoad More\b/g, to: 'Cargar más' },
            { from: /\bShop Now\b/g, to: 'Comprar ahora' },
            { from: /\bNEW SEASON\b/g, to: 'NUEVA TEMPORADA' },
            { from: /\bNew arrivals\b/g, to: 'Nuevos ingresos' },
            { from: /\bAll Products\b/g, to: 'Todos' },
            { from: /\bProduct Overview\b/g, to: 'Catálogo de productos' },
            { from: /\bCategories\b/g, to: 'Categorías' },
            { from: /\bGET IN TOUCH\b/g, to: 'Contacto' },
            { from: /\bHelp & FAQs\b/g, to: 'Ayuda y FAQ' },
            { from: /\bMy Account\b/g, to: 'Mi cuenta' },
            { from: /\bTrack Order\b/g, to: 'Seguir pedido' },
            { from: /\bReturns\b/g, to: 'Devoluciones' },
            { from: /\bShipping\b/g, to: 'Envíos' },
            { from: /\bFAQs\b/g, to: 'Preguntas frecuentes' },
            { from: /\bContinue Reading\b/g, to: 'Seguir leyendo' },
            { from: /\bShoping Cart\b/g, to: 'Carrito' },
            { from: /\bProduct Detail\b/g, to: 'Detalle del producto' },
            { from: /\bBlog Detail\b/g, to: 'Detalle del blog' },
            { from: /\bProduct\b/g, to: 'Producto' },
            { from: /\bHome\b/g, to: 'Inicio' },
            { from: /\bHomepage\b/g, to: 'Inicio' },
            { from: /\bShop\b/g, to: 'Tienda' },
            { from: /\bFeatures\b/g, to: 'Carrito' },
            { from: /\bAbout\b/g, to: 'Nosotros' },
            { from: /\bContact\b/g, to: 'Contacto' },
            { from: /\bWomen\b/g, to: 'Mujer' },
            { from: /\bMen\b/g, to: 'Hombre' },
            { from: /\bAccessories\b/g, to: 'Accesorios' },
            { from: /\bShoes\b/g, to: 'Calzado' },
            { from: /\bWatches\b/g, to: 'Relojes' },
            { from: /\bBag\b/g, to: 'Bolsos' },
            { from: /\bSearch\.\.\.\b/g, to: 'Buscar...' },
            { from: /\bSearch\b/g, to: 'Buscar' },
            { from: /\bFilter\b/g, to: 'Filtrar' },
            { from: /\bSort By\b/g, to: 'Ordenar por' },
            { from: /\bDefault\b/g, to: 'Predeterminado' },
            { from: /\bPopularity\b/g, to: 'Popularidad' },
            { from: /\bAverage rating\b/g, to: 'Calificación promedio' },
            { from: /\bNewness\b/g, to: 'Novedades' },
            { from: /\bPrice: Low to High\b/g, to: 'Precio: menor a mayor' },
            { from: /\bPrice: High to Low\b/g, to: 'Precio: mayor a menor' },
            { from: /\bPrice\b/g, to: 'Precio' },
            { from: /\bColor\b/g, to: 'Color' },
            { from: /\bBlack\b/g, to: 'Negro' },
            { from: /\bWhite\b/g, to: 'Blanco' },
            { from: /\bGrey\b/g, to: 'Gris' },
            { from: /\bBlue\b/g, to: 'Azul' },
            { from: /\bRed\b/g, to: 'Rojo' },
            { from: /\bAll rights reserved\b/g, to: 'Todos los derechos reservados' },
            { from: /\bMade with\b/g, to: 'Hecho con' },
            { from: /\bdistributed by\b/g, to: 'distribuido por' }
        ];

        var replaceText = function(text) {
            var result = text;
            result = result.replace(/\bUSD\b/g, 'PEN');
            result = result.replace(/\bEN\b/g, 'ES');
            result = result.replace(/\$\s*(\d)/g, 'S/ $1');
            for (var i = 0; i < textReplacements.length; i++) {
                result = result.replace(textReplacements[i].from, textReplacements[i].to);
            }
            return result;
        };

        if (typeof document !== 'undefined' && document.body && document.createTreeWalker) {
            var walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
                        if (!/\S/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
                        var parent = node.parentNode;
                        if (!parent) return NodeFilter.FILTER_REJECT;
                        var tag = parent.nodeName;
                        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            var n;
            while ((n = walker.nextNode())) {
                var updated = replaceText(n.nodeValue);
                if (updated !== n.nodeValue) n.nodeValue = updated;
            }
        }

        $('input[placeholder], textarea[placeholder]').each(function(){
            var $el = $(this);
            var ph = $el.attr('placeholder');
            if (!ph) return;
            var next = replaceText(ph);
            if (next !== ph) $el.attr('placeholder', next);
        });
    };

    $(function() {
        applyLocale();

        var setupReveal = function() {
            var $els = $('[data-reveal]');
            if ($els.length === 0) return;

            $els.each(function() {
                var delay = $(this).attr('data-delay');
                if (delay !== undefined && delay !== null && delay !== '') {
                    this.style.transitionDelay = String(delay) + 'ms';
                }
            });

            if (!('IntersectionObserver' in window)) {
                $els.addClass('is-visible');
                return;
            }

            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

            $els.each(function() { observer.observe(this); });
        };

        var setupCounters = function() {
            var $counters = $('.about-counter[data-count]');
            if ($counters.length === 0) return;

            var animateCounter = function(el) {
                if (el.dataset && el.dataset.animated === 'true') return;
                if (el.dataset) el.dataset.animated = 'true';

                var target = Number(el.getAttribute('data-count') || '0');
                var suffix = el.getAttribute('data-suffix') || '';
                var duration = 1200;
                var start = null;

                var tick = function(ts) {
                    if (!start) start = ts;
                    var p = Math.min((ts - start) / duration, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    var value = Math.round(target * eased);
                    el.textContent = value.toLocaleString('es-PE') + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                };

                requestAnimationFrame(tick);
            };

            if (!('IntersectionObserver' in window)) {
                $counters.each(function() { animateCounter(this); });
                return;
            }

            var counterObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (!entry.isIntersecting) return;
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                });
            }, { threshold: 0.2 });

            $counters.each(function() { counterObserver.observe(this); });
        };

        setupReveal();
        setupCounters();

        /* Contact form */
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            var $form = $(this);
            var $msg  = $form.find('.contact-form-msg');
            var name  = $form.find('[name="name"]').val().trim();
            var email = $form.find('[name="email"]').val().trim();
            var message = $form.find('[name="message"]').val().trim();

            if (!name || !email || !message) {
                $msg.removeClass('success').addClass('error')
                    .text('Por favor completá los campos obligatorios (*).')
                    .show();
                return;
            }

            var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(email)) {
                $msg.removeClass('success').addClass('error')
                    .text('Ingresá un correo válido.')
                    .show();
                return;
            }

            $msg.removeClass('error').addClass('success')
                .text('¡Mensaje enviado! Te responderemos pronto.')
                .show();
            $form[0].reset();
        });
    });



    /* ================================================================
       CARRITO FUNCIONAL + WISHLIST + TOAST
       ================================================================ */
    var CART_KEY = 'coza_cart';
    var WISH_KEY = 'coza_wish';

    /* --- localStorage helpers --- */
    function getCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch(e) { return []; }
    }
    function getWish() {
        try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); } catch(e) { return []; }
    }
    function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); }
    function saveWish(w) { localStorage.setItem(WISH_KEY, JSON.stringify(w)); }

    /* --- actualizar badge del carrito --- */
    function updateCartBadge() {
        var total = getCart().reduce(function(s, i) { return s + i.qty; }, 0);
        $('.js-show-cart').attr('data-notify', total > 0 ? total : '0');
    }

    /* --- actualizar badge de favoritos --- */
    function updateWishBadge() {
        var count = getWish().length;
        $('.icon-header-noti').not('.js-show-cart').attr('data-notify', count > 0 ? count : '0');
    }

    /* --- sistema de toasts --- */
    function showToast(msg, type) {
        if ($('#coza-toasts').length === 0) {
            $('body').append('<div id="coza-toasts"></div>');
        }
        var $t = $('<div class="coza-toast">' + (type === 'wish' ? '❤️' : '🛒') + ' ' + msg + '</div>');
        $('#coza-toasts').append($t);
        setTimeout(function() { $t.addClass('coza-toast--show'); }, 20);
        setTimeout(function() {
            $t.removeClass('coza-toast--show');
            setTimeout(function() { $t.remove(); }, 400);
        }, 3200);
    }

    /* --- renderizar panel del carrito --- */
    function renderCart() {
        var cart = getCart();
        var $list  = $('#cart-items-list');
        var $empty = $('#cart-empty-msg');
        var $total = $('#cart-total-text');
        $list.empty();

        if (cart.length === 0) {
            $empty.show();
            $total.text('S/ 0.00');
            updateCartBadge();
            return;
        }
        $empty.hide();

        var total = 0;
        $.each(cart, function(_, item) {
            total += item.price * item.qty;
            $list.append(
                '<li class="header-cart-item flex-w flex-t m-b-12" data-id="' + item.id + '">' +
                    '<div class="header-cart-item-img">' +
                        '<img src="' + item.img + '" alt="' + item.name + '">' +
                    '</div>' +
                    '<div class="header-cart-item-txt p-t-8">' +
                        '<a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">' + item.name + '</a>' +
                        '<span class="header-cart-item-info">' + item.qty + ' x S/ ' + item.price.toFixed(2) + '</span>' +
                    '</div>' +
                    '<button class="cart-item-remove js-remove-cart-item" data-id="' + item.id + '" title="Eliminar">×</button>' +
                '</li>'
            );
        });

        $total.text('S/ ' + total.toFixed(2));
        updateCartBadge();
    }

    /* --- añadir producto al carrito --- */
    function addToCart(img, name, priceStr, qty) {
        var price = parseFloat(String(priceStr).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
        var id = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
        var cart = getCart();
        var found = false;
        $.each(cart, function(_, item) {
            if (item.id === id) { item.qty += qty; found = true; return false; }
        });
        if (!found) { cart.push({ id: id, img: img, name: name, price: price, qty: qty }); }
        saveCart(cart);
        renderCart();
        showToast('"' + name + '" agregado al carrito', 'cart');
        $('.js-panel-cart').addClass('show-header-cart');
    }

    /* --- toggle favorito --- */
    function toggleWish($btn, img, name) {
        var id = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
        var wish = getWish();
        var idx = -1;
        $.each(wish, function(i, w) { if (w.id === id) { idx = i; return false; } });

        if (idx === -1) {
            wish.push({ id: id, img: img, name: name });
            saveWish(wish);
            if ($btn && $btn.length) $btn.addClass('is-wishlisted');
            showToast('"' + name + '" guardado en favoritos', 'wish');
        } else {
            wish.splice(idx, 1);
            saveWish(wish);
            if ($btn && $btn.length) $btn.removeClass('is-wishlisted');
            showToast('"' + name + '" eliminado de favoritos', 'wish');
        }
        updateWishBadge();
    }

    /* --- restaurar estado de wishlist al cargar --- */
    function initWishlistState() {
        var wish = getWish();
        if (wish.length === 0) return;
        var ids = wish.map(function(w) { return w.id; });
        $('.js-addwish-b2').each(function() {
            var name = $(this).closest('.block2').find('.js-name-b2').text().trim();
            var id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
            if (ids.indexOf(id) !== -1) $(this).addClass('is-wishlisted');
        });
    }

    /* --- EVENTOS --- */

    // Agregar al carrito desde el modal
    $(document).on('click', '.js-addcart-detail', function(e) {
        e.preventDefault();
        var img   = $('#modal1-img').attr('src') || '';
        var name  = $('.js-name-detail').text().trim();
        var price = $('.js-price-detail').text().trim();
        var qty   = parseInt($('.num-product').val(), 10) || 1;
        if (!name) return;
        addToCart(img, name, price, qty);
    });

    // Eliminar ítem del carrito
    $(document).on('click', '.js-remove-cart-item', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var id = String($(this).data('id'));
        var cart = getCart().filter(function(i) { return i.id !== id; });
        saveCart(cart);
        renderCart();
    });

    // Wishlist en cards del catálogo
    $(document).on('click', '.js-addwish-b2', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $card = $(this).closest('.block2');
        var img   = $card.find('.block2-pic img').first().attr('src') || '';
        var name  = $card.find('.js-name-b2').text().trim();
        toggleWish($(this), img, name);
    });

    // Wishlist desde el modal de detalle
    $(document).on('click', '.js-addwish-detail', function(e) {
        e.preventDefault();
        var img  = $('#modal1-img').attr('src') || '';
        var name = $('.js-name-detail').text().trim();
        if (!name) return;
        // Sincronizar corazón con la card correspondiente
        var $cardBtn = null;
        $('.js-name-b2').each(function() {
            if ($(this).text().trim() === name) {
                $cardBtn = $(this).closest('.block2').find('.js-addwish-b2');
                return false;
            }
        });
        toggleWish($cardBtn, img, name);
    });

    /* --- INIT --- */
    $(function() {
        if ($('#coza-toasts').length === 0) {
            $('body').append('<div id="coza-toasts"></div>');
        }
        renderCart();
        initWishlistState();
    });

})(jQuery);
