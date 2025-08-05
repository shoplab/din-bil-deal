# Product Requirements Document: Swedish Car Sales Platform (DinBilDeal)

## Introduction/Overview

DinBilDeal is a comprehensive Swedish car sales platform that connects car buyers with sellers while providing expert guidance throughout the purchasing process. The platform addresses three key market needs:

1. **Lead Generation**: A marketing website that drives qualified leads for car sales
2. **Expert Guidance**: Comprehensive needs analysis and car matching services
3. **Deal Facilitation**: Streamlined process for car deals with commission-based revenue

The platform solves the problem of consumers struggling to find the right car and negotiate fair deals, while providing car sellers with qualified leads and professional intermediary services.

**Goal**: Create a profitable car sales platform that generates revenue through 1% commission on completed deals, plus financing and insurance partnerships, while delivering exceptional value to Swedish car buyers and sellers.

## Goals

1. **Lead Generation**: Generate qualified car sales leads through a compelling marketing website
2. **Needs Analysis**: Provide comprehensive questionnaire system to match customers with suitable vehicles
3. **Deal Management**: Facilitate car transactions from initial contact to completed sale
4. **CRM System**: Build comprehensive lead management and customer relationship system
5. **Revenue Generation**: Achieve profitability through 1% commission on sales plus financing/insurance partnerships
6. **Market Position**: Establish DinBilDeal as the trusted car buying service in Sweden

## User Stories

### Admin User Stories
- As an admin, I want to manage all leads in a centralized dashboard so I can track business performance
- As an admin, I want to create and manage car advertisements so I can showcase available inventory
- As an admin, I want to assign leads to agents so I can distribute workload effectively
- As an admin, I want to view dashboard metrics so I can monitor lead conversion and deal completion rates
- As an admin, I want to manage user roles and permissions so I can control system access

### Agent User Stories
- As an agent, I want to view my assigned leads so I can prioritize my follow-up activities
- As an agent, I want to update deal status and add notes so I can track progress with customers
- As an agent, I want to communicate with customers through the platform so I can maintain organized records
- As an agent, I want to access customer needs analysis results so I can provide targeted recommendations

### Manager User Stories
- As a manager, I want to oversee team performance so I can identify coaching opportunities
- As a manager, I want to reassign leads between agents so I can optimize workload distribution
- As a manager, I want to access reporting data so I can make informed business decisions

### Customer User Stories
- As a customer, I want to complete a needs analysis questionnaire so I can receive personalized car recommendations
- As a customer, I want to register a car deal by entering a registration number so I can get help purchasing a specific vehicle
- As a customer, I want to view my deals and their status so I can track progress
- As a customer, I want to sign agreements digitally so I can complete transactions conveniently
- As a customer, I want to communicate with my assigned agent so I can get expert guidance
- As a customer, I want to sell my current car so I can upgrade to a new vehicle

## Functional Requirements

### Marketing Website
1. The system must provide a responsive Swedish-language marketing website accessible on all devices
2. The system must display car listings in a grid format similar to Carla.se Tesla page with filtering and sorting capabilities
3. The system must provide individual car product pages with detailed specifications, image galleries, and contact forms
4. The system must include a comprehensive needs analysis form accessible from the main navigation
5. The system must provide a car deal registration form where users can enter Swedish registration numbers
6. The system must integrate with car.info API to fetch vehicle data from Swedish registration numbers
7. The system must display pricing in Swedish Kronor (SEK) throughout the site
8. The system must comply with EU Accessibility Act requirements (WCAG 2.1 AA minimum)
9. The system must include sections for selling existing cars with lead capture forms
10. The system must provide clear value propositions highlighting the 1% commission and money-saving benefits

