import AdminLayout from '../../../layouts/AdminLayout';

export default function Show({ deal }) {
    return (
        <AdminLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Deal Details</h1>
                            <p>Deal details will be implemented here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}