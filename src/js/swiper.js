import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

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
