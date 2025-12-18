# 📚 Akihabara Manga Store

Una tienda online moderna de manga construida con Astro, Preact y Tailwind CSS.

## 🚀 Características

- **Catálogo de Manga**: Sistema completo de búsqueda y filtrado de mangas
- **Carrito de Compras**: Gestión de productos con nanostores
- **Dashboard**: Panel de administración con gráficos y estadísticas
- **Comunidad**: 
  - Discusiones activas con paginación
  - Sistema de reseñas
  - Eventos con registro de participantes
  - Recomendaciones mensuales con sistema de votación
- **Modo Claro/Oscuro**: Toggle de tema con persistencia en localStorage
- **API Integration**: Integración con Jikan API para obtener datos e imágenes de manga
- **Responsive Design**: Completamente adaptable a móviles y tablets

## 🛠️ Tecnologías

- **Framework**: [Astro](https://astro.build/) 4.x
- **UI Components**: [Preact](https://preactjs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Nanostores](https://github.com/nanostores/nanostores)
- **TypeScript**: Para type safety
- **Fuentes**: Inter (sans-serif), Poppins (display)

## 📦 Instalación
<!--  -->
### Requisitos previos

- Node.js 18+ 
- npm, pnpm o yarn

### Pasos

1. **Clonar el repositorio**
git clone <tu-repositorio>
cd manga-store


2. **Instalar dependencias**
npm install


3. **Iniciar servidor de desarrollo**
npm run dev


El proyecto estará disponible en `http://localhost:4321`

## 📁 Estructura del Proyecto

/
├── public/ # Archivos estáticos
├── src/
│ ├── components/ # Componentes reutilizables
│ │ ├── Navigation.astro
│ │ ├── Footer.astro
│ │ ├── ThemeToggle.astro
│ │ ├── CartWidget.preact.tsx
│ │ ├── EventButton.preact.tsx
│ │ ├── SearchBar.preact.tsx
│ │ └── ...
│ ├── layouts/ # Layouts de página
│ │ ├── BaseLayout.astro
│ │ └── DashboardLayout.astro
│ ├── pages/ # Páginas (rutas)
│ │ ├── index.astro
│ │ ├── tienda.astro
│ │ ├── dashboard.astro
│ │ ├── comunidad.astro
│ │ ├── contacto.astro
│ │ └── sobre-nosotros.astro
│ ├── stores/ # Estado global
│ │ └── cartStore.ts
│ └── styles/ # Estilos globales
│ └── global.css
├── tailwind.config.mjs
├── astro.config.mjs
└── package.json


## 🎨 Configuración de Colores

### Primary (Azul)
- 500: `#0ea5e9`
- 600: `#0284c7`

### Secondary (Magenta)
- 500: `#d946ef`
- 600: `#c026d3`

### Dark (para modo oscuro)
- 800: `#1f2937`
- 900: `#111827`

## 🌓 Modo Oscuro (WIP)

**Nota sobre el problema del modo oscuro:** Basándome en los logs, el JavaScript funciona correctamente (la clase `dark` se añade/quita), pero los colores no cambian. Probablemente se debe a que después de limpiar el cache, hay un error de importaciones en `ShoppingCart.preact.tsx` que impide que el proyecto compile.

El proyecto incluye un sistema de modo claro/oscuro:

- **Toggle flotante**: Botón en la esquina inferior derecha
- **Persistencia**: Guarda preferencia en localStorage
- **Sin flash**: Previene parpadeo al cargar
- **Transiciones suaves**: Animaciones de 300ms

Para personalizar colores en modo oscuro, usa clases `dark:` de Tailwind:

<div class="bg-white dark:bg-dark-800 text-dark-900 dark:text-white"> Contenido adaptable </div> ```

🔧 Scripts Disponibles
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Limpiar cache (si hay problemas)
rm -rf .astro node_modules/.vite dist

📄 Páginas Principales
🏠 Inicio (/)
Landing page con hero, productos destacados y categorías

🛒 Tienda (/tienda)
Catálogo completo con filtros y búsqueda

📊 Dashboard (/dashboard)
Panel administrativo con:

Estadísticas de ventas

Gráficos interactivos

Gestión de inventario

👥 Comunidad (/comunidad)
Sección social con:

Discusiones paginadas (3 por página)

Sistema de reseñas con estrellas

Eventos con registro de participantes

Recomendaciones con sistema de votos

📞 Contacto (/contacto)
Formulario de contacto y mapa

ℹ️ Sobre Nosotros (/sobre-nosotros)
Información de la tienda

🧩 Componentes Interactivos
EventButton
Botón para registrarse/desregistrarse en eventos con contador de participantes

Sistema de Likes
Sistema de votación en recomendaciones con toggle +1/-1

Paginación
Sistema de paginación estático con JavaScript vanilla

CartWidget
Widget del carrito con contador de items

🌐 API Externa
El proyecto consume la Jikan API (MyAnimeList):

Endpoint: https://api.jikan.moe/v4/manga/{id}

Obtiene imágenes y datos de manga reales

IDs de ejemplo: Frieren (126287), Dandadan (135496), Sakamoto Days (131334)

⚠️ Problemas Conocidos
Si el servidor no inicia o hay errores de hidratación:

1. Limpiar cache:
rm -rf .astro node_modules/.vite

2. Verificar imports en ShoppingCart.preact.tsx (debe importar correctamente de cartStore.ts)

Recargar sin cache: Ctrl + Shift + R

🤝 Contribuir
Fork el proyecto

2. Crea una rama (git checkout -b feature/nueva-funcionalidad)

3. Commit cambios (git commit -m 'Añadir nueva funcionalidad')

4. Push a la rama (git push origin feature/nueva-funcionalidad)

5. Abre un Pull Request

📝 Licencia
Este proyecto es de código abierto.

👨‍💻 Autor
Desarrollado durante una sesión de pair programming en diciembre 2025.