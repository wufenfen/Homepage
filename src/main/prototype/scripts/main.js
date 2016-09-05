$(document).ready(function() {
    var cover = $('#cover');
    var content = ['cover', 'about', 'services', 'portfolio', 'skills', 'resume', 'testimonials', 'contact'];
    var $content = [];
    $(content).each(function(i, item) {
        $content[i] = $('#' + item);
    });

    var navBar = $('#nav');
    var navBarHeight = navBar.height();

    function fixNavBar() {
        //fixed the bug when navbar change from static to fixed
        var height = navBar.css('position') == 'fixed' ? 0 : navBarHeight;
        if ($(window).scrollTop() > cover.height() + height) {
            navBar.addClass('navFixed');
            $('#blank').css('display', 'block'); //make the about region the same value
        } else {
            navBar.removeClass('navFixed');
            $('#blank').css('display', 'none');
        }
    }

    function isHighlight(start, end, target) {
        var select = 'a[href="#' + target + '"]';
        //hightlight only when the element is static
        var isAnimating = $("html, body").is(':animated');
        if (isAnimating) {
            $(select).removeClass('hover');
            return;
        }

        if ($(window).scrollTop() >= start.offset().top + start.height() && $(window).scrollTop() < end.offset().top + end.height()) {
            $(select).addClass('hover');
        } else {
            $(select).removeClass('hover');
        }
    }

    function highlightNar() {
        for (var i = 0; i < $content.length - 1; i++) {
            isHighlight($content[i], $content[i + 1], content[i + 1]);
        };
    }


    fixNavBar();

    $(window).scroll(function() {
        fixNavBar();
        highlightNar();
    })

    $('.m-nav, .m-cover').click(function(e) {
        var href = e.target.href;
        if (href) {
            var id = href.split('#')[1];
            var target = $('#' + id);
            console.log(target.offset().top - navBarHeight);
            $('html, body').stop().animate({
                'scrollTop': target.offset().top - navBarHeight
            }, 500, 'linear');
        }
        highlightNar();
    })

    //portfolio: Isotope images
    // init Isotope
    var $Pics = $('.m-portPics').isotope({
        transitionDuration: '0.8s',
        social_tools:''
    });
    // filter items on click
    $('.j-filter-group').click (function(e) {
        $('.j-filter-group .hover').removeClass('hover');

        var filterValue = $(e.target).attr('data-filter');
        $Pics.isotope({ filter: filterValue });
        $(e.target).addClass('hover');
    });

    //portfolio: prettyPhoto
    $(".u-images a[rel^='prettyPhoto']").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000, autoplay_slideshow: true });

    //skills: easy pie chart 
    $('.u-chart').easyPieChart({
        easing: 'easeOutElastic',
        delay: 3000,
        barColor: '#2c3e50',
        trackColor: '#fff',
        scaleColor: false,
        lineWidth: 10,
        trackWidth: 10,
        lineCap: 'square',
        size: 150 ,
        onStep: function(from, to, percent) {
                this.el.children[0].innerHTML = Math.round(percent) + '%';
            }
    });
})
