import CustomerLayout from '../../layouts/CustomerLayout';
import CarCard from '../../components/CarCard';

export default function SavedCars({ savedCars }) {
    const handleCardClick = (car) => {
        window.location.href = `/cars/${car.id}`;
    };

    return (
        <CustomerLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">Mina sparade bilar</h1>
                            
                            {savedCars && savedCars.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedCars.map(car => (
                                        <CarCard 
                                            key={car.id} 
                                            car={car} 
                                            onCardClick={() => handleCardClick(car)}
                                            showFavoriteButton={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Du har inga sparade bilar ännu.</p>
                                    <a 
                                        href="/cars" 
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Bläddra bland bilar
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}