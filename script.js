// Получаем ссылки на ключевые элементы DOM
const start = document.querySelector('.start') // Кнопка начала работы
const startWrapper = document.querySelector('.start-wrapper') // Обертка стартового экрана

// Глобальная переменная для хранения handle корневой директории
let globalDirHandle = null

/**
 * Функция сканирования директории и создания структуры файловой системы
 * @returns {Object|null} Объект с структурой папок и файлов или null при ошибке
 */
async function scanDirectory() {
    try {
        // Открываем диалог выбора директории
        const dirHandle = await window.showDirectoryPicker()
        globalDirHandle = dirHandle // Сохраняем handle директории глобально
        
        // Создаем объект для хранения структуры файловой системы
        const fileSystem = {}

        // Перебираем все элементы в выбранной директории
        for await (const entry of dirHandle.values()) {
            // Если текущий элемент является директорией
            if (entry.kind === 'directory') {
                const folderName = entry.name // Получаем имя папки
                fileSystem[folderName] = [] // Создаем массив для файлов этой папки
                
                // Получаем handle для текущей поддиректории
                const folderHandle = await dirHandle.getDirectoryHandle(folderName)
                
                // Перебираем все файлы в поддиректории
                for await (const file of folderHandle.values()) {
                    // Проверяем, является ли файл изображением
                    if (file.kind === 'file' && file.name.match(/\.(jpg|jpeg|png)$/i)) {
                        // Ищем символ подчеркивания в имени файла
                        const underscoreIndex = file.name.indexOf('_')
                        
                        if (underscoreIndex !== -1) {
                            // Извлекаем часть с номером (до подчеркивания)
                            const numberPart = file.name.substring(0, underscoreIndex)
                            // Извлекаем имя файла (после подчеркивания, без расширения)
                            const namePart = file.name.substring(underscoreIndex + 1).replace(/\.(jpg|jpeg|png)$/i, '')
                            
                            // Проверяем, что часть до подчеркивания является числом
                            if (/^\d+$/.test(numberPart)) {
                                // Добавляем информацию о файле в массив
                                fileSystem[folderName].push({
                                    number: parseInt(numberPart), // Номер для сортировки
                                    name: namePart, // Имя для отображения
                                    fullName: file.name, // Полное имя файла
                                    handle: file // Handle файла для последующей загрузки
                                })
                            } else {
                                // Если часть до подчеркивания не является числом
                                fileSystem[folderName].push({
                                    number: 9999, // Высокий номер для размещения в конце списка
                                    name: file.name.replace(/\.[^/.]+$/, ''),
                                    fullName: file.name,
                                    handle: file
                                })
                            }
                        } else {
                            // Если в имени файла нет подчеркивания
                            fileSystem[folderName].push({
                                number: 9999,
                                name: file.name.replace(/\.[^/.]+$/, ''),
                                fullName: file.name,
                                handle: file
                            })
                        }
                    }
                }
                
                // Сортируем файлы по номеру
                fileSystem[folderName].sort((a, b) => a.number - b.number)
            }
        }
        return fileSystem
    } catch (error) {
        console.error('Error scanning directory:', error)
        return null
    }
}

/**
 * Функция загрузки изображения по его handle
 * @param {FileSystemFileHandle} fileHandle Handle файла
 * @returns {string|null} URL изображения или null при ошибке
 */
async function loadImageFile(fileHandle) {
    try {
        // Получаем файл из handle
        const file = await fileHandle.getFile()
        // Создаем URL для изображения
        return URL.createObjectURL(file)
    } catch (error) {
        console.error('Error loading image:', error)
        return null
    }
}

/**
 * Функция создания меню из папок
 * @param {Object} fileSystem Объект с структурой файловой системы
 */
async function createMenu(fileSystem) {
    // Получаем элемент меню
    const menu = document.querySelector('.menu')
    // Получаем список папок
    const folders = Object.keys(fileSystem)
    
    // Очищаем меню
    menu.innerHTML = ''
    
    // Создаем пункты меню для каждой папки
    folders.forEach((folder, index) => {
        const menuItem = document.createElement('a')
        menuItem.href = '#'
        menuItem.className = 'menu-item'
        // Делаем первый пункт активным
        if (index === 0) menuItem.classList.add('active')
        menuItem.textContent = folder
        
        // Добавляем обработчик клика
        menuItem.addEventListener('click', (e) => {
            e.preventDefault()
            const section = e.target.textContent
            // Обновляем контейнер при клике
            updateContainer(section, fileSystem)
            
            // Обновляем активный пункт меню
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active')
            })
            e.target.classList.add('active')
        })
        
        menu.appendChild(menuItem)
    })
    
    // Инициализируем первую папку
    if (folders.length > 0) {
        updateContainer(folders[0], fileSystem)
    }
}

/**
 * Функция создания кнопки для изображения
 * @param {Object} imageData Данные изображения
 * @returns {HTMLButtonElement} Созданная кнопка
 */
function createButton(imageData) {
    const button = document.createElement('button')
    button.className = 'button'
    button.setAttribute('data-image', imageData.fullName)
    button.textContent = imageData.name
    return button
}

/**
 * Функция обновления контейнера с изображениями
 * @param {string} section Название текущей папки
 * @param {Object} fileSystem Объект с структурой файловой системы
 */
function updateContainer(section, fileSystem) {
    // Получаем контейнер
    const container = document.querySelector('.container')
    // Очищаем контейнер
    container.innerHTML = ''
    
    // Получаем список изображений для текущей папки
    const images = fileSystem[section] || []
    // Создаем кнопки для всех изображений
    const buttons = images.map(imageData => createButton(imageData))
    
    // Добавляем обработчики для каждой кнопки
    buttons.forEach((button, index) => {
        button.addEventListener('click', async () => {
            const imageData = fileSystem[section][index]
            // Загружаем изображение при клике
            const imageUrl = await loadImageFile(imageData.handle)
            if (imageUrl) {
                modalImg.src = imageUrl
                modal.style.display = 'block'
            }
        })
        container.appendChild(button)
    })
}

// Получаем элементы модального окна
const modal = document.getElementById('imageModal')
const modalImg = document.getElementById('modalImage')

// Обработчик клика по модальному окну (закрытие)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'
        // Освобождаем память, удаляя созданный URL
        if (modalImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(modalImg.src)
        }
    }
})

// Обработчик нажатия клавиши Escape (закрытие модального окна)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.style.display = 'none'
        // Освобождаем память, удаляя созданный URL
        if (modalImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(modalImg.src)
        }
    }
})

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Получаем основную обертку приложения
    const wrapper = document.querySelector('.wrapper')
    // Скрываем основной интерфейс
    wrapper.style.display = 'none'
    
    // Добавляем обработчик для кнопки начала работы
    start.addEventListener('click', async () => {
        // Сканируем выбранную директорию
        const fileSystem = await scanDirectory()
        if (fileSystem) {
            // Удаляем стартовый экран
            startWrapper.remove()
            // Показываем основной интерфейс
            wrapper.style.display = 'flex'
            // Создаем меню из папок
            await createMenu(fileSystem)
        }
    })
})