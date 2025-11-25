# Laravel Cloud Deployment Guide

## Overview
This guide covers deploying the Din Bil Deal application to Laravel Cloud.

## Prerequisites
- Laravel Cloud account
- Access to Laravel Cloud dashboard
- Domain configured (dinbildeal.se)

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Copy `.env.production` to `.env` on the server
- [ ] Generate new APP_KEY: `php artisan key:generate`
- [ ] Set database credentials provided by Laravel Cloud
- [ ] Set Redis credentials provided by Laravel Cloud
- [ ] Configure S3 bucket for file storage
- [ ] Set mail service credentials

### 2. Database Setup
```bash
# Run migrations
php artisan migrate --force

# Seed initial data (ONLY on first deployment or when explicitly needed)
# Note: Do NOT run seeders on every deployment as they use firstOrCreate
# which is safe, but unnecessary. Run manually when needed:
php artisan db:seed --force
```

### 3. Asset Compilation
The project includes optimized Vite configuration for production builds:
- `vite.config.production.ts` - Optimized build settings
- Automatic code splitting for vendor and UI libraries
- Terser minification with console removal

Build commands:
```bash
# Install dependencies
npm ci --production

# Build assets
npm run build

# Or with SSR support
npm run build:ssr
```

### 4. Cache Configuration
The application is configured to use Redis for:
- Session storage (encrypted)
- Application cache
- Queue jobs
- Broadcasting

Clear and warm caches:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan icons:cache
```

## Laravel Cloud Configuration

### Application Settings
- **Environment**: production
- **PHP Version**: 8.3+
- **Node Version**: 20.x

### Environment Variables
Key environment variables to configure in Laravel Cloud:

```env
# Application
APP_NAME="Din Bil Deal"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://dinbildeal.se
APP_LOCALE=sv
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=sv_SE

# Database (provided by Laravel Cloud)
DB_CONNECTION=mysql
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

# Redis (provided by Laravel Cloud)
REDIS_HOST=${REDIS_HOST}
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_PORT=${REDIS_PORT}

# Sessions & Cache
SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
BROADCAST_CONNECTION=redis

# File Storage
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
AWS_BUCKET=${AWS_BUCKET}

# Mail
MAIL_MAILER=smtp
MAIL_HOST=${MAIL_HOST}
MAIL_PORT=${MAIL_PORT}
MAIL_USERNAME=${MAIL_USERNAME}
MAIL_PASSWORD=${MAIL_PASSWORD}
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@dinbildeal.se

# Swedish Car API
CAR_INFO_API_KEY=${CAR_INFO_API_KEY}
CAR_INFO_API_URL=https://api.car.info/v1

# Business Settings
COMMISSION_PERCENTAGE=1.0

# Security
SECURE_HEADERS_ENABLED=true
CSP_ENABLED=true
HSTS_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
```

### Build Commands
Configure these build commands in Laravel Cloud:

```bash
# Install Composer dependencies
composer install --no-dev --optimize-autoloader

# Install Node dependencies and build assets
npm ci --production
npm run build

# Clear and cache configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan icons:cache

# Run migrations
php artisan migrate --force

# Note: Seeders are NOT included in build commands
# Run seeders manually only when needed (first deployment, resetting data, etc.)
# php artisan db:seed --force
```

### Queue Workers
Configure queue workers for:
- Default queue
- Email notifications
- Car data synchronization

Recommended settings:
- Workers: 2-4
- Memory: 128MB
- Timeout: 60 seconds
- Max Jobs: 1000

### Scheduled Tasks
Add to scheduler (cron):
```bash
* * * * * php artisan schedule:run
```

## Health Monitoring

### Health Check Endpoint
The application includes a health check endpoint at `/health` that verifies:
- Application status
- Database connectivity
- Cache functionality
- Queue status

Laravel Cloud can monitor this endpoint for automatic health checks.

### Monitoring Metrics
Monitor these key metrics:
- Response time (<200ms target)
- Error rate (<0.1%)
- Database query time
- Cache hit rate
- Queue job processing time

## Security Considerations

### Production Security
- SSL/TLS certificate (managed by Laravel Cloud)
- Security headers enabled (CSP, HSTS, X-Frame-Options)
- Rate limiting (60 requests/minute default)
- Session encryption enabled
- Database query logging disabled

### Secrets Management
- Never commit secrets to repository
- Use Laravel Cloud's environment variable management
- Rotate keys regularly
- Use strong passwords for database and Redis

## Post-Deployment

### Verification Checklist
- [ ] Application loads correctly
- [ ] Database connection works
- [ ] Redis cache functioning
- [ ] File uploads working (S3)
- [ ] Email sending functional
- [ ] Queue jobs processing
- [ ] Health check endpoint responding
- [ ] Swedish localization active
- [ ] car.info API integration working

### Performance Optimization
- Enable OPcache
- Configure CDN for static assets
- Enable HTTP/2
- Implement browser caching headers
- Monitor and optimize slow queries

### Backup Strategy
- Daily database backups
- Weekly full application backups
- Store backups in separate region
- Test restore procedures regularly

## Troubleshooting

### Common Issues

#### 500 Error on deployment
```bash
# Check logs
php artisan log:tail

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Regenerate caches
php artisan config:cache
php artisan route:cache
```

#### Database connection issues
```bash
# Test connection
php artisan tinker
>>> DB::connection()->getPdo();

# Check migration status
php artisan migrate:status
```

#### Asset loading issues
```bash
# Rebuild assets
npm run build

# Check manifest
cat public/build/manifest.json
```

#### Queue not processing
```bash
# Restart queue workers
php artisan queue:restart

# Check failed jobs
php artisan queue:failed
```

## Rollback Procedure
If deployment fails:
1. Revert to previous deployment in Laravel Cloud
2. Restore database from backup if migrations were run
3. Clear all caches
4. Verify health check endpoint
5. Monitor error logs

## Support
- Laravel Cloud Documentation: https://docs.laravelcloud.com
- Application Issues: Create issue in repository
- Emergency Contact: [Your contact information]