# Task List: Swedish Car Sales Platform (DinBilDeal)

## Relevant Files

### Backend - Laravel Models and Migrations
- `database/migrations/create_leads_table.php` - Lead management database schema
- `database/migrations/create_cars_table.php` - Car inventory and listings schema
- `database/migrations/create_deals_table.php` - Deal tracking and pipeline schema
- `database/migrations/create_needs_analysis_table.php` - Customer needs analysis responses
- `database/migrations/create_car_images_table.php` - Car image management
- `database/migrations/create_lead_activities_table.php` - Activity tracking for CRM
- `app/Models/Lead.php` - Lead model with relationships and scopes
- `app/Models/Car.php` - Car model with specifications and filtering
- `app/Models/Deal.php` - Deal model with status tracking
- `app/Models/NeedsAnalysis.php` - Needs analysis model with scoring logic
- `app/Models/User.php` - Extended user model with roles and permissions

### Backend - Controllers and API
- `app/Http/Controllers/LeadController.php` - Lead management API endpoints
- `app/Http/Controllers/CarController.php` - Car listings and management
- `app/Http/Controllers/DealController.php` - Deal pipeline management
- `app/Http/Controllers/NeedsAnalysisController.php` - Needs analysis form handling
- `app/Http/Controllers/CarInfoApiController.php` - car.info API integration controller
- `app/Http/Controllers/Admin/DashboardController.php` - Admin dashboard data
- `app/Http/Controllers/Customer/PortalController.php` - Customer portal endpoints
- `app/Http/Requests/NeedsAnalysisRequest.php` - Validation for needs analysis
- `app/Http/Requests/CarDealRequest.php` - Validation for car deal registration
- `app/Http/Requests/CarRequest.php` - Validation for car creation/updates

### Frontend - React Pages and Components
- `resources/js/pages/marketing/home.tsx` - Marketing homepage
- `resources/js/pages/marketing/car-listings.tsx` - Car listings page (Carla.se style)
- `resources/js/pages/marketing/car-details.tsx` - Individual car product page
- `resources/js/pages/marketing/needs-analysis.tsx` - Multi-step needs analysis form
- `resources/js/pages/marketing/car-deal-registration.tsx` - Car deal registration form
- `resources/js/pages/admin/dashboard.tsx` - Admin dashboard overview
- `resources/js/pages/admin/leads.tsx` - Lead management interface
- `resources/js/pages/admin/cars.tsx` - Car management interface
- `resources/js/pages/admin/deals.tsx` - Deal pipeline management
- `resources/js/pages/customer/portal.tsx` - Customer portal dashboard
- `resources/js/pages/customer/deals.tsx` - Customer deal tracking

### Frontend - Components
- `resources/js/components/marketing/car-card.tsx` - Car listing card component
- `resources/js/components/marketing/car-filters.tsx` - Advanced filtering component
- `resources/js/components/marketing/needs-analysis-step.tsx` - Needs analysis step component
- `resources/js/components/admin/lead-table.tsx` - Lead management table
- `resources/js/components/admin/deal-pipeline.tsx` - Deal pipeline visualization
- `resources/js/components/admin/car-form.tsx` - Car creation/editing form
- `resources/js/components/customer/deal-status.tsx` - Deal status tracking component
- `resources/js/components/shared/image-gallery.tsx` - Car image gallery component

### Services and Utilities
- `app/Services/CarInfoApiService.php` - car.info API integration service
- `app/Services/NeedsAnalysisService.php` - Needs analysis matching logic
- `app/Services/LeadScoringService.php` - Lead scoring algorithm
- `app/Services/EmailService.php` - Resend email integration
- `resources/js/lib/api.ts` - Frontend API client utilities
- `resources/js/lib/validation.ts` - Form validation utilities
- `resources/js/lib/swedish-utils.ts` - Swedish formatting utilities (currency, etc.)

### Configuration and Routes
- `routes/marketing.php` - Marketing website routes
- `routes/admin.php` - Admin dashboard routes
- `routes/customer.php` - Customer portal routes
- `routes/api.php` - API endpoints for external integrations
- `config/services.php` - External service configurations

### Testing Files
- `tests/Feature/LeadManagementTest.php` - Lead creation and management tests
- `tests/Feature/NeedsAnalysisTest.php` - Needs analysis form tests
- `tests/Feature/CarListingsTest.php` - Car listings and filtering tests
- `tests/Feature/AdminDashboardTest.php` - Admin dashboard functionality tests
- `tests/Unit/NeedsAnalysisServiceTest.php` - Unit tests for needs analysis logic
- `tests/Unit/LeadScoringServiceTest.php` - Unit tests for lead scoring

### Notes

- Unit tests should be placed alongside the code files they are testing where possible
- Use `php artisan test` to run PHP tests and `npm run test` for JavaScript/React tests
- The project uses Pest PHP for testing - follow existing patterns in the codebase
- All Swedish text should use proper locale formatting and be stored in language files

## Tasks

