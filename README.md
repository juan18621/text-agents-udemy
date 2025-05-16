# Development Installation

Sigue estos pasos para instalar y ejecutar el proyecto en modo de desarrollo:

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/juan18621/text-agents-udemy.git
   cd text-agents-udemy
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   Copia el archivo `.env.template` y renómbralo como `.env`. Luego, asegúrate de completar los valores requeridos, especialmente tu clave de API de OpenAI.

   ```bash
   cp .env.template .env
   ```

   Edita el archivo `.env` y proporciona tu api key de openAI y tu id de assistente que creaste en el playground para probar:

   ```env
   OPENAI_API_KEY=api_key
   SERVER_URL=http://localhost:3000/
   ASSISTANT_ID=assistant_id
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run start:dev
   ```

---

## Project Overview

Este repositorio contiene el código fuente del proyecto **"Text Agents Udemy"**. Está escrito principalmente en **TypeScript**, con algunos componentes en **JavaScript**. El objetivo de este proyecto es proporcionar un marco robusto para construir y experimentar con agentes basados en texto.

---

## Features

- Escrito en TypeScript para mayor seguridad y mantenibilidad.
- Estructura modular para facilitar la extensibilidad.
- Diseñado para el aprendizaje y la experimentación con agentes de texto.

---

## Requirements

- Node.js (recomendado v14 o superior)
- npm

---

## Contributing

¡Las contribuciones son bienvenidas! Por favor, haz un fork del repositorio y abre un pull request con tus cambios.

---

## License

Este proyecto está licenciado bajo la **MIT License**.
