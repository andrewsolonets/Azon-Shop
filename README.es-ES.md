

# Azon Shop

Sitio web de comercio electrónico construido con el moderno t3-stack (typescript, drizzle, trpc, next.js app router)
(ver v1 para la implementación anterior de t3-stack con prisma)

## Características

- Carrito totalmente funcional y persistente
- Desplazamiento infinito (infinite scroll)
- Sistema de calificaciones
- Perfil de usuario con historial de pedidos
- Finalización de compra (Checkout) con Stripe
- BD personalizada con pedidos conectados a Stripe
- Autenticación con Clerk
- Búsqueda con autocompletado de Algolia
- Descuentos de productos e historial de precios
- Pruebas E2E con Cypress

## Migración de pages a app router

La versión actual fue migrada para usar app router junto con drizzle ORM y clerk auth. La rama v1 se conserva como referencia, construida con pages router, prisma y next auth.

## Variables de Entorno

Para ejecutar este proyecto, deberás agregar las variables de entorno de .env.example a tu archivo .env

## Ejecutar Localmente

Clona el proyecto

```bash
  git clone https://github.com/andrewsolonets/Azon-Shop.git
```

Ve al directorio del proyecto

```bash
  cd Azon-Shop
```

Instala las dependencias

```bash
  npm install
```

Conecta a tu base de datos, actualiza la integración de drizzle si no usas PostgreSQL

```bash
in .env
  POSTGRES_URL=
```

Agrega todas las variables al .env

## Configuración de Algolia

1. Ve a `algoliaSeed.ts` y cambia `"azon1"` por el nombre de tu índice:

   ```typescript
   await client.saveObjects({ indexName: "azon1", objects: objectsToAdd });
   ```

2. Ve a `Search.tsx` y cambia:

   - `sourceId: "AzonShop"` por el nombre de tu aplicación en Algolia.
   - `indexName: "azon1"` por tu índice.

## Poblar la Base de Datos

Una vez que hayas completado la configuración de Algolia y hayas agregado las variables de entorno necesarias, procede a poblar tu base de datos con productos.

**Poblar la Base de Datos:** Ejecuta los siguientes comandos en tu terminal:

```bash
 npm run db:productSeed
```

```bash
 npm run db:pricingSeed
```

```bash
 npm run db:ratingsSeed
```

```bash
 npm run db:algoliaSeed
```

### Verificar los Cambios

Después de que se complete el proceso de poblar la base de datos:

- **Panel de Algolia:** Visita el panel de control de Algolia para ver tus datos indexados según la semilla realizada.

- **Drizzle Studio:** Accede a Drizzle Studio usando el siguiente comando:

  ```bash
  npm run db:studio
  ```

  Usa Drizzle Studio para examinar tu base de datos y verificar los datos poblados.

Inicia el servidor

```bash
  npm run dev
```

# Stack Tecnológico

## V.2 (rama principal)

**Cliente:** React, Next.js (app router), Shadcn, React Query, TailwindCSS, Clerk.
**Servidor:** Next.js, trpc, Drizzle ORM, PostgreSQL (Vercel DB).

## V.1 - stack t3 anterior

**Cliente:** React, React Query, TailwindCSS, nextauth.js.
**Servidor:** Next.js, trpc, prisma, planetscale.
(ver rama v1)

## Más Información

Para aprender más sobre el [T3 Stack](https://create.t3.gg/), echa un vistazo a los siguientes recursos:

- [Documentación](https://create.t3.gg/)
- [Aprende el T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Consulta estos geniales tutoriales

Puedes consultar el [repositorio de GitHub de create-t3-app](https://github.com/t3-oss/create-t3-app) — ¡tus comentarios y contribuciones son bienvenidos!

## ¿Cómo despliego esto?

Sigue nuestras guías de despliegue para [Vercel](https://create.t3.gg/en/deployment/vercel) y [Docker](https://create.t3.gg/en/deployment/docker) para obtener más información.

## TODO

- [ ] Implementar pruebas e2e con Cypress
  - [x] Escribir pruebas para la barra de navegación
  - [x] Probar agregar un producto al carrito.
  - [x] Probar menú móvil
  - [x] Página de producto único
    - [x] Probar botones de cantidad
- [ ] Función de compra rápida con configuración de modal de next.js
- [ ] Agregar metadatos a cada ruta
- [x] Migrar de Prizma a Drizzle ORM
- [x] Migrar de pages a app router (next js)
- [x] Usar shadcn donde sea razonable
- [x] Integrar Sentry para seguimiento de errores
- [x] Búsqueda con Algolia
- [x] Función de descuentos: componente de descuento
- [x] Función de descuentos: usar precio descontado en checkout y carrito
- [x] Descripción del producto usando accordion de shadcn
