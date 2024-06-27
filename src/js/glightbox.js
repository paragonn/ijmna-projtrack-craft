import GLightbox from "glightbox";

/*var lightboxInlineIframe = GLightbox({
    selector: ".glightbox",
});*/

window.GLightbox = GLightbox;

document.addEventListener("DOMContentLoaded", function () {
    let lightboxElements = document.querySelectorAll('.glightbox');

    lightboxElements.forEach(element => {
        GLightbox({
            selector: "#" + element.getAttribute('id'),
        });
    });
});

let popupFormLightbox = GLightbox({
    closeButton: true,
    selector: null,
    skin: "popup-form-wrapper glightbox-clean",
    width: "100%",
});

window.runGlightBoxAPI = function(element) {
    let apiForm = element.getAttribute("data-apiForm");
    element.addEventListener('click', function(e) {
        e.preventDefault();
        let paragraphLoader = element.querySelector(".p-loader");

        if (paragraphLoader) {
            paragraphLoader.style.display = "inline-block";
        }
        element.setAttribute("disabled", "");

        let url = "/apis/" + apiForm + "?";
        if(element.getAttribute("data-event")) {
            url = url + "event=" + element.getAttribute("data-event") + "&";
        }

        if(element.getAttribute("data-form")) {
            url = url + "form=" + element.getAttribute("data-form") + "&";
        }

        fetch(url, {
            method: "GET",
            cache: "no-cache",
            redirect: "follow",
            credentials: "same-origin",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
        })
        .then((response) => response.text())
        .then((data) => {
            // console.log(data);
            let replaceContent = '';
            if(typeof(element.dataset.heading) !== "undefined" && element.dataset.heading.trim()) {
                replaceContent += `<h3 class="text-3xl md:text-4xl">${element.dataset.heading}</h3><div class="bg-turkey-300 h-px w-full mt-4"></div>`;
            }

            if(typeof(element.dataset.text) !== "undefined" && element.dataset.text.trim()) {
                replaceContent += `<div class="space-y-3 mb-5">${element.dataset.text}</div>`;
            }

            popupFormLightbox.setElements([{
                content: replaceContent + data,
                width: typeof(element.dataset.width) !== "undefined" ? element.dataset.width : "100%",
                height: typeof(element.dataset.height) !== "undefined" ? element.dataset.height : "100vh"
            }]);
            popupFormLightbox.open();

            setTimeout(function() {
                if (element.getAttribute('data-form') != 'signin-form') {
                    window.Formie.initForms();
                }

                if (paragraphLoader) {
                    paragraphLoader.style.display = "none";
                }
            }, 50);
        });
    });
}

let experienceForms = document.querySelectorAll(".glightbox-popup-form");
experienceForms.forEach(element => {
    runGlightBoxAPI(element);
});

