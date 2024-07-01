import Swiper from "swiper";
import {
    Navigation,
    Pagination,
    Autoplay,
    Thumbs,
    EffectFade,
} from "swiper/modules";

Swiper.use([Navigation, Pagination, Autoplay, Thumbs, EffectFade]);
window.Swiper = Swiper;

let sliders = document.querySelectorAll(".swiper-slider");
sliders.forEach((slider) => {
    let settings = {};
    let modules = { modules: [] };

    settings["modules"] = [];
    if (slider.dataset.modulenav) {
        modules["modules"].push(Navigation);
    }

    if (slider.dataset.modulepagination) {
        modules["modules"].push(Pagination);
    }

    if (slider.dataset.moduleautoplay) {
        modules["modules"].push(Autoplay);
    }

    if (slider.dataset.moduleeffectfade) {
        modules["modules"].push(EffectFade);
    }

    if (slider.dataset.settings) {
        settings = JSON.parse(slider.dataset.settings);
    }

    settings = merge(modules, settings);
    let swiper = new Swiper(slider, settings);
});

function merge(modules, settings) {
    for (var key in settings) {
        if (settings.hasOwnProperty(key)) modules[key] = settings[key];
    }
    return modules;
}

let thumbSlider = document.querySelector(".thumbslider");
if (thumbSlider) {
    var thumbslider = new Swiper(".thumbslider", {
        spaceBetween: 2,
        slidesPerView: 1,
        centeredSlides: true,
        slideToClickedSlide: true,
        allowTouchMove: false,
    });

    var productslider = new Swiper(".productslider", {
        slidesPerView: 1,
        centeredSlides: true,
        speed: 500,
        effect: "fade",
        allowTouchMove: false,
        navigation: {
            nextEl: ".swiper-button-next-product-main",
            prevEl: ".swiper-button-prev-product-main",
        },
        pagination: {
            el: ".swiper-pagination-testi",
            type: "fraction",
        },
        thumbs: {
            swiper: thumbslider,
        },
    });
}

let thumbcreativeSlider = document.querySelector(".thumb-creativelider");
if (thumbcreativeSlider) {
    var thumbslider = new Swiper(".thumb-creativelider", {
        spaceBetween: 2,
        slidesPerView: 1,
        centeredSlides: true,
        slideToClickedSlide: true,
        allowTouchMove: false,
    });

    var productslider = new Swiper(".creative-slider", {
        slidesPerView: 1,
        centeredSlides: true,
        speed: 500,
        effect: "fade",
        allowTouchMove: false,
        navigation: {
            nextEl: ".swiper-button-next-creative-main",
            prevEl: ".swiper-button-prev-creative-main",
        },
        pagination: {
            el: ".swiper-pagination-creative",
            type: "fraction",
        },
        thumbs: {
            swiper: thumbcreativeSlider,
        },
    });
}

// var swiper = new Swiper(".swiper-progress", {
//     autoplay: {
//         delay: 2500,
//         disableOnInteraction: false,
//     },
//     on: {
//         autoplayTimeLeft(s, time, progress) {
//             const currentSlide = s.slides[s.activeIndex];
//             const progressBar = currentSlide.querySelector(".progressBar");
//             if (progressBar) {
//                 const widthPercentage = parseFloat(progress) * 100;
//                 progressBar.style.width = widthPercentage + "%";
//             }
//         },
//     },
// });
