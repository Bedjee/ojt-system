import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Edit({ trainee, departments }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: trainee.first_name,
        middle_name: trainee.middle_name || '',
        last_name: trainee.last_name,
        email: trainee.email,
        contact_number: trainee.contact_number || '',
        school: trainee.school,
        course: trainee.course,
        year_level: trainee.year_level,
        start_date: trainee.start_date,
        expected_end_date: trainee.expected_end_date || '',
        required_hours: trainee.required_hours,
        department_id: trainee.department_id || '',
        supervisor: trainee.supervisor || '',
        status: trainee.status,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('hrmo.trainees.update', trainee.id));
    }

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Trainee</h2>}>
            <Head title="Edit Trainee" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                                {/* All fields same as Create, but with default values from data */}
                                {/* ... copy the fields from Create, using data values */}
                                <div className="flex items-center justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        Update Trainee
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}
