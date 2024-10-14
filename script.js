const mapContainer = document.getElementById('map-container');
const mapImage = document.getElementById('map');

// Auto-scroll settings
const scrollSpeed = 20; // Adjust for scroll speed
const edgeThreshold = 75; // Distance from edge to trigger scroll
let scrollDirection = { x: 0, y: 0 }; // Direction of scrolling
let autoScrollInterval; // Interval for auto-scrolling

function autoScroll() {
    document.onmousemove = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        scrollDirection.x = 0;
        scrollDirection.y = 0;

        if (mouseX < edgeThreshold) {
            scrollDirection.x = -scrollSpeed; // left
        }
        if (mouseX > window.innerWidth - edgeThreshold) {
            scrollDirection.x = scrollSpeed; // right
        }
        if (mouseY < edgeThreshold) {
            scrollDirection.y = -scrollSpeed; // up
        }
        if (mouseY > window.innerHeight - edgeThreshold) {
            scrollDirection.y = scrollSpeed; // down
        }

        if (scrollDirection.x !== 0 || scrollDirection.y !== 0) {
            if (!autoScrollInterval) {
                autoScrollInterval = setInterval(() => {
                    mapContainer.scrollLeft += scrollDirection.x;
                    mapContainer.scrollTop += scrollDirection.y;
                }, 30); 
            }
        } else {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    };
}

autoScroll();
