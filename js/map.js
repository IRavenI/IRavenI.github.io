// Глобальные переменные
let map;
let currentRegion = null;
let worldBounds;
let markers = [];
let currentMarkers = [];
let currentOverlay = null;
let currentBackground = null;
let detailRectangles = [];

// Инициализация карты
function initMap() {
    try {
        // Создаем карту
        map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 2,
            zoomControl: false,
            zoomSnap: 0.25,    // Шаг зума
            zoomDelta: 0.25,   // Шаг при использовании колесика мыши
            wheelDebounceTime: 40,  // Задержка между зумами при прокрутке
            attributionControl: false  // Отключаем атрибуцию
        });

        // Добавляем элементы управления
        L.control.zoom({
            position: 'bottomright',
            zoomInText: '+',
            zoomOutText: '-'
        }).addTo(map);

        // Устанавливаем границы карты
        worldBounds = [[0, 0], [1000, 1000]];
        map.fitBounds(worldBounds);

        // Добавляем основной слой карты
        L.imageOverlay('Eggraegor.png', worldBounds).addTo(map);

        // Добавляем маркеры для регионов
        addRegionMarkers();

        // Добавляем прямоугольники для детальных регионов
        addDetailRectangles();

        // Добавляем обработчики событий
        map.on('mousemove', updateCoordinates);
        map.on('click', handleMapClick);
        document.getElementById('showLabels').addEventListener('change', toggleLabels);
        document.getElementById('returnToWorld').addEventListener('click', returnToWorldMap);

        console.log('Карта успешно инициализирована');
    } catch (error) {
        console.error('Ошибка при инициализации карты:', error);
        document.getElementById('map').innerHTML = '<div style="color: red; padding: 20px;">Ошибка загрузки карты. Пожалуйста, обновите страницу.</div>';
    }
}

// Добавление маркеров регионов
function addRegionMarkers() {
    Object.values(regions).forEach(region => {
        const marker = L.marker(region.coordinates, {
            icon: L.divIcon({
                className: 'continent-label',
                html: `<div>${region.name}</div>`,
                iconSize: [150, 50],
                iconAnchor: [75, 25]
            })
        });

        marker.bindPopup(createPopupContent(region));
        marker.addTo(map);
        markers.push(marker);
    });
}

// Добавление прямоугольников для детальных регионов
function addDetailRectangles() {
    detailedRegions.forEach(region => {
        const rectangle = L.rectangle(region.bounds, {
            className: 'detailed-region',
            color: 'transparent',
            weight: 2
        }).addTo(map);

        rectangle.on('click', () => {
            showRegionDetails(region);
        });

        rectangle.on('mouseover', () => {
            document.getElementById('regionIndicator').textContent = region.name;
            document.getElementById('regionIndicator').style.display = 'block';
        });

        rectangle.on('mouseout', () => {
            document.getElementById('regionIndicator').style.display = 'none';
        });

        detailRectangles.push(rectangle);
    });
}

// Создание содержимого всплывающего окна
function createPopupContent(region) {
    return `
        <div class="popup-content">
            <h3>${region.name}</h3>
            <p>${region.description}</p>
        </div>
    `;
}

// Обработка клика по карте
function handleMapClick(e) {
    const region = findRegionByCoordinates(e.latlng);
    if (region) {
        showRegionDetails(region);
    }
}

// Поиск региона по координатам
function findRegionByCoordinates(coords) {
    return Object.values(regions).find(region => {
        const [x, y] = region.coordinates;
        return Math.abs(x - coords.lat) < 10 && Math.abs(y - coords.lng) < 10;
    });
}

// Показать детали региона
function showRegionDetails(region) {
    currentRegion = region;
    const detailRegion = detailedRegions.find(r => r.id === region.id);
    
    if (detailRegion) {
        // Добавляем анимацию исчезновения
        map._container.classList.add('fade-out');
        
        setTimeout(() => {
            // Сохраняем текущий зум и центр
            const currentZoom = map.getZoom();
            const currentCenter = map.getCenter();
            
            // Скрываем маркеры континентов
            markers.forEach(marker => {
                marker.remove();
            });
            
            // Устанавливаем новые границы
            map.fitBounds(detailRegion.detailBounds);
            
            // Добавляем детальную карту
            if (currentOverlay) {
                map.removeLayer(currentOverlay);
            }
            currentOverlay = L.imageOverlay(detailRegion.imageUrl, detailRegion.detailBounds).addTo(map);
            
            // Обновляем фон
            updateBackground(detailRegion.imageUrl);
            
            // Показываем кнопку возврата
            document.getElementById('returnToWorld').classList.remove('hidden');
            
            // Обновляем индикатор региона
            updateRegionIndicator(region.name);
            
            // Убираем класс анимации исчезновения и добавляем класс появления
            map._container.classList.remove('fade-out');
            map._container.classList.add('fade-in');
            
            // Убираем класс анимации появления через время анимации
            setTimeout(() => {
                map._container.classList.remove('fade-in');
            }, 500);
        }, 500);
    }
}

// Обновление фона
function updateBackground(imageUrl) {
    const worldBackground = document.getElementById('world-background');
    const detailBackground = document.getElementById('detail-background');
    
    if (currentBackground) {
        currentBackground.classList.remove('active');
    }
    
    detailBackground.style.backgroundImage = `url('${imageUrl}')`;
    detailBackground.classList.add('active');
    currentBackground = detailBackground;
}

// Возврат к карте мира
function returnToWorldMap() {
    // Добавляем анимацию исчезновения
    map._container.classList.add('fade-out');
    
    setTimeout(() => {
        if (currentOverlay) {
            map.removeLayer(currentOverlay);
            currentOverlay = null;
        }
        
        // Возвращаемся к исходному виду
        map.fitBounds(worldBounds);
        
        // Показываем маркеры континентов обратно
        markers.forEach(marker => {
            marker.addTo(map);
        });
        
        // Обновляем фон
        const worldBackground = document.getElementById('world-background');
        const detailBackground = document.getElementById('detail-background');
        
        if (currentBackground) {
            currentBackground.classList.remove('active');
        }
        worldBackground.classList.add('active');
        currentBackground = worldBackground;
        
        // Скрываем кнопку возврата
        document.getElementById('returnToWorld').classList.add('hidden');
        
        // Очищаем индикатор региона
        updateRegionIndicator('');
        
        currentRegion = null;
        
        // Убираем класс анимации исчезновения и добавляем класс появления
        map._container.classList.remove('fade-out');
        map._container.classList.add('fade-in');
        
        // Убираем класс анимации появления через время анимации
        setTimeout(() => {
            map._container.classList.remove('fade-in');
        }, 500);
    }, 500);
}

// Обновление координат
function updateCoordinates(e) {
    const coords = e.latlng;
    document.getElementById('coordinates').textContent = 
        `Координаты: [${Math.round(coords.lat)}, ${Math.round(coords.lng)}]`;
}

// Переключение отображения меток
function toggleLabels(e) {
    const show = e.target.checked;
    markers.forEach(marker => {
        const element = marker.getElement();
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    });
}

// Обновление индикатора региона
function updateRegionIndicator(regionName) {
    const indicator = document.getElementById('regionIndicator');
    if (regionName) {
        indicator.textContent = `Текущий регион: ${regionName}`;
        indicator.classList.add('active');
    } else {
        indicator.textContent = '';
        indicator.classList.remove('active');
    }
}

// Инициализация карты при загрузке страницы
document.addEventListener('DOMContentLoaded', initMap); 