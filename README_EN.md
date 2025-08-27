# 🏥 ClinicalCare - Medical Appointment Management System

## 📋 Description

**ClinicalCare** is a comprehensive medical appointment management system developed with **TypeScript**, React (Frontend) and Node.js/Express (Backend), offering a robust solution for clinics and hospitals to efficiently and securely manage patients, appointments, users, and reports.

## 🚀 TypeScript Migration

This project has been fully migrated to TypeScript to provide:

- **Type Safety**: Compile-time error detection
- **Better IntelliSense**: More accurate autocomplete
- **Safe Refactoring**: Safer code changes
- **Living Documentation**: Types serve as documentation
- **Better Maintainability**: More readable and organized code

## 🚀 Key Features

### 🔐 Authentication and Authorization System
- **JWT (JSON Web Tokens)** for secure authentication
- **Role-based system** with different access levels
- **Route protection** with authentication middleware
- **Data validation** with Yup Schema Validation
- **Password encryption** with bcrypt

### 🏢 Multi-Company Management
- **Support for multiple companies** in a single instance
- **Company selection** after login for administrator users
- **Data isolation** by company
- **Complete business information management**

### 👥 User Management
- **Registration and editing** of system users
- **Different profiles** (Administrator, Receptionist, etc.)
- **Access control** based on roles
- **Granular permission management**

### 👨‍⚕️ Patient Management
- **Complete patient registration** with validations
- **Advanced search and filters**
- **Pagination** for better performance
- **CPF validation** and personal data
- **Automatic linking** to selected company

### 📍 Location Management
- **Registration of appointment locations**
- **Hierarchical organization** of spaces
- **Location availability control**

### 🏥 Appointment Management
- **Appointment scheduling**
- **Status control** (confirmed, pending, completed)
- **Patient-location-professional linking**
- **Complete appointment history**
- **Advanced filters** by date, patient, location

### 📊 Dashboard and Reports
- **Interactive dashboard** with real-time statistics
- **Period filters** (today, week, month, year)
- **Appointment and patient charts**
- **Customizable reports**
- **Data export**

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Sequelize** - Database ORM
- **MySQL** - Relational database
- **JWT** - Authentication and authorization
- **bcrypt** - Password encryption
- **Yup** - Schema validation
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Frontend
- **React 19** - JavaScript library for interfaces
- **TypeScript** - Type-safe JavaScript
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **React Bootstrap** - React + Bootstrap components
- **Vite** - Build tool and dev server

### Architecture
- **MVC Architecture** (Model-View-Controller)
- **Separation of concerns** (Controllers, Services, Models)
- **Middleware pattern** for authentication and validation
- **RESTful API** with standardized endpoints

## 🧪 Unit Testing

The project features a **complete unit testing solution** implemented with Jest and TypeScript, ensuring code quality and reliability:

### ✅ Test Coverage
- **8 Services tested** with 100% coverage
- **115 tests** implemented and working
- **Tested methods**: `find`, `list`, `create`, `update`, `delete`, `createMultiple`
- **Specific scenarios**: authentication, validations, error handling

### 🎯 Tested Services
- **UserService** - User management
- **PatientService** - Patient management  
- **CompanyService** - Company management
- **PlaceService** - Location management
- **AttendanceService** - Appointment management
- **AuthService** - Authentication and authorization
- **DashboardService** - Statistics and reports
- **ReportService** - Report generation

### 🚀 Test Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific tests
npm test -- --testPathPattern="userService"
```

### 📊 Testing Benefits
- **Code Quality**: Guarantee of correct operation
- **Safe Refactoring**: Changes with confidence
- **Living Documentation**: Tests as documentation
- **Bug Detection**: Quick problem identification
- **Reliable Development**: Solid foundation for evolution

### 📚 Detailed Documentation
- **[SETUP_TESTS.md](backend/SETUP_TESTS.md)**: Setup and execution guide
- **[TESTING.md](backend/TESTING.md)**: Complete documentation and concepts

## 📁 Project Structure

```
clinical-management/
├── backend/                 # API Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/         # Database and route configurations
│   │   ├── controllers/    # Application controllers
│   │   ├── middlewares/    # Authentication and validation middlewares
│   │   ├── models/         # Sequelize models with TypeScript
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── schema/         # Validation schemas (Yup)
│   │   └── utils/          # Utilities
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json
├── frontend/               # React + TypeScript application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Application pages
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Frontend utilities
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json
└── README.md
```

## 🗄️ Data Model

### Main Entities
- **Users**: System users with different roles
- **Companies**: Registered companies/clinics
- **Patients**: Patients linked to companies
- **Places**: Appointment locations
- **Attendances**: Appointments and consultations
- **Reports**: Reports and statistics

### Relationships
- Users can belong to a company
- Patients are linked to a company
- Appointments connect patients, locations, and users
- Audit system with timestamps

## 🔧 Installation and Configuration

### Prerequisites
- Node.js (version 18 or higher)
- MySQL (version 8.0 or higher)
- npm or yarn

### Backend

1. **Clone the repository**
```bash
git clone <repository-url>
cd clinical-management/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the backend root:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=clinical_care_db
JWT_SECRET=your_jwt_secret_key
```

4. **Configure the database**
```sql
CREATE DATABASE clinical_care_db;
```

5. **Run the server**
```bash
# Development
npm run dev

# Production
npm run build:secure  # Compile, minify and obfuscate
npm start            # Run the compiled server
```

### Frontend

1. **Navigate to the frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure proxy**
The frontend is already configured to proxy requests to `http://localhost:3000`

4. **Run the development server**
```bash
npm run dev
```

## 📝 Available Scripts

