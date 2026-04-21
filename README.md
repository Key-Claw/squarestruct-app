# squarestruct-app
Tienda online con backend y frontend conectados que actúa como intermediaria entre empresas de construcción modular y el cliente final. La plataforma permite explorar, personalizar y gestionar viviendas modulares basadas en sistemas de piezas ensamblables.


# estructura de ficheros

GLOBAL:
/ecommerce-app
│
├── backend/
├── frontend/
├── docker/
├── docs/
├── .env
└── README.md


backend/
│
├── db/
│ ├── schema.sql
│ ├── seeds.sql
│ ├── migrations/
│ └── backups/
│
├── postman/
│
├── src/
│ ├── config/
│ ├── controllers/
│ ├── services/
│ ├── routes/
│ ├── middlewares/
│ ├── utils/
│ └── app.js
│
├── tests/
├── package.json
└── server.js

/frontend
│
├── public/
├── src/
│   ├── app/           # rutas (Next 13+)
│   ├── components/    # componentes reutilizables
│   ├── layouts/       # plantillas
│   ├── pages/         # (si usáis pages router)
│   ├── services/      # llamadas a API
│   ├── hooks/         # custom hooks
│   ├── context/       # estado global
│   ├── styles/        # CSS / Bootstrap
│   ├── utils/
│   └── types/
│
├── package.json
└── next.config.js
