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

// Function to open link in a new window
window.openLinkInNewWindow = function(event) {
    event.preventDefault();
    var link = event.currentTarget.getAttribute("href");
    window.open(link, "_blank");
}

window.closeWindow = function() {
    window.close();
}

// Add event listeners to all anchor tags with target="_blank"
document.querySelectorAll('a[target="_blank"]').forEach(anchor => {
    anchor.addEventListener('click', openLinkInNewWindow);
});

// Fade-in animation for images
function initFadeInAnimation() {
    // Add CSS for fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .fade-in.fast {
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }

        .fade-in.slow {
            transition: opacity 1s ease-out, transform 1s ease-out;
        }
    `;
    document.head.appendChild(style);

    // Create intersection observer for fade-in effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Initialize fade-in animation when DOM is loaded
document.addEventListener('DOMContentLoaded', initFadeInAnimation);

// Re-initialize for dynamically loaded content (like AJAX)
window.reinitFadeIn = function() {
    initFadeInAnimation();
};