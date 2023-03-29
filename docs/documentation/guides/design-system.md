# Design System

Cómo trabajamos con el design system de Lendaas

## Creación

- Crear repo design-system-lendaas-com en cuenta GitHub Lendaas
- Copiar archivos de repo creditu-design-system de Creditú a design-system-lendaas-com
- Cambiar descripción, name, versión package, etc.
- Cambiar logo

## Publicar en npm

```bash
npm login
```

- agregar el username
- Password: ********
- email: email@email.com
- One-time-password: ****
- Antes de publicar, correr:

```bash
npm run build
```

- para publicar:

```bash
npm publish --access=public
```

- Instalar librería en otro repo:

```bash
npm i design-system-lendaas-com@latest
```
