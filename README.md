# FormNest

A modern, full-stack form builder application for creating beautiful forms, collecting responses, and analyzing data.

## Features

- **Form Builder** - Intuitive drag-and-drop interface to create forms
- **Multiple Field Types** - Text, textarea, email, phone, number, date, dropdown, checkbox, radio, file upload, and rating fields
- **Header Images** - Add custom header images to your forms
- **Real-time Preview** - See your form as you build it
- **Response Management** - View, export to Excel, and delete responses
- **User Authentication** - Secure login and registration
- **Dashboard** - Manage all your forms in one place
- **Edit & Delete Forms** - Full CRUD operations on forms

## Tech Stack

**Frontend:**
- React 19
- React Router
- Tailwind CSS 4
- Lucide React (icons)
- Axios
- XLSX (Excel export)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Express Validator

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/madnansultandotme/FormNest.git
cd FormNest
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Configure environment variables

Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Run the application

Start the server:
```bash
cd server
npm run dev
```

Start the client (in a new terminal):
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
FormNest/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Login, Register
│   │   │   ├── dashboard/  # Dashboard
│   │   │   ├── forms/      # Form builder, preview, responses
│   │   │   └── layout/     # Navbar, Alert, NotFound
│   │   ├── context/        # Auth & Alert context
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── server.js           # Entry point
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth` - Get authenticated user

### Forms
- `GET /api/forms` - Get all user forms
- `GET /api/forms/:id` - Get form by ID
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Responses
- `POST /api/responses/submit/:formId` - Submit form response
- `GET /api/responses/:formId` - Get form responses
- `DELETE /api/responses/:id` - Delete response

## Color Scheme

The app uses a Charcoal + Green theme optimized for data & analytics:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#16A34A` | Buttons, links, accents |
| Secondary | `#14532D` | Gradients, dark accents |
| Accent | `#DCFCE7` | Backgrounds, hover states |
| Background | `#F9FAFB` | Page background |
| Card | `#FFFFFF` | Card backgrounds |
| Text Primary | `#1F2937` | Main text |
| Text Muted | `#6B7280` | Secondary text |
| Border | `#E5E7EB` | Borders, dividers |

## License

MIT License

## Maintainer & Contact

- **Email:** info.adnansultan@gmail.com
- **GitHub:** [madnansultandotme](https://github.com/madnansultandotme)
- **LinkedIn:** [dev-madnansultan](https://www.linkedin.com/in/dev-madnansultan)
