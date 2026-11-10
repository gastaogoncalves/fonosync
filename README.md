# FonoSync - Front-end

Front-end do FonoSync em React + Vite + Tailwind.

## Rodando com o back-end

O front conversa com a API do repositório `fonosync-backend-api`.

1. Suba o back-end (porta 8080):

   ```
   ./mvnw spring-boot:run
   ```

2. No front, instale e rode:

   ```
   npm install
   npm run dev
   ```

3. Abra o endereço que aparecer no terminal (normalmente `http://localhost:5173`).

Por padrão o front procura a API em `http://localhost:8080`. Para usar outro endereço, copie o `.env.example` para `.env` e troque o `VITE_API_URL`.

## Comandos

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: gera a versão final em `dist`
- `npm run lint`: verifica o código
