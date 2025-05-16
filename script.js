let map;
let currentRegion = null;
let worldMapLayer;
let regionLayers = {};

// Инициализация карты
function initMap() {
    map = L.map('map', {
        minZoom: 2,
        maxZoom: 5,
        zoomControl: true,
        attributionControl: false
    }).setView([0, 0], 2);

    // Добавляем базовый слой карты мира
    worldMapLayer = L.imageOverlay('world-map.jpg', [[-90, -180], [90, 180]]).addTo(map);

    // Добавляем кнопку возврата к карте мира
    const backButton = L.control({ position: 'topleft' });
    backButton.onAdd = function() {
        const div = L.DomUtil.create('div', 'region-button');
        div.innerHTML = 'Вернуться к карте мира';
        div.style.display = 'none';
        div.onclick = function() {
            showWorldMap();
        };
        return div;
    };
    backButton.addTo(map);

    // Добавляем обработчики для регионов
    setupRegionHandlers();
}

// Настройка обработчиков для регионов
function setupRegionHandlers() {
    const regions = {
        'north': { bounds: [[60, -20], [90, 20]], image: 'north-region.jpg' },
        'south': { bounds: [[-90, -20], [-60, 20]], image: 'south-region.jpg' },
        'east': { bounds: [[-20, 60], [20, 90]], image: 'east-region.jpg' },
        'west': { bounds: [[-20, -90], [20, -60]], image: 'west-region.jpg' }
    };

    for (const [region, data] of Object.entries(regions)) {
        const bounds = L.latLngBounds(data.bounds);
        const layer = L.imageOverlay(data.image, bounds);
        regionLayers[region] = layer;

        // Добавляем обработчик клика по региону
        map.on('click', function(e) {
            if (bounds.contains(e.latlng)) {
                showRegion(region);
            }
        });
    }
}

// Показать регион
function showRegion(region) {
    if (currentRegion === region) return;
    
    currentRegion = region;
    worldMapLayer.setOpacity(0.3);
    regionLayers[region].addTo(map);
    map.fitBounds(regionLayers[region].getBounds());
    
    // Показываем кнопку возврата
    document.querySelector('.region-button').style.display = 'block';
}

// Показать карту мира
function showWorldMap() {
    currentRegion = null;
    worldMapLayer.setOpacity(1);
    
    // Удаляем все региональные слои
    for (const layer of Object.values(regionLayers)) {
        map.removeLayer(layer);
    }
    
    map.setView([0, 0], 2);
    
    // Скрываем кнопку возврата
    document.querySelector('.region-button').style.display = 'none';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initMap); 