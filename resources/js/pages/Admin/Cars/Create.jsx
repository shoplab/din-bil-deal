import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
    Car,
    ArrowLeft,
    Upload,
    X,
    Plus
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CarCreate({ users }) {
    const { data, setData, post, processing, errors } = useForm({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        fuel_type: '',
        transmission: '',
        body_type: '',
        color: '',
        interior_color: '',
        condition: '',
        status: 'available',
        description: '',
        features: [],
        images: [],
        published: false,
        created_by: ''
    });

    const [newFeature, setNewFeature] = useState('');
    const [imagePreview, setImagePreview] = useState([]);

    const fuelTypes = [
        { value: 'gasoline', label: 'Bensin' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'electric', label: 'El' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'plugin_hybrid', label: 'Laddhybrid' }
    ];

    const transmissionTypes = [
        { value: 'manual', label: 'Manuell' },
        { value: 'automatic', label: 'Automat' },
        { value: 'cvt', label: 'CVT' }
    ];

    const bodyTypes = [
        { value: 'sedan', label: 'Sedan' },
        { value: 'hatchback', label: 'Halvkombi' },
        { value: 'wagon', label: 'Kombi' },
        { value: 'suv', label: 'SUV' },
        { value: 'coupe', label: 'Coupé' },
        { value: 'convertible', label: 'Cabriolet' },
        { value: 'pickup', label: 'Pickup' },
        { value: 'van', label: 'Skåpbil' }
    ];

    const conditions = [
        { value: 'excellent', label: 'Utmärkt' },
        { value: 'very_good', label: 'Mycket bra' },
        { value: 'good', label: 'Bra' },
        { value: 'fair', label: 'Godtagbar' },
        { value: 'poor', label: 'Dålig' }
    ];

    const statuses = [
        { value: 'available', label: 'Tillgänglig' },
        { value: 'reserved', label: 'Reserverad' },
        { value: 'sold', label: 'Såld' },
        { value: 'maintenance', label: 'Underhåll' }
    ];

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const removeImage = (index) => {
        const newImages = [...data.images];
        const newPreviews = [...imagePreview];
        
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setData('images', newImages);
        setImagePreview(newPreviews);
    };

    const addFeature = () => {
        if (newFeature.trim() && !data.features.includes(newFeature.trim())) {
            setData('features', [...data.features, newFeature.trim()]);
            setNewFeature('');
        }
    };

    const removeFeature = (index) => {
        const newFeatures = [...data.features];
        newFeatures.splice(index, 1);
        setData('features', newFeatures);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'images') {
                data.images.forEach((image, index) => {
                    formData.append(`images[${index}]`, image);
                });
            } else if (key === 'features') {
                data.features.forEach((feature, index) => {
                    formData.append(`features[${index}]`, feature);
                });
            } else {
                formData.append(key, data[key]);
            }
        });

        post(route('admin.cars.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Fordon skapat framgångsrikt!', {
                    description: `${data.make} ${data.model} har lagts till i systemet.`,
                });
            },
            onError: () => {
                toast.error('Fel vid skapande', {
                    description: 'Något gick fel när fordonet skulle skapas. Kontrollera att alla obligatoriska fält är ifyllda.',
                });
            }
        });
    };

    return (
        <AdminLayout title="Skapa fordon">
            <Head title="Skapa fordon - Admin" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href={route('admin.cars.index')}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Tillbaka
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Skapa nytt fordon</h1>
                    <p className="text-gray-600">Lägg till ett nytt fordon i systemet</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Basic Information */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Grundinformation</CardTitle>
                                <CardDescription>Grundläggande information om fordonet</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="make">Märke *</Label>
                                        <Input
                                            id="make"
                                            value={data.make}
                                            onChange={(e) => setData('make', e.target.value)}
                                            placeholder="t.ex. Volvo"
                                            className={errors.make ? 'border-red-500' : ''}
                                        />
                                        {errors.make && <p className="text-sm text-red-500 mt-1">{errors.make}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="model">Modell *</Label>
                                        <Input
                                            id="model"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            placeholder="t.ex. XC90"
                                            className={errors.model ? 'border-red-500' : ''}
                                        />
                                        {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="year">År *</Label>
                                        <Input
                                            id="year"
                                            type="number"
                                            value={data.year}
                                            onChange={(e) => setData('year', parseInt(e.target.value))}
                                            min="1900"
                                            max={new Date().getFullYear() + 1}
                                            className={errors.year ? 'border-red-500' : ''}
                                        />
                                        {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="price">Pris (SEK) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="t.ex. 299000"
                                            min="0"
                                            className={errors.price ? 'border-red-500' : ''}
                                        />
                                        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="mileage">Mätarställning (km) *</Label>
                                        <Input
                                            id="mileage"
                                            type="number"
                                            value={data.mileage}
                                            onChange={(e) => setData('mileage', e.target.value)}
                                            placeholder="t.ex. 45000"
                                            min="0"
                                            className={errors.mileage ? 'border-red-500' : ''}
                                        />
                                        {errors.mileage && <p className="text-sm text-red-500 mt-1">{errors.mileage}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="fuel_type">Bränsletyp *</Label>
                                        <Select 
                                            value={data.fuel_type} 
                                            onValueChange={(value) => setData('fuel_type', value)}
                                        >
                                            <SelectTrigger className={errors.fuel_type ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Välj bränsletyp" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fuelTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.fuel_type && <p className="text-sm text-red-500 mt-1">{errors.fuel_type}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="transmission">Växellåda *</Label>
                                        <Select 
                                            value={data.transmission} 
                                            onValueChange={(value) => setData('transmission', value)}
                                        >
                                            <SelectTrigger className={errors.transmission ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Välj växellåda" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {transmissionTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.transmission && <p className="text-sm text-red-500 mt-1">{errors.transmission}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="body_type">Karosstyp *</Label>
                                        <Select 
                                            value={data.body_type} 
                                            onValueChange={(value) => setData('body_type', value)}
                                        >
                                            <SelectTrigger className={errors.body_type ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Välj karosstyp" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bodyTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.body_type && <p className="text-sm text-red-500 mt-1">{errors.body_type}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="color">Färg *</Label>
                                        <Input
                                            id="color"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            placeholder="t.ex. Svart"
                                            className={errors.color ? 'border-red-500' : ''}
                                        />
                                        {errors.color && <p className="text-sm text-red-500 mt-1">{errors.color}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="interior_color">Inredningsfärg</Label>
                                        <Input
                                            id="interior_color"
                                            value={data.interior_color}
                                            onChange={(e) => setData('interior_color', e.target.value)}
                                            placeholder="t.ex. Beige"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="condition">Skick *</Label>
                                        <Select 
                                            value={data.condition} 
                                            onValueChange={(value) => setData('condition', value)}
                                        >
                                            <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Välj skick" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {conditions.map((condition) => (
                                                    <SelectItem key={condition.value} value={condition.value}>
                                                        {condition.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.condition && <p className="text-sm text-red-500 mt-1">{errors.condition}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select 
                                            value={data.status} 
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Välj status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Beskrivning</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Beskriv fordonet..."
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                                </div>

                                {/* Features */}
                                <div>
                                    <Label>Utrustning och funktioner</Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            placeholder="Lägg till utrustning..."
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        />
                                        <Button type="button" onClick={addFeature} variant="outline">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {data.features.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {data.features.map((feature, index) => (
                                                <Badge key={index} variant="secondary" className="cursor-pointer">
                                                    {feature}
                                                    <X 
                                                        className="h-3 w-3 ml-1" 
                                                        onClick={() => removeFeature(index)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Side Information */}
                    <div className="space-y-6">
                        {/* Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Bilder</CardTitle>
                                <CardDescription>Ladda upp bilder på fordonet</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label htmlFor="images">Välj bilder</Label>
                                    <Input
                                        id="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-2"
                                    />
                                    {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images}</p>}
                                    
                                    {imagePreview.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {imagePreview.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-1 right-1 h-6 w-6 p-0"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Publishing */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Publicering</CardTitle>
                                <CardDescription>Inställningar för publicering</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="created_by">Säljare *</Label>
                                    <Select 
                                        value={data.created_by} 
                                        onValueChange={(value) => setData('created_by', value)}
                                    >
                                        <SelectTrigger className={errors.created_by ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Välj säljare" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.created_by && <p className="text-sm text-red-500 mt-1">{errors.created_by}</p>}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="published"
                                        checked={data.published}
                                        onCheckedChange={(checked) => setData('published', checked)}
                                    />
                                    <Label htmlFor="published">Publicera direkt</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col gap-2">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full"
                                    >
                                        <Car className="h-4 w-4 mr-2" />
                                        {processing ? 'Skapar...' : 'Skapa fordon'}
                                    </Button>
                                    
                                    <Link href={route('admin.cars.index')}>
                                        <Button variant="outline" className="w-full">
                                            Avbryt
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}