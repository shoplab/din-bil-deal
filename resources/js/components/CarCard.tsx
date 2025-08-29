import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
    Star, 
    Heart, 
    MapPin, 
    Calendar, 
    Fuel, 
    Gauge 
} from 'lucide-react';

interface Car {
    id: number;
    make: string;
    model: string;
    variant?: string;
    year: number;
    price: number;
    mileage: number;
    fuel_type: string;
    transmission: string;
    location: string;
    featured: boolean;
    rating: number;
    description: string;
    images?: string[];
}

interface CarCardProps {
    car: Car;
    viewMode?: 'grid' | 'list';
    onCardClick?: (car: Car) => void;
    onFavoriteClick?: (car: Car) => void;
    showFavoriteButton?: boolean;
}

export default function CarCard({ 
    car, 
    viewMode = 'grid', 
    onCardClick,
    onFavoriteClick,
    showFavoriteButton = true
}: CarCardProps) {
    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(car);
        }
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onFavoriteClick) {
            onFavoriteClick(car);
        }
    };

    return (
        <Card 
            className={cn(
                "overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer p-0",
                viewMode === 'list' && "flex"
            )}
            onClick={handleCardClick}
        >
            <div className={cn(
                "aspect-video bg-muted relative",
                viewMode === 'list' && "aspect-square w-64 flex-shrink-0"
            )}>
                {car.featured && (
                    <Badge className="absolute top-4 left-4 z-10">
                        Utvalda
                    </Badge>
                )}
                {showFavoriteButton && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
                        onClick={handleFavoriteClick}
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm">{car.rating}</span>
                    </div>
                </div>
            </div>
            
            <CardContent className={cn(
                "p-6",
                viewMode === 'list' && "flex-1"
            )}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {car.make} {car.model}
                        {car.variant && ` ${car.variant}`}
                    </h3>
                    <Badge variant="secondary">{car.year}</Badge>
                </div>
                
                <div className={cn(
                    "space-y-2 text-sm text-muted-foreground mb-4",
                    viewMode === 'list' && "grid grid-cols-2 gap-2"
                )}>
                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {car.location}
                    </div>
                    <div className="flex items-center">
                        <Gauge className="h-4 w-4 mr-2" />
                        {car.mileage.toLocaleString()} km
                    </div>
                    <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-2" />
                        {car.fuel_type}
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {car.transmission}
                    </div>
                </div>
                
                {viewMode === 'list' && (
                    <p className="text-sm text-muted-foreground mb-4">
                        {car.description}
                    </p>
                )}
                
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-2xl font-bold">
                            {car.price.toLocaleString()} kr
                        </span>
                        <div className="text-sm text-muted-foreground">
                            från {Math.round(car.price / 120).toLocaleString()} kr/mån
                        </div>
                    </div>
                    <Button size="sm" onClick={(e) => e.stopPropagation()}>
                        Se detaljer
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}