- [ ] 1.0 Database Schema and Models Setup
  - [x] 1.1 Create leads migration with all required fields (name, email, phone, source, status, assigned_agent_id, etc.)
  - [ ] 1.2 Create cars migration with comprehensive vehicle data (make, model, year, price, mileage, specifications, etc.)
  - [ ] 1.3 Create deals migration with pipeline tracking (lead_id, car_id, status, commission, notes, etc.)
  - [ ] 1.4 Create needs_analysis migration for questionnaire responses (customer_id, responses JSON, compatibility_scores, etc.)
  - [ ] 1.5 Create car_images migration for image management (car_id, image_path, alt_text, sort_order)
  - [ ] 1.6 Create lead_activities migration for CRM tracking (lead_id, user_id, activity_type, description, timestamp)
  - [ ] 1.7 Add role column to users table for Admin/Agent/Manager permissions
  - [ ] 1.8 Create Lead model with relationships, scopes, and status management methods
  - [ ] 1.9 Create Car model with filtering scopes and specification handling
  - [ ] 1.10 Create Deal model with status transitions and commission calculations
  - [ ] 1.11 Create NeedsAnalysis model with JSON casting and scoring methods
  - [ ] 1.12 Set up model relationships and foreign key constraints
  - [ ] 1.13 Create database seeders for initial data (user roles, sample cars, etc.)

- [ ] 2.0 Marketing Website Frontend Development
  - [ ] 2.1 Create marketing homepage with Swedish branding and value propositions
  - [ ] 2.2 Build car listings page with Carla.se-inspired grid layout and card design
  - [ ] 2.3 Implement advanced filtering system (price, year, make, model, features, etc.)
  - [ ] 2.4 Add sorting functionality (recommended, newest, price low/high)
  - [ ] 2.5 Create individual car product pages with image galleries and specifications
  - [ ] 2.6 Build multi-step needs analysis form with conditional logic and progress tracking
  - [ ] 2.7 Implement car deal registration form with Swedish registration number validation
  - [ ] 2.8 Create car selling form for customers wanting to sell their vehicles
  - [ ] 2.9 Add search functionality across car listings with autocomplete
  - [ ] 2.10 Implement responsive design for all marketing pages
  - [ ] 2.11 Add Swedish language content and SEK currency formatting throughout
  - [ ] 2.12 Ensure WCAG 2.1 AA accessibility compliance across all pages

- [ ] 3.0 Admin Dashboard and CRM System
  - [ ] 3.1 Create admin dashboard layout using Laravel React kit sidebar patterns
  - [ ] 3.2 Build dashboard overview with key metrics (leads, deals, conversion rates, revenue)
  - [ ] 3.3 Implement lead management interface with status tracking and filtering
  - [ ] 3.4 Create lead assignment system with agent notifications
  - [ ] 3.5 Build car management interface for creating and editing car advertisements
  - [ ] 3.6 Implement image upload and management system for car photos
  - [ ] 3.7 Create deal pipeline interface with drag-and-drop status updates
  - [ ] 3.8 Build user management system with role-based access control
  - [ ] 3.9 Implement activity logging and audit trail functionality
  - [ ] 3.10 Add bulk actions for lead management (assign, status change, export)
  - [ ] 3.11 Create search and filtering capabilities across all admin interfaces
  - [ ] 3.12 Build basic reporting interface with export functionality (CSV, Excel)

- [ ] 4.0 Customer Portal and Authentication
  - [ ] 4.1 Extend Laravel authentication for customer registration and login
  - [ ] 4.2 Create customer portal dashboard with deal overview and status tracking
  - [ ] 4.3 Build deal details page with progress timeline and current status
  - [ ] 4.4 Implement messaging system between customers and assigned agents
  - [ ] 4.5 Create customer profile management for updating contact information
  - [ ] 4.6 Build agreement and contract access with external signature integration
  - [ ] 4.7 Implement deal history and saved vehicles functionality
  - [ ] 4.8 Add notification system for deal status changes and agent messages
  - [ ] 4.9 Create responsive design for all customer portal pages
  - [ ] 4.10 Implement secure customer data handling with GDPR compliance

- [ ] 5.0 External Integrations and API Development
  - [ ] 5.1 Integrate car.info API for Swedish vehicle registration lookups
  - [ ] 5.2 Build API service layer for handling car.info responses and data mapping
  - [ ] 5.3 Implement Swedish registration number validation and formatting
  - [ ] 5.4 Integrate Resend email service for automated notifications
  - [ ] 5.5 Create email templates for lead notifications, deal updates, and customer communications
  - [ ] 5.6 Build external digital signature service integration with secure redirects
  - [ ] 5.7 Implement API rate limiting and error handling for external services
  - [ ] 5.8 Create data export functionality for CSV and Excel formats
  - [ ] 5.9 Build webhook endpoints for external service callbacks
  - [ ] 5.10 Prepare integration points for future Swish payment system

- [ ] 6.0 Advanced Features and Business Logic
  - [ ] 6.1 Implement needs analysis matching algorithm to score car compatibility
  - [ ] 6.2 Build lead scoring system based on engagement and qualification criteria
  - [ ] 6.3 Create automated email workflows for lead nurturing and follow-up
  - [ ] 6.4 Implement similar vehicle recommendation engine for car detail pages
  - [ ] 6.5 Build savings calculation system for car deal estimates
  - [ ] 6.6 Create automated lead assignment logic based on agent availability and expertise
  - [ ] 6.7 Implement activity tracking and customer interaction history
  - [ ] 6.8 Build basic analytics tracking for conversion rates and user behavior
  - [ ] 6.9 Create data validation and sanitization for all user inputs
  - [ ] 6.10 Implement comprehensive error handling and logging throughout the application