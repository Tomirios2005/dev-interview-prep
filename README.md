# Dev Interview Prep

Plataforma para practicar entrevistas técnicas con feedback de IA. Elegís una tecnología y dificultad, Claude te hace preguntas reales de entrevista, evaluá tus respuestas con un puntaje y feedback detallado, y guardás tu historial de sesiones.

## Tecnologías

- **Next.js 15** — frontend y backend en un solo proyecto (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Neon DB** — PostgreSQL serverless
- **Anthropic API** — generación de preguntas y evaluación de respuestas con Claude Haiku

## Funcionalidades

- Selección de tecnología (Java, Spring Boot, SQL, React, Git, TypeScript) y dificultad (Junior / Semi-senior)
- Preguntas generadas dinámicamente por Claude en cada sesión
- Evaluación automática de respuestas con puntaje del 1 al 10 y feedback en español
- Historial de sesiones con promedio de puntaje
- Todo persistido en base de datos PostgreSQL

## Requisitos

- Node.js 18+
- Cuenta en [Neon DB](https://neon.tech)
- API key de [Anthropic](https://console.anthropic.com)

## Instalación

```bash
git clone https://github.com/tuusuario/dev-interview-prep.git
cd dev-interview-prep
npm install
```

Creá un archivo `.env.local` en la raíz del proyecto:

```
DATABASE_URL=tu_connection_string_de_neon
ANTHROPIC_API_KEY=tu_api_key_de_anthropic
```

Ejecutá el schema en el SQL Editor de Neon:

```sql
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
```

Levantá el servidor de desarrollo:

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Estructura del proyecto

```
app/
├── api/
│   ├── session/route.ts    # Crea una sesión nueva
│   ├── question/route.ts   # Genera una pregunta con Claude
│   ├── answer/route.ts     # Evalúa la respuesta con Claude
│   └── history/route.ts    # Trae el historial de sesiones
├── session/page.tsx        # Pantalla de sesión activa
├── history/page.tsx        # Historial de sesiones
└── page.tsx                # Home — selección de tecnología y dificultad
lib/
├── db.ts                   # Conexión a Neon DB
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de Neon DB (pooled) |
| `ANTHROPIC_API_KEY` | API key de Anthropic |