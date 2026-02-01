# MediBook - Doctor Appointment System

A full-stack web application for managing doctor appointments, built with Next.js and Node.js.

## Features

- **User Authentication**
  - Secure login/signup for patients and doctors
  - Role-based access control
  - JWT authentication

- **Patient Features**
  - Book appointments with doctors
  - View appointment history
  - Manage personal profile
  - View doctor profiles and availability

- **Doctor Features**
  - Manage appointment schedule
  - View patient details and medical history
  - Update availability status

- **Admin Dashboard**
  - Manage users (doctors and patients)
  - View system analytics
  - Manage appointments

## Tech Stack

### Frontend (UI)
- **Framework**: Next.js 13+ (App Router)
- **UI Components**: Shadcn/UI
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Type Safety**: TypeScript

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (with Sequelize ORM)
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI (TBD)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v12 or later)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DOCTORAPPOINTMENTSYSTEM
   ```

2. **Set up the Backend**
   ```bash
   cd API
   cp .env.example .env  # Update with your database credentials
   pnpm install
   pnpm migrate  # Run database migrations
   pnpm seed     # Seed initial data (optional)
   pnpm dev      # Start development server
   ```

3. **Set up the Frontend**
   ```bash
   cd ../UI
   cp .env.example .env  # Update with your API URL
   pnpm install
   pnpm dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
DOCTORAPPOINTMENTSYSTEM/
├── API/                    # Backend server
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Express middlewares
│   ├── migrations/        # Database migrations
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── seeders/          # Database seeders
│   ├── utils/            # Utility functions
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
│
└── UI/                    # Frontend application
    ├── app/              # App router pages
    ├── components/       # Reusable components
    ├── context/          # React context providers
    ├── hooks/            # Custom React hooks
    ├── lib/              # Utility functions
    ├── public/           # Static assets
    ├── styles/           # Global styles
    └── .env             # Frontend environment variables
```

## Environment Variables

### Backend (API/.env)
```
PORT=5000
NODE_ENV=development
DB_NAME=doctor_appointment
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
```

### Frontend (UI/.env)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENV=development
```

## Available Scripts

### Backend (from API directory)
- `pnpm dev` - Start development server
- `pnpm migrate` - Run database migrations
- `pnpm seed` - Seed database with sample data
- `pnpm test` - Run tests

### Frontend (from UI directory)
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sequelize Documentation](https://sequelize.org/)
