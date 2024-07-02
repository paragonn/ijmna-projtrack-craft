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

// let thumbSlider = document.querySelector(".thumbslider");
// if (thumbSlider) {
//     let thumbslider = new Swiper(".thumbslider", {
//         spaceBetween: 2,
//         slidesPerView: 1,
//         freeMode: true,
//         centeredSlides: true,
//         slideToClickedSlide: true,
//         allowTouchMove: false
//     });

//     let productslider = new Swiper(".productslider", {
//         slidesPerView: 1,
//         centeredSlides: true,
//         allowTouchMove: false,
//         pagination: {
//             el: ".swiper-pagination-imageContent",
//             type: "fraction"
//         },
//         navigation: {
//             nextEl: ".swiper-button-next-product-main",
//             prevEl: ".swiper-button-prev-product-main"
//         },
//         thumbs: {
//             swiper: thumbslider
//         },
//         on: {
//             slideChange: function () {
//                 console.log('Slide changed to: ', this.activeIndex);
//             }
//         }
//     });
// }

let thumbSlider = document.querySelector(".thumbslider");
if (thumbSlider) {
    var thumbslider = new Swiper(".thumbslider", {
        spaceBetween: 10,
        slidesPerView: 1,
        freeMode: true,
        watchSlidesProgress: true,
        allowTouchMove: false,
        navigation: {
            nextEl: ".swiper-button-next-thumbs",
            prevEl: ".swiper-button-prev-thumbs",
        },
    });

    var productslider = new Swiper(".productslider", {
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

/*let thumbcreativeSlider = document.querySelector(".thumb-creativelider");
if (thumbcreativeSlider) {
    let thumbslider = new Swiper(".thumb-creativelider", {
        spaceBetween: 2,
        slidesPerView: 1,
        centeredSlides: true,
        slideToClickedSlide: true,
        allowTouchMove: false,
    });
}*/

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
