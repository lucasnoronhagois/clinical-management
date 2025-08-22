# 🏥 ClinicalCare - Medical Appointment Management System

## 📋 Description

**ClinicalCare** is a comprehensive medical appointment management system developed with modern architecture, offering a robust solution for clinics and hospitals to efficiently and securely manage patients, appointments, users, and reports.

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
- **Sequelize** - Database ORM
- **MySQL** - Relational database
- **JWT** - Authentication and authorization
- **bcrypt** - Password encryption
- **Yup** - Schema validation
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Frontend
- **React 19** - JavaScript library for interfaces
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

## 📁 Project Structure

```
clinical-care/
├── backend/
│   ├── config/           # Database and route configurations
│   ├── controllers/      # Application controllers
│   ├── middlewares/      # Authentication and validation middlewares
│   ├── models/          # Sequelize models
│   ├── routes/          # API route definitions
│   ├── schema/          # Validation schemas (Yup)
│   ├── services/        # Business logic
│   └── utils/           # Utilities
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Application pages
│   │   └── utils/       # Frontend utilities
│   └── public/          # Static files
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
cd clinical-care/backend
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
npm start
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

## 📈 Performance

- **Pagination** implemented in all listings
- **Optimized filters** for efficient search
- **Lazy loading** of components
- **HTTP response compression**
- **Frequent data caching**

## 🧪 Testing

The project is prepared for test implementation:
- **Unit tests** with Jest
- **Integration tests** for APIs
- **E2E tests** with Cypress (structure prepared)

## 📝 API Documentation

### Main Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

#### Patients
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

#### Appointments
- `GET /api/attendances` - List appointments
- `POST /api/attendances` - Create appointment
- `PUT /api/attendances/:id` - Update appointment
- `DELETE /api/attendances/:id` - Delete appointment

#### Dashboard
- `GET /api/dashboard` - Dashboard statistics

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the ISC license. See the `LICENSE` file for more details.

## 👨‍💻 Author

Developed to demonstrate full-stack development skills with Node.js, React, and MySQL.
📧 lucas.noronha.gois@gmail.com

## 📞 Support

For questions or support, contact through the channels available in the developer's profile.
📧 lucas.noronha.gois@gmail.com

---

**📖 Versão em Português**: [README.md](README.md)

**ClinicalCare** - Transforming medical appointment management with modern technology and efficiency.
