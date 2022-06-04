window.onload = function () {
  const mvSlider = new KeenSlider(
    "#mvSlider",
    {
      loop: true,
      slides: {
        perView: 1,
      },
    },
    [autoSlide, navigation]
  );

  const testimonialsSlider = new KeenSlider(
    "#testimonialsSlider",
    {
      loop: true,
      slides: {
        perView: 3,
      },
      breakpoints: {
        "(max-width: 767px)": {
          slides: {
            perView: 1,
          },
        },
      },
    },
    [autoSlide, navigation]
  );

  var memberSlider = new KeenSlider(
    "#memberSlider",
    {
      loop: true,
      slides: {
        perView: 4,
      },
      breakpoints: {
        "(max-width: 767px)": {
          slides: {
            perView: 1,
          },
        },
      },
    },
    [autoSlide]
  );

  function navigation(slider) {
    let wrapper, dots;

    function markup(remove) {
      wrapperMarkup(remove);
      dotMarkup(remove);
    }

    function removeElement(elment) {
      elment.parentNode.removeChild(elment);
    }
    function createDiv(className) {
      var div = document.createElement("div");
      var classNames = className.split(" ");
      classNames.forEach((name) => div.classList.add(name));
      return div;
    }

    function wrapperMarkup(remove) {
      if (remove) {
        var parent = wrapper.parentNode;
        while (wrapper.firstChild)
          parent.insertBefore(wrapper.firstChild, wrapper);
        removeElement(wrapper);
        return;
      }
      wrapper = createDiv("navigation-wrapper");
      slider.container.parentNode.appendChild(wrapper);
      wrapper.appendChild(slider.container);
    }

    function dotMarkup(remove) {
      if (remove) {
        removeElement(dots);
        return;
      }
      dots = createDiv("dots");
      slider.track.details.slides.forEach((_e, idx) => {
        var dot = createDiv("dot");
        dot.addEventListener("click", () => slider.moveToIdx(idx));
        dots.appendChild(dot);
      });
      wrapper.appendChild(dots);
    }

    function updateClasses() {
      var slide = slider.track.details.rel;
      Array.from(dots.children).forEach(function (dot, idx) {
        idx === slide
          ? dot.classList.add("dot--active")
          : dot.classList.remove("dot--active");
      });
    }

    slider.on("created", () => {
      markup();
      updateClasses();
    });
    slider.on("optionsChanged", () => {
      console.log(2);
      markup(true);
      markup();
      updateClasses();
    });
    slider.on("slideChanged", () => {
      updateClasses();
    });
    slider.on("destroyed", () => {
      markup(true);
    });
  }

  function autoSlide(slider, duration = 3000) {
    let timeout;
    let mouseOver = false;
    function clearNextTimeout() {
      clearTimeout(timeout);
    }
    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;
      timeout = setTimeout(() => {
        slider.next();
      }, duration);
    }
    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  }

  document
    .querySelector(".c-members__slide-right")
    .addEventListener("click", function () {
      memberSlider.next();
    });

  document
    .querySelector(".c-members__slide-left")
    .addEventListener("click", function () {
      memberSlider.prev();
    });

  // dropdown
  document.querySelectorAll(".c-menu__menu-item-name").forEach((element) => {
    element.addEventListener("click", function () {
      element.parentNode
        .querySelector(".c-menu__menu-item-dropdown")
        .classList.toggle("active");
    });
  });

  document
    .querySelectorAll(".c-menu__menu-item-dropdown-back")
    .forEach((ele) => {
      ele.addEventListener("click", function (event) {
        event.target.parentNode.classList.toggle("active");
      });
    });

  window.addEventListener("click", function (e) {
    document.querySelectorAll(".c-dropdown").forEach((element) => {
      if (!element.contains(e.target)) {
        element.classList.remove("active");
      }
    });
  });

  document
    .querySelectorAll(".c-dropdown .c-dropdown__text-box")
    .forEach((ele) => {
      ele.addEventListener("click", function (event) {
        event.target.parentNode.classList.toggle("active");
      });
    });

  document
    .querySelectorAll(".c-dropdown .c-dropdown__option")
    .forEach((ele) => {
      ele.addEventListener("click", function (event) {
        event.target.parentNode.previousElementSibling.value =
          event.target.getAttribute("value");
        event.target.parentNode.parentNode.classList.remove("active");
      });
    });

  document.getElementById("menuToggle").addEventListener("click", function () {
    const menuContent = document.getElementById("menuContent");
    if (menuContent.classList.contains("active")) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    menuContent.classList.toggle("active");
  });

  //range slider
  var ZBRangeSlider = function (id) {
    var self = this;
    var startX = 0,
      x = 0;

    // retrieve touch button
    var slider = document.getElementById(id);
    var touchLeft = slider.querySelector(".slider-touch-left");
    var touchRight = slider.querySelector(".slider-touch-right");
    var lineSpan = slider.querySelector(".slider-line span");

    // get some properties
    var min = parseFloat(slider.getAttribute("se-min"));
    var max = parseFloat(slider.getAttribute("se-max"));

    // retrieve default values
    var defaultMinValue = min;
    if (slider.hasAttribute("se-min-value")) {
      defaultMinValue = parseFloat(slider.getAttribute("se-min-value"));
    }
    var defaultMaxValue = max;

    if (slider.hasAttribute("se-max-value")) {
      defaultMaxValue = parseFloat(slider.getAttribute("se-max-value"));
    }

    // check values are correct
    if (defaultMinValue < min) {
      defaultMinValue = min;
    }

    if (defaultMaxValue > max) {
      defaultMaxValue = max;
    }

    if (defaultMinValue > defaultMaxValue) {
      defaultMinValue = defaultMaxValue;
    }

    var step = 0.0;

    if (slider.getAttribute("se-step")) {
      step = Math.abs(parseFloat(slider.getAttribute("se-step")));
    }

    // normalize flag
    var normalizeFact = 26;

    self.slider = slider;
    self.reset = function () {
      touchLeft.style.left = "0px";
      touchRight.style.left = slider.offsetWidth - touchLeft.offsetWidth + "px";
      lineSpan.style.marginLeft = "0px";
      lineSpan.style.width = slider.offsetWidth - touchLeft.offsetWidth + "px";
      startX = 0;
      x = 0;
    };

    self.setMinValue = function (minValue) {
      var ratio = (minValue - min) / (max - min);
      touchLeft.style.left =
        Math.ceil(
          ratio * (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact))
        ) + "px";
      lineSpan.style.marginLeft = touchLeft.offsetLeft + "px";
      lineSpan.style.width =
        touchRight.offsetLeft - touchLeft.offsetLeft + "px";
      slider.setAttribute("se-min-value", minValue);
    };

    self.setMaxValue = function (maxValue) {
      var ratio = (maxValue - min) / (max - min);
      touchRight.style.left =
        Math.ceil(
          ratio *
            (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact)) +
            normalizeFact
        ) + "px";
      lineSpan.style.marginLeft = touchLeft.offsetLeft + "px";
      lineSpan.style.width =
        touchRight.offsetLeft - touchLeft.offsetLeft + "px";
      slider.setAttribute("se-max-value", maxValue);
    };

    // initial reset
    self.reset();

    // usefull values, min, max, normalize fact is the width of both touch buttons
    var maxX = slider.offsetWidth - touchRight.offsetWidth;
    var selectedTouch = null;
    var initialValue = lineSpan.offsetWidth - normalizeFact;

    // set defualt values
    self.setMinValue(defaultMinValue);
    self.setMaxValue(defaultMaxValue);

    // setup touch/click events
    function onStart(event) {
      // Prevent default dragging of selected content
      event.preventDefault();
      var eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      if (this === touchLeft) {
        x = touchLeft.offsetLeft;
      } else {
        x = touchRight.offsetLeft;
      }

      startX = eventTouch.pageX - x;
      selectedTouch = this;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onStop);
      document.addEventListener("touchmove", onMove);
      document.addEventListener("touchend", onStop);
    }

    function onMove(event) {
      var eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      x = eventTouch.pageX - startX;

      if (selectedTouch === touchLeft) {
        if (x > touchRight.offsetLeft - selectedTouch.offsetWidth + 10) {
          x = touchRight.offsetLeft - selectedTouch.offsetWidth + 10;
        } else if (x < 0) {
          x = 0;
        }

        selectedTouch.style.left = x + "px";
      } else if (selectedTouch === touchRight) {
        if (x < touchLeft.offsetLeft + touchLeft.offsetWidth - 10) {
          x = touchLeft.offsetLeft + touchLeft.offsetWidth - 10;
        } else if (x > maxX) {
          x = maxX;
        }
        selectedTouch.style.left = x + "px";
      }

      // update line span
      lineSpan.style.marginLeft = touchLeft.offsetLeft + "px";
      lineSpan.style.width =
        touchRight.offsetLeft - touchLeft.offsetLeft + "px";

      // write new value
      calculateValue();

      // call on change
      if (slider.getAttribute("on-change")) {
        var fn = new Function("min, max", slider.getAttribute("on-change"));
        fn(
          slider.getAttribute("se-min-value"),
          slider.getAttribute("se-max-value")
        );
      }

      if (self.onChange) {
        self.onChange(
          slider.getAttribute("se-min-value"),
          slider.getAttribute("se-max-value")
        );
      }
    }

    function onStop(event) {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onStop);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onStop);

      selectedTouch = null;

      // write new value
      calculateValue();

      // call did changed
      if (slider.getAttribute("did-changed")) {
        var fn = new Function("min, max", slider.getAttribute("did-changed"));
        fn(
          slider.getAttribute("se-min-value"),
          slider.getAttribute("se-max-value")
        );
      }

      if (self.didChanged) {
        self.didChanged(
          slider.getAttribute("se-min-value"),
          slider.getAttribute("se-max-value")
        );
      }
    }

    function calculateValue() {
      var newValue = (lineSpan.offsetWidth - normalizeFact) / initialValue;
      var minValue = lineSpan.offsetLeft / initialValue;
      var maxValue = minValue + newValue;

      var minValue = minValue * (max - min) + min;
      var maxValue = maxValue * (max - min) + min;

      if (step !== 0.0) {
        var multi = Math.floor(minValue / step);
        minValue = step * multi;

        multi = Math.floor(maxValue / step);
        maxValue = step * multi;
      }

      slider.setAttribute("se-min-value", minValue);
      slider.setAttribute("se-max-value", maxValue);
    }

    // link events
    touchLeft.addEventListener("mousedown", onStart);
    touchRight.addEventListener("mousedown", onStart);
    touchLeft.addEventListener("touchstart", onStart);
    touchRight.addEventListener("touchstart", onStart);
  };

  var newRangeSlider = new ZBRangeSlider("range-slider-price");

  newRangeSlider.onChange = function (min, max) {
    document.getElementById("range-slider-price-min").value = min;
    document.getElementById("range-slider-price-max").value = max;
  };

  newRangeSlider.didChanged = function (min, max) {
    document.getElementById("range-slider-price-min").value = min;
    document.getElementById("range-slider-price-max").value = max;
  };

  var newRangeSlider = new ZBRangeSlider("range-slider-area");

  newRangeSlider.onChange = function (min, max) {
    document.getElementById("range-slider-area-min").value = min;
    document.getElementById("range-slider-area-max").value = max;
  };

  newRangeSlider.didChanged = function (min, max) {
    document.getElementById("range-slider-area-min").value = min;
    document.getElementById("range-slider-area-max").value = max;
  };

  // call reset if needed
  // newRangeSlider.reset();
};
