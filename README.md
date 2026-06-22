# Wavefront Studio Frontend

Next.js + Tailwind frontend for the Django floor replacement backend.

## Run

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend expects the backend at:

```text
http://localhost:8000
```

To change it, create `.env.local`:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
