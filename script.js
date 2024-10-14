const mapContainer = document.getElementById('map-container');
const mapImage = document.getElementById('map');

const scrollSpeed = 20;
const edgeThreshold = 75;
let scrollDirection = { x: 0, y: 0 };
let autoScrollInterval;

const originalWidth = mapImage.naturalWidth;
const originalHeight = mapImage.naturalHeight;

const markers = [
    { top: 150, left: 1000, content: 'Poço' },
    { top: 1050, left: 1000, content: 'M01' },
    { top: 1050, left: 1100, content: 'M02' },
    { top: 1050, left: 1200, content: 'M03' },
    { top: 1050, left: 1300, content: 'M04' },
    { top: 1050, left: 1400, content: 'M05' },
];

function createMarkers() {
    markers.forEach(marker => {
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.style.top = `${marker.top}px`;
        markerElement.style.left = `${marker.left}px`;

        const spanElement = document.createElement('span');
        spanElement.textContent = marker.content;

        markerElement.appendChild(spanElement);
        mapContainer.appendChild(markerElement);
    });
}

function centerMap() {
    const mapWidth = mapImage.offsetWidth;
    const mapHeight = mapImage.offsetHeight;

    mapContainer.scrollLeft = mapWidth / 2;
    mapContainer.scrollTop = mapHeight / 2;

    console.log(mapWidth, mapHeight)
}

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

createMarkers();
autoScroll();
centerMap();
