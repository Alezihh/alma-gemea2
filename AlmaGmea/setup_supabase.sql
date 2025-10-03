-- Script SQL para configurar o Supabase
-- Execute este script no editor SQL do Supabase

-- Criar a tabela users (versão simplificada)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para email para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção
CREATE POLICY IF NOT EXISTS "Allow insert for all users" ON users
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura
CREATE POLICY IF NOT EXISTS "Allow read for all users" ON users
  FOR SELECT USING (true);

-- Verificar se a tabela foi criada
SELECT 'Tabela users criada com sucesso!' as status;
