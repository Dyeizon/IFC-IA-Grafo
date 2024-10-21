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
graph.addNode('M04', 910, 1300);
graph.addNode('M06', 870, 1290);
graph.addNode('M08', 830, 1280);
graph.addNode('M17', 790, 1270);
graph.addNode('M18', 750, 1260);
graph.addNode('M14', 870, 1220);
graph.addNode('M12', 830, 1210);
graph.addNode('M22', 790, 1200);
graph.addNode('M19', 750, 1190);

graph.addNode('Auditório', 750, 850);

graph.addNode('Laboratórios', 970, 710);
graph.addNode('H01', 1050, 750);
graph.addNode('H02', 1055, 710);
graph.addNode('H03', 1060, 670);
graph.addNode('H04', 1030, 640);
graph.addNode('H05', 990, 630);
graph.addNode('H06', 950, 620);
graph.addNode('H07', 900, 640);
graph.addNode('H08', 890, 680);
graph.addNode('H09', 850, 630);
graph.addNode('H10', 840, 670);

graph.addNode('Bosque', 1250, 2300);
graph.addNode('Guarita', 1440, 1580);
graph.addNode('Administrativo', 1280, 1310);

graph.addNode('SalasSaidaSuperior', 800, 1060);

graph.addNode('SalasDeAula', 1150, 1150);
graph.addNode('BlocoA', 1050, 1100);
graph.addNode('A01', 980, 1040);
graph.addNode('A02', 930, 1035);
graph.addNode('A03', 880, 1030);
graph.addNode('A04', 880, 1110);
graph.addNode('A05', 930, 1120);
graph.addNode('A06', 980, 1125);

graph.addNode('BlocoC', 1160, 1000);
graph.addNode('C03', 1230, 900);
graph.addNode('C04', 1240, 850);
graph.addNode('C05', 1250, 800);
graph.addNode('C06', 1170, 790);
graph.addNode('C07', 1165, 840);
graph.addNode('C08', 1160, 890);

graph.addNode('BlocoE', 1220, 720);
graph.addNode('E01', 1280, 640);
graph.addNode('E02', 1290, 590);
graph.addNode('E03', 1300, 540);
graph.addNode('E04', 1310, 490);
graph.addNode('E05', 1220, 480);
graph.addNode('E06', 1210, 530);
graph.addNode('E07', 1200, 580);
graph.addNode('E08', 1190, 630);

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

graph.addEdge('Pedagógico', 'M04', 800);
graph.addEdge('M04', 'M06', 200);
graph.addEdge('M06', 'M08', 200);
graph.addEdge('M08', 'M17', 200);
graph.addEdge('M17', 'M18', 200);
graph.addEdge('M18', 'M19', 200);
graph.addEdge('M19', 'M22', 200);
graph.addEdge('M22', 'M12', 200);
graph.addEdge('M12', 'M14', 200);
graph.addEdge('M22', 'M17', 200);
graph.addEdge('M12', 'M08', 200);
graph.addEdge('M14', 'M06', 200);
graph.addEdge('M14', 'Pedagógico', 800);

graph.addEdge('SalasDeAula', 'Laboratórios', 8400);
graph.addEdge('Laboratórios', 'Auditório', 4200);
graph.addEdge('Laboratórios', 'H01', 500);
graph.addEdge('Laboratórios', 'H02', 550);
graph.addEdge('Laboratórios', 'H03', 600);
graph.addEdge('Laboratórios', 'H04', 550);
graph.addEdge('Laboratórios', 'H05', 500);
graph.addEdge('Laboratórios', 'H06', 550);
graph.addEdge('Laboratórios', 'H07', 650);
graph.addEdge('Laboratórios', 'H08', 600);
graph.addEdge('H01', 'H02', 200);
graph.addEdge('H02', 'H03', 200);
graph.addEdge('H03', 'H04', 200);
graph.addEdge('H04', 'H05', 200);
graph.addEdge('H05', 'H06', 200);
graph.addEdge('H06', 'H07', 300);
graph.addEdge('H07', 'H08', 200);
graph.addEdge('H07', 'H09', 200);
graph.addEdge('H08', 'H10', 200);
graph.addEdge('H09', 'H10', 200);

graph.addEdge('SalasDeAula', 'BlocoA', 2000);
graph.addEdge('SalasDeAula', 'BlocoC', 2000);
graph.addEdge('BlocoA', 'A01', 500);
graph.addEdge('BlocoA', 'A06', 500);
graph.addEdge('A06', 'A05', 200);
graph.addEdge('A05', 'A04', 200);
graph.addEdge('A01', 'A02', 200);
graph.addEdge('A02', 'A03', 200);
graph.addEdge('A03', 'A04', 300);
graph.addEdge('A02', 'A05', 300);
graph.addEdge('A01', 'A06', 300);
graph.addEdge('A04', 'SalasSaidaSuperior', 500);
graph.addEdge('A03', 'SalasSaidaSuperior', 500);
graph.addEdge('BlocoC', 'C03', 500);
graph.addEdge('BlocoC', 'C08', 500);
graph.addEdge('C03', 'C04', 200);
graph.addEdge('C04', 'C05', 200);
graph.addEdge('C08', 'C07', 200);
graph.addEdge('C07', 'C06', 200);
graph.addEdge('C03', 'C08', 300);
graph.addEdge('C04', 'C07', 300);
graph.addEdge('C05', 'C06', 300);
graph.addEdge('C06', 'BlocoE', 400);
graph.addEdge('C05', 'BlocoE', 400);
graph.addEdge('BlocoE', 'E01', 500);
graph.addEdge('BlocoE', 'E08', 500);
graph.addEdge('E01', 'E02', 200);
graph.addEdge('E02', 'E03', 200);
graph.addEdge('E03', 'E04', 200);
graph.addEdge('E04', 'E05', 300);
graph.addEdge('E05', 'E06', 200);
graph.addEdge('E06', 'E07', 200);
graph.addEdge('E07', 'E08', 200);
graph.addEdge('E03', 'E06', 300);
graph.addEdge('E02', 'E07', 300);
graph.addEdge('E01', 'E08', 300);

graph.addEdge('SalasSaidaSuperior', 'Biblioteca', 4000);
graph.addEdge('SalasSaidaSuperior', 'Auditório', 3500);


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