### Needs Analysis System
11. The system must provide a multi-step questionnaire with conditional logic based on user responses
12. The system must use only multiple-choice questions to minimize user typing
13. The system must include questions covering budget, family size, usage patterns, preferred features, and lifestyle needs
14. The system must adapt the number of questions based on previous answers (minimum 10, maximum 25 questions)
15. The system must calculate compatibility scores for available vehicles based on responses
16. The system must store all responses linked to customer contact information
17. The system must generate a comprehensive needs profile for agent reference
18. The system must allow customers to update their needs analysis after completion

### Car Deal Registration
19. The system must accept Swedish vehicle registration numbers and validate format
20. The system must integrate with car.info API to retrieve vehicle specifications, current owner information, and market data
21. The system must capture customer contact information and preferred communication methods
22. The system must generate leads with "Car Deal Request" status for agent follow-up
23. The system must display estimated savings calculations based on market analysis
24. The system must suggest similar vehicles if the requested car becomes unavailable
25. The system must store all vehicle data retrieved from external APIs

### Admin Dashboard (Laravel React Kit Style)
26. The system must provide a sidebar navigation dashboard following Laravel React starter kit patterns
27. The system must display key metrics including total leads, active deals, conversion rates, and revenue
28. The system must provide lead management interface with status tracking (Open, In Process, Waiting, Finance, Done)
29. The system must allow lead assignment to agents with notification system
30. The system must provide car advertisement creation and management tools
31. The system must support image upload and management for car listings
32. The system must allow manual activation/deactivation of car advertisements
33. The system must provide user management with role-based access control (Admin, Agent, Manager)
34. The system must include search and filtering capabilities across all data entities
35. The system must provide audit trail for all system changes

### Customer Portal
36. The system must provide secure customer login and account management
37. The system must display deal status and progress tracking for customers
38. The system must provide access to agreements and contracts with external signature integration
39. The system must enable two-way messaging between customers and assigned agents
40. The system must allow customers to update their contact information and preferences
41. The system must display deal history and saved vehicles
42. The system must provide notifications for deal status changes

### CRM Features
43. The system must track lead sources and attribution for marketing analysis
44. The system must maintain complete communication history for each customer
45. The system must support deal pipeline management with customizable stages
46. The system must enable note-taking and task management for each lead
47. The system must provide lead scoring based on engagement and qualification criteria
48. The system must support bulk actions for lead management
49. The system must integrate with Resend for automated email communications
50. The system must maintain activity logs for compliance and quality assurance

### Integration Requirements
51. The system must integrate with external digital signature services via secure links
52. The system must prepare for future Swish payment integration (manual process initially)
53. The system must support email notifications through Resend service
54. The system must maintain data synchronization with car.info API
55. The system must export data in common formats (CSV, Excel) for external analysis

## Non-Goals (Out of Scope)

- **Multi-country Support**: System will only support Swedish market initially
- **Advanced Analytics**: Complex reporting and business intelligence features beyond basic dashboard metrics
- **Automated Car Imports**: Integration with multiple car dealer inventory systems
- **Built-in Payment Processing**: Advanced payment gateway integration (Swish will be added later)
- **Mobile Native Apps**: Only responsive web design, no dedicated mobile applications
- **Real-time Chat**: Advanced messaging features beyond basic platform messaging
- **Car Financing Calculations**: Complex loan and financing calculation tools
- **Third-party Dealer Integration**: Direct API connections with car dealerships
- **Advanced AI Matching**: Machine learning algorithms for car recommendations (basic rule-based matching initially)

## Design Considerations

### UI Framework and Components
- **Component Library**: Exclusive use of ShadCN/UI components throughout the application
- **Layout System**: Laravel React starter kit sidebar layouts (default, inset, floating variants)
- **Design Consistency**: Follow existing Laravel React kit patterns without custom CSS
- **Swedish Localization**: All text, currency, and formatting must be Swedish-specific

### Car Listings Design (Based on Carla.se)
- **Grid Layout**: Card-based layout with vehicle images, specifications, and pricing
- **Filtering System**: Advanced filters for price, year, mileage, color, and features
- **Sorting Options**: Recommended, newest, lowest price, highest price
- **Search Functionality**: Text search across make, model, and features

