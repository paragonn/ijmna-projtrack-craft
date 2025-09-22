export function lazyLoadVideo(wrapper = "video.lazy") {
    let videosWrapper = document.querySelectorAll(wrapper);
    let videos = [].slice.call(videosWrapper);

    if ("IntersectionObserver" in window) {
        var videoObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(video) {
                if (video.isIntersecting) {
                    for (var source in video.target.children) {
                        var videoSource = video.target.children[source];
                        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                            videoSource.src = videoSource.dataset.src;
                        }
                    }

                    video.target.load();
                    video.target.classList.remove("lazy");
                    videoObserver.unobserve(video.target);
                }
            });
        });

        videos.forEach(function(video) {
            videoObserver.observe(video);
        });
    }
}
