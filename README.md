# Personal Expense Tracker — Full Stack Java & React Application

A complete, production-ready, full-stack **Personal Expense Tracker** built specifically for B.Tech Full Stack Development using Java lab external practical examinations and viva demonstrations.

---

## 1. Required Features Implemented & Tested

1. **Add Expense**: Form with Title, Amount, Category (`Food`, `Travel`, `Shopping`, `Other`), and Date.
2. **Display Saved Expenses**: Responsive data table listing all persisted records with action buttons.
3. **Edit & Delete**: Full in-place editing and deletion with confirmation safeguards.
4. **Total Calculation**: Calculates and displays total amount spent across all saved expenses, plus category breakdown totals.
5. **Category Filtering**: 1-click filter tabs for **Food**, **Travel**, **Shopping**, and **Other** with dynamic badges.
6. **Success & Error Feedback**: Inline visual notification banners, form field validation errors, and floating toasts.
7. **Validation Safeguards**:
   - Title must not be empty (Client & Server: `@NotBlank`).
   - Amount must be greater than zero (Client & Server: `@NotNull`, `@Positive`).
   - Category and Date must be valid.

---

## 2. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Single-page application with form, summary cards, filter tabs, and responsive table |
| **Language (FE)** | JavaScript (ES6+) | Modular React components and API services |
| **Backend** | Java 21 LTS + Spring Boot 3.2.3 | REST API architecture (Controller, Service, Repository, Model, DTO, Config) |
| **Build Tools** | Maven (`mvnw.cmd`) & npm (`npm.cmd`) | Completely self-contained, no external Maven install required |
| **API Client** | Axios | Configured with `baseURL: 'http://localhost:8080/api'` |
| **Primary Database** | H2 Database (File-Persistent) | Auto-persisted to `./data/expensedb`, includes web console at `/h2-console` |
| **Secondary Database** | MySQL 8.0 (Optional Profile) | Pre-configured in `application-mysql.properties` |
| **Styling** | Vanilla CSS3 | Modern glassmorphism, responsive grid, and smooth animations |

---

## 3. Complete Project Folder Structure

```text
Personal Expense Tracker/
├── backend/
│   ├── .mvn/
│   │   └── wrapper/
│   │       ├── maven-wrapper.jar
│   │       └── maven-wrapper.properties
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/app/
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── DataInitializer.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── ExpenseController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   ├── CategorySummaryDTO.java
│   │   │   │   │   ├── ExpenseRequestDTO.java
│   │   │   │   │   ├── ExpenseResponseDTO.java
│   │   │   │   │   ├── ExpenseSummaryDTO.java
│   │   │   │   │   └── MonthlySummaryDTO.java
│   │   │   │   ├── exception/
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── ResourceNotFoundException.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── Category.java (FOOD, TRAVEL, SHOPPING, OTHER)
│   │   │   │   │   ├── Expense.java (JPA Entity)
│   │   │   │   │   └── PaymentMethod.java (Enum)
│   │   │   │   ├── repository/
│   │   │   │   │   └── ExpenseRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── ExpenseService.java
│   │   │   │   │   └── ExpenseServiceImpl.java
│   │   │   │   └── ExpenseTrackerApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-mysql.properties
│   │   └── test/java/com/example/app/
│   │       └── ExpenseTrackerApplicationTests.java
│   ├── mvnw.cmd
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryFilter.jsx (Food, Travel, Shopping, Other)
│   │   │   ├── DeleteModal.jsx
│   │   │   ├── ExpenseForm.jsx (Add / Edit Form with Validation)
│   │   │   ├── ExpenseList.jsx (Responsive Table)
│   │   │   ├── Navbar.jsx
│   │   │   ├── SummaryCard.jsx (Total Spent across all expenses)
│   │   │   └── Toast.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 4. Database Configuration & Table Schema

### Primary Database: H2 (File-Persistent)
- **URL**: `jdbc:h2:file:./data/expensedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE`
- **Username**: `sa`
- **Password**: *(leave blank)*
- **Driver**: `org.h2.Driver`
- **Web Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/expensedb`
  - User Name: `sa`
  - Password: *(leave blank)*

### Table Structure (`expenses`)
```sql
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount DOUBLE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('FOOD','TRAVEL','SHOPPING','OTHER')),
    expense_date DATE NOT NULL,
    payment_method VARCHAR(30) CHECK (payment_method IN ('CASH','CREDIT_CARD','DEBIT_CARD','UPI','NET_BANKING')),
    notes VARCHAR(500),
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6)
);
```

---

## 5. REST API Endpoints

| Method | Endpoint | Description | Request Body | Response Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/expenses` | Retrieve all expenses (optional query filter: `?category=FOOD`) | None | `200 OK` |
| `GET` | `/api/expenses/{id}` | Retrieve single expense by ID | None | `200 OK` / `404 Not Found` |
| `POST` | `/api/expenses` | Create new expense | `ExpenseRequestDTO` JSON | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/expenses/{id}` | Update existing expense by ID | `ExpenseRequestDTO` JSON | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/expenses/{id}` | Delete expense by ID | None | `200 OK` / `404 Not Found` |
| `GET` | `/api/expenses/summary` | Retrieve total spend and analytics | None | `200 OK` |
| `POST` | `/api/expenses/seed` | Reset / re-seed sample demo data | None | `200 OK` |

---

## 6. Execution Commands (Separate Terminals)

### Terminal 1: Backend (Spring Boot)
```powershell
cd "C:\Personal Expense Tracker\backend"
java -jar target/expense-tracker-backend-1.0.0.jar
```
*(Starts on `http://localhost:8080`)*

### Terminal 2: Frontend (React + Vite)
```powershell
cd "C:\Personal Expense Tracker\frontend"
npm.cmd run dev
```
*(Starts on `http://localhost:5173/`)*

---

## 7. Local URLs

- **Frontend Web Application**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://localhost:8080/api/expenses](http://localhost:8080/api/expenses)
- **H2 Interactive Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## 8. Verification Results

All required features were executed and passed during testing:
- **Add Expense**: Verified with `POST /api/expenses` creating record.
- **Display Saved Expenses**: Verified in table with title, category, date, and currency amount.
- **Edit Expense**: Verified with `PUT /api/expenses/{id}` updating title and amount.
- **Delete Expense**: Verified with `DELETE /api/expenses/{id}` removing record.
- **Total Calculation**: Verified dynamic calculation across all saved records.
- **Category Filter**: Verified filtering by `Food`, `Travel`, `Shopping`, and `Other`.
- **Validation**: Verified rejection of empty titles and negative amounts with HTTP 400 Bad Request.
