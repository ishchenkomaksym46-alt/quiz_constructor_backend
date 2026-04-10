-- Удаляем старые таблицы если есть
DROP TABLE IF EXISTS quiz_likes CASCADE;
DROP TABLE IF EXISTS likes CASCADE;

-- Таблица для хранения лайков (связь многие-ко-многим)
CREATE TABLE quiz_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quiz_id)
);

-- Таблица для подсчета количества лайков на каждом квизе
CREATE TABLE likes (
    quiz_id INTEGER PRIMARY KEY REFERENCES quizzes(id) ON DELETE CASCADE,
    count INTEGER DEFAULT 0
);
