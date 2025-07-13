-- サンプルテーブルの作成
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- サンプルデータの挿入
INSERT INTO users (name, email) VALUES
    ('田中太郎', 'tanaka@example.com'),
    ('佐藤花子', 'sato@example.com'),
    ('山田次郎', 'yamada@example.com');

-- ジャンルテーブルの作成
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ジャンルデータの挿入
INSERT INTO genres (name) VALUES
    ('プログラミング'),
    ('日記'),
    ('食べ物'),
    ('読書'),
    ('映画'),
    ('音楽'),
    ('旅行'),
    ('その他');

-- postsテーブルの作成
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- サンプル投稿データの挿入
INSERT INTO posts (user_id, genre_id, title, content) VALUES
    (1, 2, 'はじめての投稿', 'これは田中太郎の最初の投稿です。'),
    (2, 1, 'Honoを使ってみた', 'Honoフレームワークでサーバーを構築しました。'),
    (3, 1, 'Denoの魅力', 'Denoは新しいJavaScriptランタイムです。'),
    (1, 3, 'お昼ご飯', '今日は美味しいラーメンを食べました。'),
    (2, 4, '読書記録', '今月読んだ本について書きます。'),
    (3, 5, '映画レビュー', '最新の映画を見てきました。');
