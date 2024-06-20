import Swiper from "swiper";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

window.Swiper = Swiper;
window.initslider = function () {
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
};

window.merge = function (modules, settings) {
    for (var key in settings) {
        if (settings.hasOwnProperty(key)) modules[key] = settings[key];
    }
    return modules;
};
initslider();



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
