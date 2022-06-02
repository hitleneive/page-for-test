(function($) {
    let IGL = {},
        $html = $('html'),
        $document = $(document),
        contactUsFormElement = $('#c-contact__form'),
        confirmSection = $('#c-confirm__section'),
        inputSection = $('#c-input__section'),
        pageContent = $('#stepbystep'),
        btnSubmit = $('#submit_inquiry_02'),
        buttonBack = $('#c-form__button_back'),
        descInput = $('#c-desc-input'),
        descConfirm = $('#c-desc-confirm'),
        form_submitting = false,
        is_dirty = false;

    /**
     * Check element exists
     * @returns {boolean}
     */
    $.fn.exists = function () {
        return this.length > 0;
    };

    /**
     * Scroll to element
     * @param element
     */
    let scrollToPageContent = function(element) {
        if(element.exists()) {
            let offsetDiv = $(element).first().offset().top;

            $('html,body').animate({
                scrollTop: offsetDiv
            }, 'fast');
        }
    };

    /**
     * loadingEffectStart
     * @param element
     */
    let loadingEffectStart = function(element) {
        buttonBack.attr('disabled', 'disabled');

        element.attr('disabled', 'disabled')
            .addClass("c-loader");
    };

    /**
     * loadingEffectStop
     * @param element
     */
    let loadingEffectStop = function(element) {
        element.removeAttr('disabled')
            .removeClass("c-loader").empty().append("送信する");

        buttonBack.removeAttr('disabled');
    };

    /**
     * Data blind
     * @returns {*}
     */
    $.fn.sfbind = function () {
        return this.each(function () {
            let $this = $(this);

            $this.find('[data-sf-bind]').each(function () {
                let fieldName = $(this).data('sf-bind');
                let fieldValue = $this.find('[name="' + fieldName + '"]').val();
                let defaultValue = fieldValue != '' ? fieldValue : '-';

                $this.on('change keyup keydown', '[name="' + fieldName + '"]', function (e) {
                    let value = $(this).val() != '' ? $(this).val() : '-';

                    $this.find('[data-sf-bind="' + fieldName + '"]').text(value);
                });

                // set default
                $this.find('[data-sf-bind="' + fieldName + '"]').text(defaultValue);
            })
        });
    };

    /**
     * setFormSubmitting
     */
    let setFormSubmitting = function () {
        form_submitting = true;
    };

    /**
     * setIsDirty
     */
    let setIsDirty = function() {
        is_dirty = true;
    };

    /**
     * goToStep
     * @param $step
     */
    IGL.goToStep = function($step) {
        let stepElement = $("#stepbystep");

        stepElement.find("li.c-timeline__item").removeClass('c-timeline__item--active');
        stepElement.find("[data-step='" + $step + "']").addClass('c-timeline__item--active');

        if($step==1) {
            $('#title-inquiry').html('入力');
        } else if($step==2) {
            $('#title-inquiry').html('確認');
        } else {
            $('#title-inquiry').html('完了');
        }

    };

    /**
     * alertLeave
     */
    IGL.alertLeave = function() {
        if (!form_submitting) {
            contactUsFormElement.on('keyup', 'textarea', function () {
                setIsDirty();
            });

            contactUsFormElement.on('keyup', 'input[type=text]', function () {
                setIsDirty();
            });

            contactUsFormElement.on('keyup', 'input[type=tel]', function () {
                setIsDirty();
            });

            contactUsFormElement.on('keyup', 'input[type=email]', function () {
                setIsDirty();
            });

            contactUsFormElement.on('change', 'input[type=radio]', function () {
                setIsDirty();
            });

            contactUsFormElement.on('change', 'select', function () {
                setIsDirty();
            });

            window.addEventListener('beforeunload', function (e) {
                var message = 'このページから離れてもよろしいですか?' + '';

                if (form_submitting || !is_dirty) {
                    return undefined;
                }

                (e || window.event).returnValue = message;
                return message;
            });
        }
    };

    /**
     * Contact Us
     */
    IGL.execContactUs = function() {

        if (contactUsFormElement.exists()) {
            // call init
            contactUsFormElement.sfbind();
            confirmSection.hide();
            descConfirm.hide();

            $.validator.addMethod('email', function (value) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
            }, "データは無効です。");

            $.validator.addMethod("haftwidth", function(value, element) {
                let regex = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
                if(regex.test(value)) return false;

                return true;
            }, "データは無効です。");

            // Validate form
            contactUsFormElement.validate({
                ignore: [],
                rules: {
                    name : {
                        required: true
                    },
                    phone: {
                        required: true,
                        number: true,
                        minlength: 10,
                        maxlength: 11
                    },
                    zip_code: {
                        required: false
                    },
                    email: {
                        required: true,
                        email: true,
                        haftwidth: true
                    },
                    jobs : {
                        required: true
                    },
                    work : {
                        required: true
                    },
                    types : {
                        required: true
                    },
                    message: {
                        required: false,
                        maxlength: 1000
                    }
                },
                messages: {
                    name: {
                        required: "「氏名」を入力してください"
                    },
                    phone: {
                        number: "半角英数(ハイフン無し)で「電話番号」を入力してください",
                        minlength: "半角英数(ハイフン無し)で「電話番号」を入力してください",
                        maxlength: "半角英数(ハイフン無し)で「電話番号」を入力してください",
                        required: "半角英数(ハイフン無し)で「電話番号」を入力してください"
                    },
                    email: {
                        required: "半角英数で「メールアドレス」を入力してください",
                        email: "半角英数で「メールアドレス」を入力してください",
                        haftwidth: "半角英数で「メールアドレス」を入力してください"
                    },
                    jobs: {
                        required: "「希望職種」を入力してください"
                    },
                    work: {
                        required: "「勤務地」を入力してください"
                    },
                    types: {
                        required: "「応募内容」を入力してください"
                    },
                    message: {
                        maxlength: "お問い合わせ内容は1000文字を超えてはいけません。"
                    }
                },
                errorPlacement: function (error, element) {
                    error.insertAfter($(element));
                },
                success: function(error, element){
                    error.remove();
                },
                submitHandler: function (form) {
                    let SfAction = $(form).attr('data-sf-action');

                    // handle
                    if(SfAction === 'completed') {
                        let formData = $(form).serializeArray();
                        loadingEffectStart(btnSubmit);

                        $.ajax({
                            type : 'post',
                            dataType : 'json',
                            url : WPObj.ajaxurl,
                            data : formData,
                            context: this,
                            success: function(response) {
                                $('#submit_inquiry_02').removeClass('c-loader');
                                $('#submit_inquiry_02').removeAttr('disabled');
                                if (response.success && response.data.redirect_url) {
                                    setFormSubmitting();
                                    window.location.href = response.data.redirect_url;
                                } else {
                                    loadingEffectStop(btnSubmit);
                                }

                                return false;
                            }
                        });
                    } else {
                        let content = $("textarea[name=message]").val().replace(/\r?\n/g,"<br>");
                        $html.find('[data-sf-bind="message"]').html(content);

                        inputSection.fadeOut(170);
                        confirmSection.fadeIn(170);
                        descConfirm.fadeIn(170);
                        descInput.hide();

                        IGL.goToStep(2);

                        // scroll to page content
                        setTimeout(function() {
                            scrollToPageContent($html);
                        }, 300);

                        // set form action
                        $(form).attr('data-sf-action', 'completed');
                    }

                    return false;
                }
            });
        }
    };

    /**
     * execMask
     */
    IGL.execMask = function() {
        let Zipcode = $("#zip_code");

        if(Zipcode.exists()) {
            Zipcode.mask('000-0000');
        }
    };

    /**
     * Load init
     */
    $document.ready(function () {
        IGL.execContactUs();
        IGL.alertLeave();
        IGL.execMask();

        buttonBack.on('click',function () {
            if($(this).attr('disabled') !== 'disabled') {
                inputSection.fadeIn(170);
                confirmSection.fadeOut(170);
                descInput.fadeIn(170);
                descConfirm.hide();

                // scroll to page content
                scrollToPageContent($html);

                // set form action
                contactUsFormElement.attr('data-sf-action', 'input');
                IGL.goToStep(1);
            }
        });

        $('#c-btn__submit--01').on('click', function(event) {
            event.preventDefault();
            contactUsFormElement.submit();
        });
    });
})(jQuery);