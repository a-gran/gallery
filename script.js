const start = document.querySelector('.start')
const startWrapper = document.querySelector('.start-wrapper')

let globalDirHandle = null // Сохраняем handle корневой директории

// Функция для получения доступа к папке и сканирования её содержимого
async function scanDirectory() {
    try {
        // Запрашиваем у пользователя доступ к папке
        const dirHandle = await window.showDirectoryPicker()
        globalDirHandle = dirHandle // Сохраняем handle
        const fileSystem = {}

        // Сканируем содержимое папки
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'directory') {
                const folderName = entry.name
                fileSystem[folderName] = []
                
                // Сканируем содержимое подпапки
                const folderHandle = await dirHandle.getDirectoryHandle(folderName)
                for await (const file of folderHandle.values()) {
                    if (file.kind === 'file' && file.name.match(/\.(jpg|jpeg|png)$/i)) {
                        fileSystem[folderName].push({
                            name: file.name.replace(/\.[^/.]+$/, ''),
                            fullName: file.name,
                            handle: file // Сохраняем handle файла
                        })
                    }
                }
            }
        }
        return fileSystem
    } catch (error) {
        console.error('Error scanning directory:', error)
        return null
    }
}

// Функция для загрузки изображения по его handle
async function loadImageFile(fileHandle) {
    try {
        const file = await fileHandle.getFile()
        return URL.createObjectURL(file)
    } catch (error) {
        console.error('Error loading image:', error)
        return null
    }
}

// Функция создания меню
async function createMenu(fileSystem) {
    const menu = document.querySelector('.menu')
    const folders = Object.keys(fileSystem)
    
    menu.innerHTML = ''
    
    folders.forEach((folder, index) => {
        const menuItem = document.createElement('a')
        menuItem.href = '#'
        menuItem.className = 'menu-item'
        if (index === 0) menuItem.classList.add('active')
        menuItem.textContent = folder
        
        menuItem.addEventListener('click', (e) => {
            e.preventDefault()
            const section = e.target.textContent
            updateContainer(section, fileSystem)
            
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active')
            })
            e.target.classList.add('active')
        })
        
        menu.appendChild(menuItem)
    })
    
    // Инициализируем первый раздел
    if (folders.length > 0) {
        updateContainer(folders[0], fileSystem)
    }
}

// Функция создания кнопки
function createButton(imageData) {
    const button = document.createElement('button')
    button.className = 'button'
    button.setAttribute('data-image', imageData.fullName)
    button.textContent = imageData.name
    return button
}

// Функция обновления содержимого контейнера
function updateContainer(section, fileSystem) {
    const container = document.querySelector('.container')
    container.innerHTML = ''
    
    const images = fileSystem[section] || []
    const buttons = images.map(imageData => createButton(imageData))
    
    buttons.forEach((button, index) => {
        button.addEventListener('click', async () => {
            const imageData = fileSystem[section][index]
            const imageUrl = await loadImageFile(imageData.handle)
            if (imageUrl) {
                modalImg.src = imageUrl
                modal.style.display = 'block'
            }
        })
        container.appendChild(button)
    })
}

// Настройка функционала модального окна
const modal = document.getElementById('imageModal')
const modalImg = document.getElementById('modalImage')

// Обработчики закрытия модального окна
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'
        // Очищаем URL при закрытии модального окна
        if (modalImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(modalImg.src)
        }
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.style.display = 'none'
        // Очищаем URL при закрытии модального окна
        if (modalImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(modalImg.src)
        }
    }
})

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    const wrapper = document.querySelector('.wrapper')
    wrapper.style.display = 'none'
    
    start.addEventListener('click', async () => {
        const fileSystem = await scanDirectory()
        if (fileSystem) {
            startWrapper.remove()
            wrapper.style.display = 'flex'
            await createMenu(fileSystem)
        }
    })
})