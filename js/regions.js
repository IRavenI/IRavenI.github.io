// Конфигурация регионов
window.regions = {
    'north': { 
        name: "Норда",
        coordinates: [950, 534],
        type: "continent",
        description: "Северные земли Эггрегора, мистические и холодные"
    },
    'uestiz': {
        name: "Уэстиз",
        coordinates: [550, 200],
        type: "continent",
        description: "Западные территории, владения Империи Киматар"
    },
    'ista': {
        name: "Иста",
        coordinates: [600, 700],
        type: "continent",
        description: "Восточные земли рядом с Барьером"
    },
    'sauz': {
        name: "Сауз",
        coordinates: [240, 468],
        type: "continent",
        description: "Южные территории, заполненные пустыней"
    },
    'yarnak': {
        name: "Ярнак",
        coordinates: [210, 705],
        type: "continent",
        description: "Тропические архипелаги"
    },
    'virnal': {
        name: "Вирналь",
        coordinates: [245, 920],
        type: "continent",
        description: "Таинственный остров фей"
    }
};

// Конфигурация детальных регионов
window.detailedRegions = [
    {
        name: "Западная часть Исты",
        bounds: [[585, 440], [685, 540]],
        detailBounds: [[0, 0], [1000, 1000]],
        imageUrl: 'regions/Ista/Ista (Left Side).png',
        id: 'west-ista'
    }
];

// Проверяем, что данные определены
if (!window.regions || !window.detailedRegions) {
    console.error('Ошибка: данные регионов не определены');
} 