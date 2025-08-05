<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Facades\Image;

class CarImage extends Model
{
    protected $fillable = [
        'car_id', 'path', 'url', 'filename', 'original_filename', 'mime_type',
        'file_size', 'width', 'height', 'alt_text', 'caption', 'type',
        'sort_order', 'is_primary', 'is_published', 'processing_status',
        'variants', 'metadata', 'uploaded_by_id'
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_published' => 'boolean',
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'sort_order' => 'integer',
        'variants' => 'array',
        'metadata' => 'array',
    ];

    // Image type constants
    public const TYPE_EXTERIOR = 'exterior';
    public const TYPE_INTERIOR = 'interior';
    public const TYPE_ENGINE = 'engine';
    public const TYPE_WHEELS = 'wheels';
    public const TYPE_DETAILS = 'details';
    public const TYPE_DAMAGE = 'damage';
    public const TYPE_DOCUMENTS = 'documents';
    public const TYPE_OTHER = 'other';

    // Processing status constants
    public const STATUS_UPLOADED = 'uploaded';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_PROCESSED = 'processed';
    public const STATUS_FAILED = 'failed';

    // Image variant sizes
    public const VARIANTS = [
        'thumbnail' => ['width' => 150, 'height' => 150, 'crop' => true],
        'small' => ['width' => 300, 'height' => 225, 'crop' => false],
        'medium' => ['width' => 600, 'height' => 450, 'crop' => false],
        'large' => ['width' => 1200, 'height' => 900, 'crop' => false],
        'hero' => ['width' => 1920, 'height' => 1080, 'crop' => true],
    ];

