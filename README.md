# Приложение для простого доступа к изображениям

## Использование:
### 1. Скачать репозиторий с приложением  

![скачать репозиторий с приложением](doc/download.jpg)  
  

### 2. Скачать и установить vscode  

![скачать и установить vscode](doc/vscode.jpg)  
  

### 3. Установить в vscode расширение "Live Server (Five Server)"  

![установить в vscode расширение "Live Server (Five Server)"](doc/fiveserver.jpg)  
  

### 4. Открыть файл index.html в vscode и запустить сервер нажав на кнопку "Go Live" в правом нижнем углу  

![открыть файл index.html в vscode и запустить сервер нажав на кнопку "Go Live" в правом нижнем углу](doc/start.jpg)  
  
  
### 5. В открывшемся в браузере окне приложения нажать на кнопку выбора основной папки  

![в открывшемся в браузере окне приложения нажать на кнопку выбора основной папки](doc/main_window.jpg)  
  
  
### 6. В выпадающем окне браузера выбрать основную папку на диске с нужными подпапками изображений и нажать открыть  

![выбрать основную папку на диске с нужными подпапками изображений и нажать открыть](doc/data.jpg)  
  
  
### 7. Рарешить просмотр в браузере и продолжить работу с приложением
![рарешить просмотр в браузере и продолжить работу с приложением](doc/alert.jpg)  
  
  
### 8. Можно переключаться по разделам в соответствии с названиями подпапок в основной папке
![можно переключаться по разделам в соответствии с названиями подпапок в основной папке](doc/app.jpg)  
  
  
### 9. И просматривать изображения кликая по кнопкам изображений
![и просматривать изображения кликая по кнопкам изображений](doc/view.jpg)  
  
  
## Как правиль организовать папку с изображениями:
Скрипт сделан таким образом, что у нас есть основная папка img, в которой есть подпапки с изображениями. В подпапках могут быть изображения с любым расширением, но предпочтительно .jpg.

По умолчанию верстка рассчитана на 4 подпапки, если их будет больше, то кнопки будут добавляться в строку.
Также по умолчанию верстка рассчитана на 16 изображений в подпапке, если их будет больше, то изображения будут добавляться в столбик.

## Пример структуры папки с изображениями:
```
img
├─ folder1
│  ├─ image1.jpg
│  ├─ image2.jpg
│  └─ image3.jpg
├─ folder2
│  ├─ image4.jpg
│  ├─ image5.jpg
│  └─ image6.jpg
├─ folder3
│  ├─ image7.jpg
│  ├─ image8.jpg
│  └─ image9.jpg
├─ folder4
│  ├─ image10.jpg
│  ├─ image11.jpg
│  └─ image12.jpg
```

В верхней части интерфейса есть меню с названиями разделов. Названия автоматически подтягиваются из названий подпапок с изображениями.

Разделы состоят из кнопок, которые открывают изображения в модальном окне. Названия кнопок автоматически подтягиваются из имен файлов изображений при выборе основной папки, из которой лежат подпапки с изображениями.

## Описание:
Приложение позволяет пользователю выбрать директорию на диске с изображениями и организовать быстрый доступ к ним через web-интерфейс посредством кнопок на экране (пример использования в видео)

## Также можно использовать приложение онлайн по ссылке:
https://a-gran.github.io/modal_viewer/
  
Я рекомендую скачаивать и использовать его оффлайн, так как в онлайн-версии могут быть проблемы с доступом к файлам на диске и скоростью показа изображений.
