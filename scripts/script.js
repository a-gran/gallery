// Определяем содержимое для каждого раздела
const sectionContent = {
    'legend': [
        'Докер', 'Интеграция с VK', 'Контракты', 'Монолит', 
        'Нагрузочное', 'Расчет рейтинга с reddis', 'Типы мобильных приложений', 'Ускорение тестирования',
        'GIT', 'Kafka', 'Kibana, Sentry, Grafana', 'Авторизация',
        'OSI', 'REST', 'TDD, BDD, DDD0', 'TLS'
    ],

    'theory': [
        'Баг-репорт', 'Баг, дефект, сбой, ошибка', 'Виды логирования', 'Виды требований',
        'Виды хранилищ в браузере', 'Вэб-сервисы', 'Куки', 'Микросервисы',
        'Монолит и микросервисы', 'Очередность тестирования', 'Свободное время', 'Снифферы',
        'Тест-кейс', 'Тестовая модель', 'DevTools', 'JWT' 
    ],

    'tms': [
        'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000',
        'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000',
        'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000',
        'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000'
    ],

    'features': [
        'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000',
        'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000',
        'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000',
        'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000', 'placeholder_1800x1000'
    ]
}

// Настройка функционала модального окна
const modal = document.getElementById('imageModal')
const modalImg = document.getElementById('modalImage')

// Функция создания кнопки
function createButton(text) {
    const button = document.createElement('button')
    button.className = 'button'
    button.setAttribute('data-image', text)
    button.textContent = text
    return button
}

// Функция обновления содержимого контейнера
function updateContainer(section) {
    const container = document.querySelector('.container')
    container.innerHTML = '' // Очищаем существующее содержимое
    
    const buttons = sectionContent[section].map(text => createButton(text))
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const section = document.querySelector('.menu-item.active').textContent.toLowerCase();
            modalImg.src = `img/${section}/${button.getAttribute('data-image')}.jpg`;
            modal.style.display = 'block';
        })
        container.appendChild(button)
    })
}

// Настройка обработчиков событий навигации
document.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault()
        const section = e.target.textContent.toLowerCase()
        updateContainer(section)
        
        // Обновляем активное состояние
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active')
        })
        e.target.classList.add('active')
    })
})

// Обработчики закрытия модального окна
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.style.display = 'none'
    }
})

// Инициализация первым разделом
updateContainer('legend')