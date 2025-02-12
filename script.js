const start = document.querySelector('.start');
const startWrapper = document.querySelector('.start-wrapper');

// Функция для получения доступа к папке и сканирования её содержимого
async function scanDirectory() {
    try {
        // Запрашиваем у пользователя доступ к папке img
        const dirHandle = await window.showDirectoryPicker();
        const fileSystem = {};

        // Сканируем содержимое папки
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'directory') {
                const folderName = entry.name;
                fileSystem[folderName] = [];
                
                // Сканируем содержимое подпапки
                const folderHandle = await dirHandle.getDirectoryHandle(folderName);
                for await (const file of folderHandle.values()) {
                    if (file.kind === 'file' && file.name.match(/\.(jpg|jpeg|png)$/i)) {
                        // Добавляем имя файла без расширения
                        fileSystem[folderName].push(file.name.replace(/\.[^/.]+$/, ''));
                    }
                }
            }
        }
        return fileSystem;
    } catch (error) {
        console.error('Error scanning directory:', error);
        return null;
    }
}

// Функция создания меню
async function createMenu(fileSystem) {
    const menu = document.querySelector('.menu');
    const folders = Object.keys(fileSystem);
    
    menu.innerHTML = '';
    
    folders.forEach((folder, index) => {
        const menuItem = document.createElement('a');
        menuItem.href = '#';
        menuItem.className = 'menu-item';
        if (index === 0) menuItem.classList.add('active');
        menuItem.textContent = folder;
        
        menuItem.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.textContent.toLowerCase();
            updateContainer(section, fileSystem);
            
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            e.target.classList.add('active');
        });
        
        menu.appendChild(menuItem);
    });
    
    // Инициализируем первый раздел
    updateContainer(folders[0].toLowerCase(), fileSystem);
}

// Функция создания кнопки
function createButton(text) {
    const button = document.createElement('button');
    button.className = 'button';
    button.setAttribute('data-image', text);
    button.textContent = text;
    return button;
}

// Функция обновления содержимого контейнера
function updateContainer(section, fileSystem) {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    
    const images = fileSystem[section];
    const buttons = images.map(text => createButton(text));
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const section = document.querySelector('.menu-item.active').textContent.toLowerCase();
            modalImg.src = `img/${section}/${button.getAttribute('data-image')}.jpg`;
            modal.style.display = 'block';
        });
        container.appendChild(button);
    });
}

// Настройка функционала модального окна
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');

// Обработчики закрытия модального окна
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.style.display = 'none';
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    const wrapper = document.querySelector('.wrapper');
    wrapper.style.display = 'none';
    
    start.addEventListener('click', async () => {
        const fileSystem = await scanDirectory();
        if (fileSystem) {
            startWrapper.remove(); // Remove the entire start-wrapper instead of just the button
            wrapper.style.display = 'flex';
            await createMenu(fileSystem);
        }
    });
});