    // Relationships
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by_id');
    }

    // Query Scopes
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopePrimary(Builder $query): Builder
    {
        return $query->where('is_primary', true);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('created_at');
    }

    public function scopeProcessed(Builder $query): Builder
    {
        return $query->where('processing_status', self::STATUS_PROCESSED);
    }

    public function scopeExterior(Builder $query): Builder
    {
        return $query->where('type', self::TYPE_EXTERIOR);
    }

    public function scopeInterior(Builder $query): Builder
    {
        return $query->where('type', self::TYPE_INTERIOR);
    }

    // File Management Methods
    public static function uploadFromFile(UploadedFile $file, int $carId, array $options = []): self
    {
        $image = new self();
        $image->car_id = $carId;
        $image->original_filename = $file->getClientOriginalName();
        $image->mime_type = $file->getMimeType();
        $image->file_size = $file->getSize();
        $image->type = $options['type'] ?? self::TYPE_OTHER;
        $image->alt_text = $options['alt_text'] ?? '';
        $image->caption = $options['caption'] ?? '';
        $image->is_primary = $options['is_primary'] ?? false;
        $image->uploaded_by_id = $options['uploaded_by_id'] ?? null;
        $image->processing_status = self::STATUS_UPLOADED;

        // Generate unique filename
        $extension = $file->getClientOriginalExtension();
        $filename = 'car_' . $carId . '_' . uniqid() . '.' . $extension;
        $image->filename = $filename;

        // Store original file
        $path = $file->storeAs('cars/' . $carId . '/images', $filename, 'public');
        $image->path = $path;
        $image->url = Storage::url($path);

        // Get image dimensions
        $dimensions = getimagesize($file->getPathname());
        if ($dimensions) {
            $image->width = $dimensions[0];
            $image->height = $dimensions[1];
        }

        $image->save();

        // Process variants asynchronously (in real app, this would be a job)
        $image->processVariants();

        return $image;
    }

    public function processVariants(): void
    {
        $this->processing_status = self::STATUS_PROCESSING;
        $this->save();

        try {
            $originalPath = Storage::disk('public')->path($this->path);
            $variants = [];

            foreach (self::VARIANTS as $variantName => $config) {
                $variantPath = $this->generateVariantPath($variantName);
                $variantFullPath = Storage::disk('public')->path($variantPath);

                // Create directory if it doesn't exist
                $directory = dirname($variantFullPath);
                if (!is_dir($directory)) {
                    mkdir($directory, 0755, true);
                }

                // Process image with Intervention Image
                $img = Image::make($originalPath);
                
                if ($config['crop']) {
                    $img->fit($config['width'], $config['height']);
                } else {
                    $img->resize($config['width'], $config['height'], function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                }

                // Optimize quality
                $img->save($variantFullPath, 85);

                $variants[$variantName] = [
                    'path' => $variantPath,
                    'url' => Storage::url($variantPath),
                    'width' => $img->width(),
                    'height' => $img->height(),
                    'file_size' => filesize($variantFullPath),
                ];
            }

            $this->variants = $variants;
            $this->processing_status = self::STATUS_PROCESSED;
            $this->save();

        } catch (\Exception $e) {
            $this->processing_status = self::STATUS_FAILED;
            $this->metadata = array_merge($this->metadata ?? [], [
                'processing_error' => $e->getMessage(),
                'failed_at' => now()->toISOString(),
            ]);
            $this->save();
        }
    }

    private function generateVariantPath(string $variantName): string
    {
        $pathInfo = pathinfo($this->path);
        return $pathInfo['dirname'] . '/variants/' . $pathInfo['filename'] . '_' . $variantName . '.' . $pathInfo['extension'];
    }

    public function delete(): ?bool
    {
        // Delete all files from storage
        try {
            // Delete original file
            if ($this->path && Storage::disk('public')->exists($this->path)) {
                Storage::disk('public')->delete($this->path);
            }

            // Delete variants
            if ($this->variants) {
                foreach ($this->variants as $variant) {
                    if (isset($variant['path']) && Storage::disk('public')->exists($variant['path'])) {
                        Storage::disk('public')->delete($variant['path']);
                    }
                }
            }
        } catch (\Exception $e) {
            // Log error but continue with database deletion
            logger()->error('Failed to delete image files: ' . $e->getMessage(), [
                'image_id' => $this->id,
                'path' => $this->path,
            ]);
        }

        return parent::delete();
    }

    // Image Access Methods
    public function getUrl(string $variant = null): string
    {
        if (!$variant) {
            return $this->url;
        }

        if (isset($this->variants[$variant]['url'])) {
            return $this->variants[$variant]['url'];
        }

        // Fallback to original if variant doesn't exist
        return $this->url;
    }

    public function getThumbnailUrl(): string
    {
        return $this->getUrl('thumbnail');
    }

    public function getMediumUrl(): string
    {
        return $this->getUrl('medium');
    }

    public function getLargeUrl(): string
    {
        return $this->getUrl('large');
    }

    public function getHeroUrl(): string
    {
        return $this->getUrl('hero');
    }

    public function getDimensions(string $variant = null): array
    {
        if (!$variant) {
            return [
                'width' => $this->width,
                'height' => $this->height,
            ];
        }

        if (isset($this->variants[$variant])) {
            return [
                'width' => $this->variants[$variant]['width'] ?? null,
                'height' => $this->variants[$variant]['height'] ?? null,
            ];
        }

        return ['width' => null, 'height' => null];
    }

    public function getFileSize(string $variant = null): ?int
    {
        if (!$variant) {
            return $this->file_size;
        }

        return $this->variants[$variant]['file_size'] ?? null;
    }

    // Business Logic Methods
    public function makePrimary(): void
    {
        // Remove primary flag from other images of the same car
        self::where('car_id', $this->car_id)
            ->where('id', '!=', $this->id)
            ->update(['is_primary' => false]);

        // Set this image as primary
        $this->is_primary = true;
        $this->save();
    }

    public function publish(): void
    {
        $this->is_published = true;
        $this->save();
    }

    public function unpublish(): void
    {
        $this->is_published = false;
        $this->save();
    }

    public function updateSortOrder(int $order): void
    {
        $this->sort_order = $order;
        $this->save();
    }

    public function setType(string $type): void
    {
        if (in_array($type, self::getAllTypes())) {
            $this->type = $type;
            $this->save();
        }
    }

    public function updateAltText(string $altText): void
    {
        $this->alt_text = $altText;
        $this->save();
    }

    public function updateCaption(string $caption): void
    {
        $this->caption = $caption;
        $this->save();
    }

    // Status and Validation Methods
    public function isPrimary(): bool
    {
        return $this->is_primary;
    }

    public function isPublished(): bool
    {
        return $this->is_published;
    }

    public function isProcessed(): bool
    {
        return $this->processing_status === self::STATUS_PROCESSED;
    }

    public function isProcessing(): bool
    {
        return $this->processing_status === self::STATUS_PROCESSING;
    }

    public function hasFailed(): bool
    {
        return $this->processing_status === self::STATUS_FAILED;
    }

    public function hasVariants(): bool
    {
        return !empty($this->variants);
    }

    public function getAspectRatio(): ?float
    {
        if (!$this->width || !$this->height) {
            return null;
        }

        return $this->width / $this->height;
    }

    public function isLandscape(): bool
    {
        $ratio = $this->getAspectRatio();
        return $ratio && $ratio > 1;
    }

    public function isPortrait(): bool
    {
        $ratio = $this->getAspectRatio();
        return $ratio && $ratio < 1;
    }

    public function isSquare(): bool
    {
        $ratio = $this->getAspectRatio();
        return $ratio && abs($ratio - 1) < 0.1; // Allow small tolerance
    }

    // Utility Methods
    public function getTypeLabel(): string
    {
        return match($this->type) {
            self::TYPE_EXTERIOR => 'Exteriör',
            self::TYPE_INTERIOR => 'Interiör',
            self::TYPE_ENGINE => 'Motor',
            self::TYPE_WHEELS => 'Hjul',
            self::TYPE_DETAILS => 'Detaljer',
            self::TYPE_DAMAGE => 'Skador',
            self::TYPE_DOCUMENTS => 'Dokument',
            self::TYPE_OTHER => 'Övrigt',
            default => 'Okänd typ',
        };
    }

    public function getStatusLabel(): string
    {
        return match($this->processing_status) {
            self::STATUS_UPLOADED => 'Uppladdad',
            self::STATUS_PROCESSING => 'Bearbetas',
            self::STATUS_PROCESSED => 'Klar',
            self::STATUS_FAILED => 'Misslyckades',
            default => 'Okänd status',
        };
    }

    public function getFormattedFileSize(): string
    {
        if (!$this->file_size) {
            return 'Okänd storlek';
        }

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getMetadata(string $key = null): mixed
    {
        if ($key) {
            return $this->metadata[$key] ?? null;
        }
        
        return $this->metadata ?? [];
    }

    public function setMetadata(string $key, mixed $value): void
    {
        $metadata = $this->metadata ?? [];
        $metadata[$key] = $value;
        $this->metadata = $metadata;
        $this->save();
    }

    // Static Methods
    public static function getAllTypes(): array
    {
        return [
            self::TYPE_EXTERIOR,
            self::TYPE_INTERIOR,
            self::TYPE_ENGINE,
            self::TYPE_WHEELS,
            self::TYPE_DETAILS,
            self::TYPE_DAMAGE,
            self::TYPE_DOCUMENTS,
            self::TYPE_OTHER,
        ];
    }

    public static function getAllStatuses(): array
    {
        return [
            self::STATUS_UPLOADED,
            self::STATUS_PROCESSING,
            self::STATUS_PROCESSED,
            self::STATUS_FAILED,
        ];
    }

    public static function getVariantNames(): array
    {
        return array_keys(self::VARIANTS);
    }

    // Batch Operations
    public static function reorderImages(int $carId, array $imageIds): void
    {
        foreach ($imageIds as $index => $imageId) {
            self::where('id', $imageId)
                ->where('car_id', $carId)
                ->update(['sort_order' => $index + 1]);
        }
    }

    public static function bulkPublish(array $imageIds): int
    {
        return self::whereIn('id', $imageIds)->update(['is_published' => true]);
    }

    public static function bulkUnpublish(array $imageIds): int
    {
        return self::whereIn('id', $imageIds)->update(['is_published' => false]);
    }

    public static function bulkDelete(array $imageIds): int
    {
        $images = self::whereIn('id', $imageIds)->get();
        $deleted = 0;
        
        foreach ($images as $image) {
            if ($image->delete()) {
                $deleted++;
            }
        }
        
        return $deleted;
    }
}
