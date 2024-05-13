/**
 * Alpine JS
 * Best to put it last so that all other potential JS is available
 * when components start getting initialized.
 */

import Alpine from 'alpinejs';
import AOS from 'aos';

window.Alpine = Alpine;
Alpine.start();

// animation
AOS.init();