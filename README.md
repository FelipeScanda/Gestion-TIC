🖥️ Gestión TIC

Sistema web para la gestión de préstamos de equipos tecnológicos, con roles de usuario y administrador, calendario de disponibilidad y control en tiempo real.

⸻
Tecnologías
	•	Frontend: React (Vite)
	•	Backend: Node.js + Express
	•	Base de datos: PostgreSQL + Prisma ORM
	•	Tiempo real: Socket.IO
	•	Gestión de procesos: PM2

⸻

Instalación (desde cero)

1. Clonar repositorio

git clone https://github.com/FelipeScanda/gestiontic.git
cd gestiontic


⸻

2. Backend

npm install

Crear archivo .env

DATABASE_URL="file:./dev.db"

JWT_SECRET=super_secret_key

Migraciones Prisma

npx prisma migrate deploy
npx prisma generate


⸻


Ejecutar aplicación

Modo normal

cd backend
node src/app.js

Con PM2 (recomendado)

pm2 start src/app.js --name gestiontic
pm2 save


⸻

Acceso

Desde cualquier dispositivo en la red:

http://IP_DEL_SERVIDOR:3000


⸻

HTTPS (opcional)

Se puede habilitar HTTPS usando certificados locales con mkcert.

⸻

Funcionalidades

Usuario
	•	Solicitar préstamos de equipos
	•	Cancelar solicitudes
	•	Ver calendario de disponibilidad

Administrador
	•	Aprobar / rechazar solicitudes
	•	Cancelar préstamos (incluso aprobados)
	•	Marcar como devuelto
	•	Gestión de usuarios
	•	Gestión de equipos
	•	Visualización avanzada en calendario

⸻

Tiempo real

El sistema utiliza Socket.IO para actualizar automáticamente:
	•	solicitudes
	•	estados de préstamos
	•	vistas del administrador

⸻

Requisitos
	•	Node.js 18+
	•	PostgreSQL
	•	Git

⸻

Notas
	•	Asegúrate de abrir el puerto 3000 en el firewall
	•	No subir .env, node_modules, ni certificados al repositorio

⸻

Autor

Felipe Scanda

⸻

Estado del proyecto

✔ Listo para uso en LAN
✔ Preparado para despliegue
✔ Arquitectura fullstack funcional
