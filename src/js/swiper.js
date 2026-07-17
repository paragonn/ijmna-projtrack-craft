import Swiper from "swiper";
import {
    Navigation,
    Pagination,
    Autoplay,
    Thumbs,
    EffectFade,
    FreeMode,
} from "swiper/modules";

window.Swiper = Swiper;

const ALL_MODULES = [
    Navigation,
    Pagination,
    Autoplay,
    Thumbs,
    EffectFade,
    FreeMode,
];

let sliders = document.querySelectorAll(".swiper-slider");
sliders.forEach((slider) => {
    let settings = {};
    let modules = { modules: [] };

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
    new Swiper(slider, settings);
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
        modules: ALL_MODULES,
        spaceBetween: 10,
        slidesPerView: 1,
        freeMode: true,
        watchSlidesProgress: true,
        allowTouchMove: false,
        effect: "fade",
        navigation: {
            nextEl: ".swiper-button-next-thumbs",
            prevEl: ".swiper-button-prev-thumbs",
        },
    });

    new Swiper(".productslider", {
        modules: ALL_MODULES,
        spaceBetween: 10,
        slidesPerView: 1,
        autoHeight: true,
        navigation: {
            nextEl: ".swiper-button-next-thumbs",
            prevEl: ".swiper-button-prev-thumbs",
        },
        pagination: {
            el: ".swiper-pagination-imageContent",
            type: "fraction",
        },
        thumbs: {
            swiper: thumbslider,
        },
    });
}
