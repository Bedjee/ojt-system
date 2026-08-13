import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AdminLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}>
            <Head title="Admin Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Welcome, Admin!</div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
