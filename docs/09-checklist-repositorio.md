# Checklist de repositorio

Esta guía sirve para revisar el proyecto antes de subirlo a GitHub o compartirlo en un ZIP.

## 1. Archivos que sí deben subirse

```txt
src/
public/
docs/
README.md
.env.example
.gitignore
package.json
package-lock.json
vite.config.js
eslint.config.js
vercel.json
index.html
```

## 2. Archivos que no deben subirse

```txt
node_modules/
dist/
.env
*.log
.vite/
.vite-temp/
.DS_Store
.idea/
.vscode/ configuración personal
```

## 3. Por qué no subir `node_modules`

`node_modules`:

- Pesa demasiado.
- Depende del sistema operativo.
- Puede causar errores de dependencias nativas.
- Se regenera con `npm install`.

## 4. Por qué no subir `dist`

`dist` es el resultado del build. Debe generarse cuando se despliega:

```bash
npm run build
```

En GitHub normalmente solo se sube el código fuente.

## 5. Por qué no subir `.env`

`.env` puede contener:

- URLs privadas.
- Tokens.
- Credenciales.
- Configuración local.

Solo debe subirse:

```txt
.env.example
```

## 6. Revisar `.gitignore`

El `.gitignore` debe incluir como mínimo:

```gitignore
node_modules
dist
*.log
*.local
.env
```

En este proyecto ya se ignoran varios archivos generados. Se recomienda agregar explícitamente `.env` si no está incluido por `*.local`.

## 7. Limpiar archivos ya rastreados por Git

Si `node_modules`, `dist` o `.env` ya fueron agregados al repo, no basta con editar `.gitignore`. Debes quitarlos del índice de Git:

```bash
git rm -r --cached node_modules dist
git rm --cached .env
git rm --cached *.log
git add .gitignore
git commit -m "Clean generated and local files"
```

Si algún comando falla porque el archivo no está rastreado, continúa con los demás.

## 8. Comandos de verificación antes del commit

```bash
npm install
npm run lint
npm run build
```

Luego revisa el estado de Git:

```bash
git status
```

No deberían aparecer:

```txt
node_modules/
dist/
.env
*.log
```

## 9. Checklist antes de subir a GitHub

- [ ] El proyecto instala con `npm install`.
- [ ] El lint pasa con `npm run lint`.
- [ ] El build pasa con `npm run build`.
- [ ] `.env` no está en Git.
- [ ] `.env.example` sí está actualizado.
- [ ] `node_modules` no está en Git.
- [ ] `dist` no está en Git.
- [ ] No hay logs subidos.
- [ ] El README explica instalación, variables y scripts.
- [ ] La documentación en `docs/` está actualizada.
- [ ] El repo tiene una descripción clara.

## 10. Comandos sugeridos para primer commit limpio

```bash
git init
git add .
git status
git commit -m "Initial frontend documentation and source"
git branch -M main
git remote add origin <url-del-repositorio>
git push -u origin main
```

## 11. Comandos sugeridos si el remoto ya existe

```bash
git remote -v
git add .
git status
git commit -m "Improve frontend documentation"
git push
```

## 12. Recomendación para compartir ZIP

Antes de comprimir, excluye:

```txt
.git/
node_modules/
dist/
.env
*.log
```

Ejemplo en Linux/macOS:

```bash
zip -r support-ticket-frontend.zip support-ticket-frontend \
  -x "*/.git/*" \
  -x "*/node_modules/*" \
  -x "*/dist/*" \
  -x "*/.env" \
  -x "*.log"
```

En Windows puedes crear el ZIP desde una copia limpia del proyecto.
