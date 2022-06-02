let OBJ = {};
(function($) {
    /************************************************************
     * Predefined letiables
     *************************************************************/

    let $window = $(window),
        $document = $(document),
        $html = $('html'),
        $body = $('body');

    /**
     * exists
     * @return true
     */
    $.fn.exists = function() {
        return this.length > 0;
    };

    /**
     * isMobile - Check mobile screen
     * @return void
     */
    $.fn.isMobile = function() {
        let screen = $window.outerWidth();
        return !!(screen < 601);
    };

    /**
     * @return void
     */
    OBJ.uaSetting = function() {
        let _ua = (function(u) {
            return {
                Tablet: (u.indexOf('windows') !== -1 && u.indexOf('touch') !== -1 && u.indexOf('tablet pc') === -1) ||
                    u.indexOf('ipad') !== -1 ||
                    (u.indexOf('android') !== -1 && u.indexOf('mobile') === -1) ||
                    (u.indexOf('firefox') !== -1 && u.indexOf('tablet') !== -1) ||
                    u.indexOf('kindle') !== -1 ||
                    u.indexOf('silk') !== -1 ||
                    u.indexOf('playbook') !== -1,
                Mobile: (u.indexOf('windows') !== -1 && u.indexOf('phone') !== -1) ||
                    u.indexOf('iphone') !== -1 ||
                    u.indexOf('ipod') !== -1 ||
                    (u.indexOf('android') !== -1 && u.indexOf('mobile') !== -1) ||
                    (u.indexOf('firefox') !== -1 && u.indexOf('mobile') !== -1) ||
                    u.indexOf('blackberry') !== -1,
            }
        })(window.navigator.userAgent.toLowerCase());
        if (_ua.Tablet || _ua.Mobile) {
            $body.addClass('sp');
        }
    }


    /**
     *  open or close menu in mobile
     */
    OBJ.menumobile = function(obj) {
        let btn_menumobile = $(obj);
        btn_menumobile.on('click', function() {
            $(this).toggleClass('open');
            $('html').toggleClass('openMenu');
        })
    }

    /**
     *  custom for browser
     */
    OBJ.fixBrowser = function() {
        var ua = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i),
            browser;
        if (navigator.userAgent.match(/Edge/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
            browser = "msie";
        } else {
            browser = ua[1].toLowerCase();
        }
        $html.addClass(browser);
    }

    OBJ.imgObjectFitIE = function(elem) {
        let userAgent, ieReg, ie;
        userAgent = window.navigator.userAgent;
        ieReg = /msie|Trident.*rv[ :]*11\./gi;
        ie = ieReg.test(userAgent);

        if (ie) {
            $(elem).each(function() {
                let $container = $(this),
                    imgUrl = $container.find("img").prop("src");
                $container.find("img").hide();
                if (imgUrl) {
                    $container.css({ "background": 'url(' + imgUrl + ') no-repeat center / cover;' }).addClass("custom-object-fit");
                }
            });
        }
    }


    /**
     *  call function
     */
    $document.ready(function() {
        OBJ.menumobile('.c-btn__menu--mobile');
    })

})(jQuery);