### Backend
- `npm run dev`: Runs the server in development mode with hot reload
- `npm run build`: Compiles TypeScript to JavaScript
- `npm run build:secure`: Compiles, minifies and obfuscates code for production
- `npm start`: Runs the compiled server

### Frontend
- `npm run dev`: Runs the development server
- `npm run build`: Builds the project for production
- `npm run lint`: Runs TypeScript/ESLint linter

## 🚀 How to Use

1. **Access the application** at `http://localhost:5173`
2. **Login** with your credentials
3. **Select a company** (if you're an administrator)
4. **Navigate through the modules**:
   - Dashboard: View statistics
   - Patients: Manage patient records
   - Appointments: Schedule and manage appointments
   - Locations: Configure appointment locations
   - Users: Manage system users
   - Reports: Access customized reports

## 🔒 Security

- **JWT Authentication** with secure tokens
- **Password encryption** with bcrypt
- **Input validation** with Yup schemas
- **CORS protection** configured
- **Authentication middleware** on all protected routes
- **Input data sanitization**
- **Code minification** for production optimization
- **Code obfuscation** against reverse engineering
- **Conditional logging** only in development

## 🛡️ Secure Build for Production

### **npm run build:secure**
This command executes a complete code protection process:

1. **TypeScript Compilation** → JavaScript
2. **Minification** → Reduces code size
3. **Obfuscation** → Protects against reverse engineering

### **Result:**
- ✅ **41 files** processed
- ✅ **Optimized code** for production
- ✅ **Complete protection** against code analysis
- ✅ **Logs removed** automatically

## 📈 Performance

- **Pagination** implemented in all listings
- **Optimized filters** for efficient search
- **Lazy loading** of components
- **HTTP response compression**
- **Frequent data caching**

## 🧪 Testing

The project has **complete unit tests** implemented:
- **✅ Unit tests** with Jest (100% implemented)
- **✅ 8 Services tested** with complete coverage
- **✅ 115 functional tests** running
- **🔄 Integration tests** (next steps)
- **🔄 E2E tests** with Cypress (next steps)

## 📝 API Documentation

### Main Endpoints

#### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration (admin only)
- `POST /change-password` - Change password
- `POST /reset-password` - Reset password

#### Companies (`/api/companies`)
- `GET /` - List companies
- `GET /:id` - Get company
- `POST /` - Create company
- `PUT /:id` - Update company
- `DELETE /:id` - Delete company

#### Patients (`/api/patients`)
- `GET /` - List patients
- `GET /:id` - Get patient
- `POST /` - Create patient
- `PUT /:id` - Update patient
- `DELETE /:id` - Delete patient

#### Places (`/api/places`)
- `GET /` - List places
- `GET /:id` - Get place
- `POST /` - Create place
- `PUT /:id` - Update place
- `DELETE /:id` - Delete place

#### Appointments (`/api/attendances`)
- `GET /` - List appointments
- `GET /:id` - Get appointment
- `POST /` - Create appointment
- `PUT /:id` - Update appointment
- `PUT /:id/confirm` - Confirm appointment
- `PUT /:id/finish` - Finish appointment
- `DELETE /:id` - Delete appointment

#### Users (`/api/users`)
- `GET /` - List users
- `GET /:id` - Get user
- `POST /` - Create user
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user

#### Dashboard (`/api/dashboard`)
- `GET /statistics` - Dashboard statistics

#### Reports (`/api/reports`)
- `GET /attendances` - Attendance reports by professional

## ✅ Implemented Features

### Backend (100% TypeScript)
- **Authentication**: Login, registration, password change, password reset
- **Users**: Complete CRUD with validation
- **Companies**: Complete CRUD with validation
- **Patients**: Complete CRUD with validation
- **Places**: Complete CRUD with validation
- **Appointments**: Complete CRUD with validation
- **Dashboard**: Real-time statistics
- **Reports**: Professional attendance reports

### Frontend (100% TypeScript)
- **Authentication**: Login and logout
- **Company Selection**: Interface to choose company
- **Dashboard**: Statistics visualization
- **Patient Management**: Complete CRUD
- **Appointment Management**: Complete CRUD
- **User Management**: Complete CRUD (admin only)
- **Company Management**: Complete CRUD (admin only)
- **Place Management**: Complete CRUD
- **Reports**: Report visualization

### Yup Validation (100% Implemented)
- **loginSchema**: Login validation
- **userSchema**: User validation
- **changePasswordSchema**: Password change validation
- **resetPasswordSchema**: Password reset validation
- **patientSchema**: Patient validation
- **companySchema**: Company validation
- **placeSchema**: Place validation
- **attendanceSchema**: Appointment validation

## 🔄 Project Status

### ✅ Completed
- [x] Complete TypeScript migration
- [x] Yup validation in all routes
- [x] JWT authentication implemented
- [x] Complete CRUD for all entities
- [x] Functional dashboard
- [x] Reporting system
- [x] Responsive interface
- [x] Security middlewares
- [x] Code minification and obfuscation
- [x] Conditional logging by environment
- [x] **Unit tests with Jest (100% implemented)**
- [x] **Test coverage for 8 Services**
- [x] **115 functional tests**

### 🚧 Next Steps
- [ ] Integration tests
- [ ] E2E tests with Cypress
- [ ] API documentation with Swagger
- [ ] Redis caching
- [ ] Performance monitoring
- [ ] Automated deployment

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the ISC license. See the `LICENSE` file for more details.

## 👨‍💻 Author

Developed to demonstrate full-stack development skills with Node.js, React, TypeScript, and MySQL.

## 📧 Contact

**lucas.noronha.gois@gmail.com**

## 📞 Support

For questions or support, contact through the channels available in the developer's profile.

---

**📖 Portuguese Version**: [README.md](README.md)

**ClinicalCare** - Transforming medical appointment management with modern technology, TypeScript, and efficiency.
