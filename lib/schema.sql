CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  technology VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  score_avg DECIMAL(4,2),
  question_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  session_id INT REFERENCES sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  score INT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);  