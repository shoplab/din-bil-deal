<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\CarController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Admin\DealController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\Settings\SettingsController;
use App\Http\Controllers\Admin\Settings\UserSettingsController;
use App\Http\Controllers\Admin\Settings\RoleController;
use App\Http\Controllers\Admin\Settings\PermissionController;
use App\Http\Controllers\Admin\Settings\GeneralSettingsController;
use App\Http\Controllers\Admin\Settings\EmailTemplateController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application.
| These routes are loaded by the RouteServiceProvider within a group which
| contains the "admin" middleware group.
|
*/

Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    
    // Dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard.index');
    
    // Analytics & Reports
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/', [AnalyticsController::class, 'index'])->name('index');
        Route::get('/sales', [AnalyticsController::class, 'sales'])->name('sales');
        Route::get('/leads', [AnalyticsController::class, 'leads'])->name('leads');
        Route::get('/inventory', [AnalyticsController::class, 'inventory'])->name('inventory');
    });
    
    // Car Management
    Route::prefix('cars')->name('cars.')->group(function () {
        Route::get('/', [CarController::class, 'index'])->name('index');
        Route::get('/create', [CarController::class, 'create'])->name('create');
        Route::post('/', [CarController::class, 'store'])->name('store');
        Route::get('/{car}', [CarController::class, 'show'])->name('show');
        Route::get('/{car}/edit', [CarController::class, 'edit'])->name('edit');
        Route::put('/{car}', [CarController::class, 'update'])->name('update');
        Route::delete('/{car}', [CarController::class, 'destroy'])->name('destroy');
        
        // Car Actions
        Route::patch('/{car}/publish', [CarController::class, 'publish'])->name('publish');
        Route::patch('/{car}/unpublish', [CarController::class, 'unpublish'])->name('unpublish');
        Route::patch('/{car}/feature', [CarController::class, 'feature'])->name('feature');
        Route::patch('/{car}/unfeature', [CarController::class, 'unfeature'])->name('unfeature');
        Route::post('/{car}/duplicate', [CarController::class, 'duplicate'])->name('duplicate');
        
        // Bulk Actions
        Route::post('/bulk/publish', [CarController::class, 'bulkPublish'])->name('bulk.publish');
        Route::post('/bulk/unpublish', [CarController::class, 'bulkUnpublish'])->name('bulk.unpublish');
        Route::post('/bulk/delete', [CarController::class, 'bulkDelete'])->name('bulk.delete');
    });
    
    // Lead Management
    Route::prefix('leads')->name('leads.')->group(function () {
        Route::get('/', [LeadController::class, 'index'])->name('index');
        Route::get('/create', [LeadController::class, 'create'])->name('create');
        Route::post('/', [LeadController::class, 'store'])->name('store');
        Route::get('/{lead}', [LeadController::class, 'show'])->name('show');
        Route::get('/{lead}/edit', [LeadController::class, 'edit'])->name('edit');
        Route::put('/{lead}', [LeadController::class, 'update'])->name('update');
        Route::delete('/{lead}', [LeadController::class, 'destroy'])->name('destroy');
        
        // Lead Actions
        Route::post('/{lead}/activities', [LeadController::class, 'addActivity'])->name('activities.store');
        Route::patch('/{lead}/status', [LeadController::class, 'updateStatus'])->name('status.update');
        Route::patch('/{lead}/assign', [LeadController::class, 'assign'])->name('assign');
        Route::post('/{lead}/convert', [LeadController::class, 'convertToDeal'])->name('convert');
        
        // Bulk Actions
        Route::post('/bulk/assign', [LeadController::class, 'bulkAssign'])->name('bulk.assign');
        Route::post('/bulk/status', [LeadController::class, 'bulkUpdateStatus'])->name('bulk.status');
        Route::post('/bulk/delete', [LeadController::class, 'bulkDelete'])->name('bulk.delete');
    });
    
    // Deal Management
    Route::prefix('deals')->name('deals.')->group(function () {
        Route::get('/', [DealController::class, 'index'])->name('index');
        Route::get('/create', [DealController::class, 'create'])->name('create');
        Route::post('/', [DealController::class, 'store'])->name('store');
        Route::get('/{deal}', [DealController::class, 'show'])->name('show');
        Route::get('/{deal}/edit', [DealController::class, 'edit'])->name('edit');
        Route::put('/{deal}', [DealController::class, 'update'])->name('update');
        Route::delete('/{deal}', [DealController::class, 'destroy'])->name('destroy');
        
        // Deal Actions
        Route::patch('/{deal}/stage', [DealController::class, 'updateStage'])->name('stage.update');
        Route::patch('/{deal}/assign', [DealController::class, 'assign'])->name('assign');
        Route::post('/{deal}/activities', [DealController::class, 'addActivity'])->name('activities.store');
        Route::post('/{deal}/close', [DealController::class, 'close'])->name('close');
        Route::post('/{deal}/reopen', [DealController::class, 'reopen'])->name('reopen');
        
        // Pipeline views
        Route::get('/pipeline/kanban', [DealController::class, 'kanban'])->name('pipeline.kanban');
        Route::get('/pipeline/table', [DealController::class, 'table'])->name('pipeline.table');
    });
    
    // Settings & Configuration
    Route::prefix('settings')->name('settings.')->group(function () {
        // Settings Index
        Route::get('/', [SettingsController::class, 'index'])->name('index');

        // General Settings
        Route::get('/general', [GeneralSettingsController::class, 'index'])->name('general');
        Route::put('/general', [GeneralSettingsController::class, 'update'])->name('general.update');

        // User Management (Admin Users)
        Route::get('/users', [UserSettingsController::class, 'index'])->name('users');
        Route::post('/users', [UserSettingsController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserSettingsController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserSettingsController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/reset-password', [UserSettingsController::class, 'resetPassword'])->name('users.reset-password');
        Route::post('/users/{user}/send-reset', [UserSettingsController::class, 'sendPasswordReset'])->name('users.send-reset');
        Route::patch('/users/{user}/toggle-active', [UserSettingsController::class, 'toggleActive'])->name('users.toggle-active');

        // Roles Management
        Route::get('/roles', [RoleController::class, 'index'])->name('roles');
        Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
        Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
        Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

        // Permissions Management
        Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions');
        Route::put('/permissions/role/{role}', [PermissionController::class, 'updateRolePermissions'])->name('permissions.role.update');

        // Email Templates
        Route::get('/templates', [EmailTemplateController::class, 'index'])->name('templates');
        Route::get('/templates/create', [EmailTemplateController::class, 'create'])->name('templates.create');
        Route::post('/templates', [EmailTemplateController::class, 'store'])->name('templates.store');
        Route::get('/templates/{template}/edit', [EmailTemplateController::class, 'edit'])->name('templates.edit');
        Route::put('/templates/{template}', [EmailTemplateController::class, 'update'])->name('templates.update');
        Route::delete('/templates/{template}', [EmailTemplateController::class, 'destroy'])->name('templates.destroy');
        Route::post('/templates/{template}/preview', [EmailTemplateController::class, 'preview'])->name('templates.preview');
        Route::patch('/templates/{template}/toggle-active', [EmailTemplateController::class, 'toggleActive'])->name('templates.toggle-active');
    });
});