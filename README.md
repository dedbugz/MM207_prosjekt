
# 🍽️ Oppskrifts-API

Dette er et enkelt API for håndtering av oppskrifter og ingredienser.  
API-et støtter CRUD-operasjoner (Create, Read, Update, Delete)

## 🌍 **Live API på Render**
🔗https://mm207-prosjekt.onrender.com


## ⚠️ Begrensninger i Firefox
Firefox støtter **ikke** PWA-installasjon på desktop. Dette betyr at installasjonsknappen **ikke vil vises** hvis du bruker Firefox.  
For å teste installasjonsfunksjonen, bruk en nettleser som **Google Chrome** eller **Microsoft Edge**, som støtter PWA.


## 🌐 **PWA-funksjonalitet**
- Appen er en **Progressive Web App (PWA)** og kan installeres på enheter.
- **Service Worker** er registrert for caching av statiske filer.
- **Appen fungerer offline** for lagrede ressurser.



## **Funksjonalitet**
- 📥 **Hente oppskrifter** – Klikk "Hent Oppskrifter" for å laste inn oppskrifter.
- ➕ **Legge til oppskrift** – Skjemaet kan åpnes og lukkes via "Legg til oppskrift"-knappen.
- 🖊 **Redigere oppskrift** – Klikk "Rediger" på en oppskrift for å oppdatere den.
- ❌ **Slette oppskrift** – Klikk "Slett" under en oppskrift for å fjerne den.
- 🔎 **Søke etter oppskrifter** – Søk etter oppskrifter basert på en ingrediens.



## **Redigering av oppskrift**
- Når du klikker **"Rediger"** på en oppskrift, åpnes redigeringsskjemaet nederst på siden.
- **NB!** Du må **scrolle ned** for å se og bruke redigeringsskjemaet.
- Etter at du har gjort endringer, trykk **"Lagre endringer"** for å oppdatere oppskriften.
- Listen med oppskrifter oppdateres automatisk etter lagring.



## **Teknologi brukt**
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js med Express
- **Database**: PostgreSQL (pg-pakke for databasehåndtering)
- **Hosting**: Render


## 📡 **API-endepunkter**
| Metode  | Endepunkt                        | Beskrivelse                          |
|---------|--------------------------------|----------------------------------|
| `GET`   | `/api/recipes`                | Henter alle oppskrifter          |
| `POST`  | `/api/recipes`                | Legger til en ny oppskrift       |
| `GET`   | `/api/recipes/:id`            | Henter en spesifikk oppskrift    |
| `PUT`   | `/api/recipes/:id`            | Oppdaterer en oppskrift          |
| `DELETE`| `/api/recipes/:id`            | Sletter en oppskrift             |
| `GET`   | `/api/recipes/search?ingredient=navn` | Søker etter oppskrifter basert på ingredienser |


## 🗄️ **Database**
- Databasen er **PostgreSQL** og hostes på **Render**.
- Tabellen `recipes` inneholder følgende felter:
  - `id` (INTEGER, primærnøkkel, auto-inkrement)
  - `name` (TEXT, ikke-null)
  - `ingredients` (ARRAY av TEXT, ikke-null)
  - `instructions` (TEXT, ikke-null)
  - `created_at` (TIMESTAMP, standardverdi `NOW()`)


favicon ikonet er lastet ned fra PNGtree
