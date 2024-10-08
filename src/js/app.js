/**
 * Alpine JS
 * Best to put it last so that all other potential JS is available
 * when components start getting initialized.
 */

import Alpine from 'alpinejs';
import collapse from "@alpinejs/collapse";
import AOS from 'aos';

import { lazyLoadVideo } from "./components/lazyLoadVideo.js";

lazyLoadVideo();

window.Alpine = Alpine;
Alpine.plugin(collapse);
Alpine.start();

// animation
window.addEventListener("load", (event) => {
    AOS.init({
        once: "true",
    });
});

