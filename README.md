# ImageCropper

ImageCropper is an application that enables uploading, cropping, and saving images.  
It consists of a **frontend (React + Vite)**, **backend (ASP.NET Core Web API)**, and **SQL Server database**.  
All components are orchestrated with **Docker Compose**.

---

# 1. Prerequisites

Before running the project, make sure you have installed:
- [Docker](https://www.docker.com/get-started) (Docker Engine + Docker Compose)
- [Git](https://git-scm.com/downloads)

---

# 2. Clone the Repository

```bash
git clone https://github.com/naidak/image-cropper.git
cd image-cropper
```

---

# 3. Build and Run

The application is started with Docker Compose: 

```bash
docker-compose up --build
```
or
```bash
docker-compose build
docker-compose up
```

This will:
- build and run the frontend on port 3000
- build and run the backend on port 5000
- start SQL Server on port 1433
- automatically run database migrations when the backend container is started
  
---

# 4. Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend API (Swagger): [http://localhost:5000/swagger](http://localhost:5000/swagger)

---

# 5. Testing

- Start the application (`docker compose up`).
- Open Swagger at [http://localhost:5000/swagger](http://localhost:5000/swagger) and test the API endpoints.
- Use the frontend (React app) to test image upload and cropping.

---

# 6. Troubleshooting

If a container does not start, check the logs:
```bash
docker compose logs <container_name>
```
Make sure that ports 3000, 5000, and 1433 are not already in use on your machine.

---