### Individual Car Pages (Based on Carla.se Model 3 page)
- **Image Gallery**: Comprehensive photo gallery with 360-degree views where available
- **Specification Display**: Detailed technical specifications and features list
- **Pricing Information**: Clear pricing with financing options display
- **Call-to-Action**: Prominent contact forms and deal request buttons
- **Similar Vehicles**: Recommendations for comparable cars

### Accessibility Requirements
- **EU Accessibility Act Compliance**: Full WCAG 2.1 AA compliance minimum
- **Keyboard Navigation**: Complete keyboard accessibility throughout the platform
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure
- **Color Contrast**: Minimum 4.5:1 contrast ratio for all text elements
- **Alternative Text**: Comprehensive alt text for all images and visual content

## Technical Considerations

### Technology Stack
- **Backend**: Laravel 12 with Inertia.js for seamless SPA experience
- **Frontend**: React 19 with TypeScript for type safety and modern development
- **UI Components**: ShadCN/UI component library with Tailwind CSS
- **Database**: Laravel's default database configuration with migrations
- **Authentication**: Laravel's built-in authentication system

### External Integrations
- **car.info API**: Integration for Swedish vehicle registration data lookup
- **Resend**: Email service for automated notifications and communications
- **Digital Signatures**: External service integration via secure redirect links
- **Future Swish Integration**: Preparation for Swedish mobile payment system

### Performance and Scalability
- **Database Optimization**: Proper indexing for search and filtering operations
- **Image Optimization**: Compressed images with lazy loading for car galleries
- **Caching Strategy**: Laravel caching for frequently accessed data
- **API Rate Limiting**: Proper handling of external API rate limits

### Security Requirements
- **Data Protection**: GDPR compliance for customer data handling
- **Secure Authentication**: Laravel's built-in security features
- **API Security**: Secure handling of external API credentials
- **Input Validation**: Comprehensive validation for all user inputs

## Success Metrics

### Primary KPIs
- **Lead Conversion Rate**: Percentage of website visitors who complete needs analysis or car deal registration
- **Deal Completion Rate**: Percentage of leads that result in completed car sales
- **Revenue per Customer**: Average commission and additional service revenue per completed deal
- **Customer Satisfaction**: Post-transaction survey scores and repeat customer rate

### Secondary Metrics
- **Website Traffic**: Monthly unique visitors and page views
- **Form Completion Rate**: Percentage of users who complete the needs analysis form
- **Agent Productivity**: Average deals per agent and time-to-close metrics
- **Lead Quality Score**: Qualification rate of generated leads

### Dashboard Metrics
- **Total Active Leads**: Current number of leads in the pipeline
- **Monthly Deal Volume**: Number of completed deals per month
- **Revenue Tracking**: Monthly commission and partnership revenue
- **Response Time**: Average time from lead generation to first contact

## Open Questions

1. **car.info API Details**: What are the specific authentication requirements, rate limits, and data fields available from the car.info API?

2. **Digital Signature Service**: Which external digital signature service should be integrated, and what are the technical requirements for seamless integration?

3. **Advanced Matching Algorithm**: How sophisticated should the needs analysis matching become, and what data points are most important for accurate car recommendations?

4. **Financing Partner Integration**: Which Swedish financing companies should be integrated for loan calculations and applications?

5. **Insurance Partnership Details**: What insurance products should be offered, and how should the integration be structured?

6. **Lead Scoring Algorithm**: What criteria should be used to automatically score and prioritize leads for agents?

7. **Multi-language Support**: Should the platform support additional languages beyond Swedish for immigrant populations?

8. **Mobile App Strategy**: What is the long-term strategy for mobile native applications, and when should development begin?

9. **Car Inspection Integration**: Should the platform integrate with car inspection services for used vehicle verification?

10. **Marketing Attribution**: What level of marketing analytics and attribution tracking is required for performance optimization?