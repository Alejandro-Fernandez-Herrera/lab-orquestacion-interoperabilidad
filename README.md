# Laboratorio Orquestación e Interoperabilidad

Sistema de tres capas orquestado con Docker Compose, desarrollado como laboratorio del curso **Desarrollo de Software II** — Universidad del Valle (2026-1).

---

## Descripción

Este laboratorio implementa una arquitectura de tres capas completamente containerizada, donde cada componente corre en su propio contenedor Docker y se comunica con los demás a través de una red interna gestionada por Docker Compose:

- **Capa de presentación** — Frontend React servido por Nginx
- **Capa lógica** — API REST construida con Django REST Framework (Python)
- **Capa de datos** — Base de datos MySQL 8.0 con Adminer como cliente visual

El sistema expone operaciones CRUD completas para la gestión de categorías y productos de una tienda en línea (Superstore).

---

## Stack tecnológico

| Capa | Tecnología | Puerto |
|------|-----------|--------|
| Presentación | React + Vite + Nginx | 8085 |
| Lógica | Django REST Framework | 4000 |
| Datos | MySQL 8.0 | 3306 |
| Admin DB | Adminer 4.8.1 | 8080 |

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- WSL2 habilitado (si usas Windows)
- Integración WSL2 activada en Docker Desktop (`Settings → Resources → WSL Integration`)

---

## Cómo levantar el sistema

**1. Clona el repositorio:**

```bash
git clone https://github.com/Alejandro-Fernandez-Herrera/lab-orquestacion-interoperabilidad.git
cd lab-orquestacion-interoperabilidad
```

**2. Crea el archivo `.env` con las variables de entorno:**

```bash
cat > .env << 'EOF'
MYSQL_ROOT_PASSWORD=rootunivalle
MYSQL_DATABASE=mystore
MYSQL_USER=fredyball
MYSQL_PASSWORD=profefredy
MYSQL_HOST=bigstoredb
MYSQL_PORT=3306
URL=0.0.0.0:4000
EOF
```

> ⚠️ El archivo `.env` está excluido del repositorio por seguridad. 

**3. Levanta todos los servicios:**

```bash
docker compose up
```

Docker va a construir las imágenes de Django y React automáticamente la primera vez. El proceso puede tardar varios minutos. Cuando todos los servicios estén estables, verifica su estado:

```bash
docker compose ps
```

Deberías ver los 4 servicios con status `Up`, y `bigstoredb` con status `Up (healthy)`, lo que indica que MySQL pasó su healthcheck y está listo para recibir conexiones.

---

## Acceso a los servicios

| Servicio | URL |
|----------|-----|
| Frontend (Superstore) | http://localhost:8085 |
| API REST (Django) | http://localhost:4000 |
| Adminer (gestor DB) | http://localhost:8080 |

**Credenciales de Adminer:**

```
System:   MySQL
Server:   bigstoredb
Username: fredyball
Password: profefredy
Database: mystore
```

---

## API REST — Endpoints disponibles

La API expone operaciones CRUD para dos recursos: `categories` y `products`.

### Categorías

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| `GET` | `/categories/` | Listar todas las categorías | 200 OK |
| `GET` | `/categories/{id}` | Obtener categoría por ID | 200 OK |
| `POST` | `/categories/` | Crear una nueva categoría | 201 Created |
| `PUT` | `/categories/{id}` | Actualizar una categoría | 200 OK |
| `DELETE` | `/categories/{id}` | Eliminar una categoría | 204 No Content |

**Ejemplo de body para POST/PUT:**

```json
{
  "name": "Electrónica",
  "description": "Dispositivos y accesorios electrónicos"
}
```

> ⚠️ El campo `name` tiene una restricción de máximo 20 caracteres definida en el modelo Django.

---

## Arquitectura Docker Compose

```
┌─────────────────────────────────────────────────────┐
│                  Docker Network                     │
│                                                     │
│  mystore_frontend ──► mystore_ms ──► bigstoredb     │
│  (React/Nginx)       (Django)        (MySQL)        │
│       :80               :4000          :3306        │
│                                                     │
│  adminer ──────────────────────────► bigstoredb     │
│  (Adminer)                           (MySQL)        │
│    :8080                                            │
└─────────────────────────────────────────────────────┘
```

El servicio `mystore_ms` usa `condition: service_healthy` en su `depends_on`, lo que garantiza que Django no intente conectarse a MySQL hasta que la base de datos esté completamente lista y aceptando conexiones — eliminando la condición de carrera (race condition) que ocurre cuando los contenedores dependen entre sí.

---

## Tarea implementada

El componente de presentación original solo permitía **crear** categorías mediante un formulario. Como parte del laboratorio, se modificó el archivo `mystore_frontend/src/App.jsx` para que el frontend también **liste todas las categorías** existentes de forma dinámica.

Los cambios implementados fueron:

- Se agregó el hook `useEffect` de React para hacer un `GET /categories/` automáticamente al cargar la página.
- Se agregó un nuevo estado `categories` que almacena el array de categorías recibido desde la API.
- Se implementó la función `fetchCategories()` reutilizable, que se invoca tanto al montar el componente como después de crear una nueva categoría — logrando que la lista se actualice en tiempo real sin recargar la página.
- Se agregó la sección visual de lista de categorías debajo del formulario.

---

## Estructura del repositorio

```
lab-orquestacion-interoperabilidad/
├── bigstore_ms/          # Backend Django REST Framework
│   ├── Dockerfile
│   ├── requirements.txt
│   └── ...
├── mystore_frontend/     # Frontend React + Vite
│   ├── Dockerfile
│   ├── src/
│   │   └── App.jsx       # ← Modificado en la tarea del lab
│   └── ...
├── docker-compose.yml    # Orquestación de los 4 servicios
├── .gitignore
└── README.md
```

---

## Detener los servicios

```bash
# Detener sin eliminar contenedores ni volúmenes
docker compose stop

# Detener y eliminar contenedores (conserva el volumen de MySQL)
docker compose down

# Detener y eliminar TODO incluyendo los datos de MySQL
docker compose down -v
```

---

## Autor

**Alejandro Fernández Herrera**  
Estudiante — Tecnología en desarrollo de Software  
Universidad del Valle · Curso Desarrollo de Software II (2026-1)  
GitHub: [@Alejandro-Fernandez-Herrera](https://github.com/Alejandro-Fernandez-Herrera)

---

## Créditos

Código base del sistema proporcionado por el profesor **Fredy** ([@fredyunivalle](https://github.com/fredyunivalle)) como material del laboratorio de Orquestación e Interoperabilidad del curso Desarrollo de Software II.
