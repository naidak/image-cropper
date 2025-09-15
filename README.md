# ImageCropper

ImageCropper je aplikacija koja omogućava upload, crop i spremanje slika.  
Sastoji se od **frontend-a (React + Vite)**, **backend-a (ASP.NET Core Web API)** i **SQL Server baze**.  
Svi dijelovi se pokreću pomoću **Docker Compose**.
---

## 1. Preduvjeti

Prije pokretanja projekta, potrebno je imati instalirano:
- [Docker](https://www.docker.com/get-started) (Docker Engine + Docker Compose)
- [Git](https://git-scm.com/downloads)

---

##2. Kloniranje repozitorija

```bash
git clone https://github.com/naidak/image-cropper.git
cd image-cropper
```

##3. Build i pokretanje

Aplikacija se pokreće pomoću Docker Compose: 

```bash
docker-compose up --build
```
ili
```bash
docker-compose build
docker-compose up
```
Ovo će:
- buildati i pokrenuti frontend na portu 3000
- buildati i pokrenuti backend na portu 5000
- pokrenuti SQL Server na portu 1433
- automatski odraditi migracije baze prilikom podizanja backend kontejnera

##4. Pristup aplikaciji
Frontend: http://localhost:3000
Backend API (Swagger): http://localhost:5000/swagger

##5. Testiranje
- Pokreni aplikaciju (docker compose up).
- Otvori Swagger na http://localhost:5000/swagger i testiraj API endpoint-e.
- Kroz frontend (React app) testiraj upload i crop slike.

##6. Troubleshooting
Ako neki kontejner ne krene, provjeri logove:
```bash
docker compose logs <ime_kontejnera>
```
Provjeri da li portovi 3000, 8080 i 1433 nisu zauzeti na tvom računaru.
