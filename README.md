#    <h1><i style="font-style: bold;">Rustogram</i></h1>
#    <h2>Установка и настройка</h2>
#    <ol>
#        <li><code>git clone git@github.com:vladlevin790/Rustogram-course-project.git</code> - Клонирование проекта</li>
#        <li> Предварительные требования: Наличие Composer и Node.js</li>
#        <li> <code>composer install</code> - Установка зависимостей в корне проекта</li>
#        <li> <code>cd react</code> - Переход в папку с пользовательской частью</li>
#        <li> <code>npm install --force</code> - Установка зависимостей Node.js</li>
#        <li> <code>npm run dev</code> - Запуск проекта</li>
#        <li> Запуск базы данных MySQL</li>
#        <li> Настройка переменных окружения (файл .env.example скопировать и вставить без .example , настроить подключение к базе данных, а также в папке react в файле .env вставить ссылку на работающий сервер)</li>
#        <li> <code>php artisan migrate</code> - Миграции базы данных</li>
#        <li> <code>php artisan storage:link</code> - Символическая ссылка для хранилища</li>
#        <li>Распаковать public.zip и перенести папку public с заменой в папку storage Laravel проекта</li>
#        <li><code>php artisan serve</code> - Запуск сервера</li>
#        <li>Если вы хотите, чтобы можно было загрузить файл размером больше 2 мб, следует зайти в php.ini и изменить переменную <code>upload_max_filesize</code> и <code>post_max_size</code></li>
#    </ol>
