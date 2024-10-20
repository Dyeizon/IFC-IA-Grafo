class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addNode(node, top, left) {
        if (!this.adjacencyList[node]) {
            this.adjacencyList[node] = { edges: [], top, left };
        }
    }

    addEdge(node1, node2, distance) {
        this.adjacencyList[node1].edges.push({ node: node2, distance });
        this.adjacencyList[node2].edges.push({ node: node1, distance });
    }

    getAllNodes() {
        return Object.keys(this.adjacencyList).map(node => ({
            content: node,
            top: this.adjacencyList[node].top,
            left: this.adjacencyList[node].left
        }));
    }

    display() {
        for (const node in this.adjacencyList) {
            console.log(`${node} -> ${JSON.stringify(this.adjacencyList[node].edges)}`);
        }
    }

    heuristic(node1, node2) {
        const pos1 = this.adjacencyList[node1];
        const pos2 = this.adjacencyList[node2];
        return Math.sqrt(Math.pow(pos2.top - pos1.top, 2) + Math.pow(pos2.left - pos1.left, 2));
    }

    aStar(start, goal) {
        const openSet = new Set();
        const cameFrom = {};
        const gScore = {};
        const fScore = {};
        
        for (const node in this.adjacencyList) {
            gScore[node] = Infinity;
            fScore[node] = Infinity;
        }
        gScore[start] = 0;
        fScore[start] = this.heuristic(start, goal);
        openSet.add(start);

        while (openSet.size > 0) {
            let current = null;
            let lowestFScore = Infinity;

            for (const node of openSet) {
                if (fScore[node] < lowestFScore) {
                    lowestFScore = fScore[node];
                    current = node;
                }
            }

            if (current === goal) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.delete(current);

            for (const { node: neighbor, distance } of this.adjacencyList[current].edges) {
                const tentativeGScore = gScore[current] + distance;

                if (tentativeGScore < gScore[neighbor]) {
                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentativeGScore;
                    fScore[neighbor] = gScore[neighbor] + this.heuristic(neighbor, goal);

                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }

        return [];
    }

    reconstructPath(cameFrom, current) {
        const totalPath = [current];
        while (current in cameFrom) {
            current = cameFrom[current];
            totalPath.push(current);
        }
        return totalPath.reverse();
    }
}

const graph = new Graph();
graph.addNode('Poço', 375, 1025);
graph.addNode('Refeitório', 545, 2070);
graph.addNode('Ginásio', 720, 2480);
graph.addNode('Cantina', 750, 1470);
graph.addNode('Rua1', 640, 1340);
graph.addNode('RuaPrincipal', 1000, 1445);
graph.addNode('Biblioteca', 660, 1200);
graph.addNode('Pedagógico', 920, 1220);
graph.addNode('Auditório', 750, 850);
graph.addNode('Bosque', 1250, 2300);
graph.addNode('Guarita', 1440, 1580);
graph.addNode('Administrativo', 1280, 1310);
graph.addNode('SalasDeAula', 1150, 1150);

graph.addEdge('Refeitório', 'Ginásio', 8100);
graph.addEdge('Ginásio', 'Bosque', 8500);
graph.addEdge('Bosque', 'Guarita', 13500);

graph.addEdge('RuaPrincipal', 'Pedagógico', 4200);
graph.addEdge('RuaPrincipal', 'Guarita', 7700);
graph.addEdge('RuaPrincipal', 'Rua1', 5600);
graph.addEdge('RuaPrincipal', 'Cantina', 4200);
graph.addEdge('RuaPrincipal', 'SalasDeAula', 5100);
graph.addEdge('RuaPrincipal', 'Administrativo', 5000);

graph.addEdge('Guarita', 'Administrativo', 4500);
graph.addEdge('Pedagógico', 'Administrativo', 6200);
graph.addEdge('Pedagógico', 'SalasDeAula', 4200);

graph.addEdge('Biblioteca', 'Poço', 5500);
graph.addEdge('Biblioteca', 'Auditório', 5600);

graph.addEdge('Biblioteca', 'Rua1', 2000);
graph.addEdge('Refeitório', 'Rua1', 11000);
graph.addEdge('Cantina', 'Rua1', 2100);

const mapContainer = document.getElementById('map-container');
const mapImage = document.getElementById('map');
const linesContainer = document.getElementById('lines');

let scrollSpeed = 20;
let edgeThreshold = 75;
let scrollDirection = { x: 0, y: 0 };
let autoScrollInterval;
let firstNodeSelected = null;
let secondNodeSelected = null;

mapImage.addEventListener('load', function() {
    linesContainer.setAttribute('width', mapImage.naturalWidth);
    linesContainer.setAttribute('height', mapImage.naturalHeight);
    createMarkers(graph);
    centerMap();
});

function createMarkers(graph) {
    const markers = graph.getAllNodes();

    markers.forEach(marker => {
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.id = marker.content;
        markerElement.style.top = `${marker.top}px`;
        markerElement.style.left = `${marker.left}px`;

        markerElement.addEventListener('click', function() {
            
            if(firstNodeSelected && !secondNodeSelected) {
                secondNodeSelected = this;
                secondNodeSelected.style.backgroundColor = 'green';

                const path = graph.aStar(firstNodeSelected.id, secondNodeSelected.id);
                alert(`Melhor caminho: ${path}`);


            } else if(!firstNodeSelected && !secondNodeSelected) {
                firstNodeSelected = this;
                firstNodeSelected.style.backgroundColor = 'yellow';
            }

            else if(firstNodeSelected && secondNodeSelected) {
                firstNodeSelected.style.backgroundColor = 'black';
                firstNodeSelected = this;
                firstNodeSelected.style.backgroundColor = 'yellow';
                
                secondNodeSelected.style.backgroundColor = 'black';
                secondNodeSelected = null;
            }
        });

        const spanElement = document.createElement('span');
        spanElement.textContent = marker.content;

        markerElement.appendChild(spanElement);
        mapContainer.appendChild(markerElement);
    });

    for (const node in graph.adjacencyList) {
        const { top, left } = graph.adjacencyList[node];
        const edges = graph.adjacencyList[node].edges;

        edges.forEach(edge => {
            const target = graph.adjacencyList[edge.node];
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', left);
            line.setAttribute('y1', top);
            line.setAttribute('x2', target.left);
            line.setAttribute('y2', target.top);

            linesContainer.appendChild(line);

            const midX = (left + target.left) / 2;
            const midY = (top + target.top) / 2;

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY);
            text.setAttribute('font-size', '16');
            text.setAttribute('fill', 'black');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = edge.distance;

            linesContainer.appendChild(text);
        });
    }
}

function centerMap() {
    const mapWidth = mapImage.naturalWidth;
    const mapHeight = mapImage.naturalHeight;

    mapContainer.scrollLeft = (mapWidth / 2) - (mapContainer.clientWidth / 2);
    mapContainer.scrollTop = (mapHeight / 2) - (mapContainer.clientHeight / 2);
}

function autoScroll() {
    document.onmousemove = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        scrollDirection.x = 0;
        scrollDirection.y = 0;

        if (mouseX < edgeThreshold) {
            scrollDirection.x = -scrollSpeed;
        }
        if (mouseX > window.innerWidth - edgeThreshold) {
            scrollDirection.x = scrollSpeed;
        }
        if (mouseY < edgeThreshold) {
            scrollDirection.y = -scrollSpeed;
        }
        if (mouseY > window.innerHeight - edgeThreshold) {
            scrollDirection.y = scrollSpeed;
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
