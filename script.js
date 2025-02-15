const start = document.querySelector('.start')
const startWrapper = document.querySelector('.start-wrapper')

let globalDirHandle = null

async function scanDirectory() {
    try {
        const dirHandle = await window.showDirectoryPicker()
        globalDirHandle = dirHandle
        const fileSystem = {}

        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'directory') {
                const folderName = entry.name
                fileSystem[folderName] = []
                
                const folderHandle = await dirHandle.getDirectoryHandle(folderName)
                for await (const file of folderHandle.values()) {
                    if (file.kind === 'file' && file.name.match(/\.(jpg|jpeg|png)$/i)) {
                        // Проверяем наличие подчёркивания в имени файла
                        const underscoreIndex = file.name.indexOf('_')
                        if (underscoreIndex !== -1) {
                            // Извлекаем номер до подчёркивания
                            const numberPart = file.name.substring(0, underscoreIndex)
                            // Извлекаем имя после подчёркивания и до расширения
                            const namePart = file.name.substring(underscoreIndex + 1).replace(/\.(jpg|jpeg|png)$/i, '')
                            
                            // Проверяем, что numberPart содержит только цифры
                            if (/^\d+$/.test(numberPart)) {
                                fileSystem[folderName].push({
                                    number: parseInt(numberPart),
                                    name: namePart,
                                    fullName: file.name,
                                    handle: file
                                })
                            } else {
                                // Если numberPart не является числом, добавляем файл в конец
                                fileSystem[folderName].push({
                                    number: 9999,
                                    name: file.name.replace(/\.[^/.]+$/, ''),
                                    fullName: file.name,
                                    handle: file
                                })
                            }
                        } else {
                            // Если нет подчёркивания, добавляем файл в конец
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

async function loadImageFile(fileHandle) {
    try {
        const file = await fileHandle.getFile()
        return URL.createObjectURL(file)
    } catch (error) {
        console.error('Error loading image:', error)
        return null
    }
}

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
    
    if (folders.length > 0) {
        updateContainer(folders[0], fileSystem)
    }
}

function createButton(imageData) {
    const button = document.createElement('button')
    button.className = 'button'
    button.setAttribute('data-image', imageData.fullName)
    button.textContent = imageData.name
    return button
}

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

const modal = document.getElementById('imageModal')
const modalImg = document.getElementById('modalImage')

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'
        if (modalImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(modalImg.src)
        }
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.style.display = 'none'
        if (modalImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(modalImg.src)
        }
    }
})

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