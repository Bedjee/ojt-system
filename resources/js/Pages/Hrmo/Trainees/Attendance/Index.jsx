import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    CalendarIcon,
    PlusCircleIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isToday,
    isSameDay,
    addMonths,
    subMonths,
} from 'date-fns';

export default function Index({ trainee, records, attendanceDates }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        date: '',
        morning_time_in: '',
        lunch_time_out: '',
        afternoon_time_in: '',
        time_out: '',
    });

    // Map records by date for quick lookup
    const recordsByDate = useMemo(() => {
        const map = {};
        records.forEach(record => {
            map[record.date] = record;
        });
        return map;
    }, [records]);

    const hasAttendance = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return attendanceDates.includes(dateStr);
    };

    const getRecordForDate = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return recordsByDate[dateStr] || null;
    };

    const handleDateClick = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const record = getRecordForDate(date);
        setSelectedDate(date);
        if (record) {
            setEditingRecord(record);
            setData({
                date: dateStr,
                morning_time_in: record.morning_time_in || '',
                lunch_time_out: record.lunch_time_out || '',
                afternoon_time_in: record.afternoon_time_in || '',
                time_out: record.time_out || '',
            });
        } else {
            setEditingRecord(null);
            setData({
                date: dateStr,
                morning_time_in: '',
                lunch_time_out: '',
                afternoon_time_in: '',
                time_out: '',
            });
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('hrmo.trainees.attendance.store', trainee.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                // Refresh page or update records
                window.location.reload();
            },
        });
    };

    const handleDelete = (recordId) => {
        if (confirm('Delete this manually added attendance?')) {
            router.delete(route('hrmo.trainees.attendance.destroy', [trainee.id, recordId]), {
                preserveScroll: true,
                onSuccess: () => window.location.reload(),
            });
        }
    };

    const navigateMonth = (direction) => {
        const newMonth = direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1);
        setCurrentMonth(newMonth);
    };

    // Calendar grid
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentMonth]);

    // Format time for input (HH:mm)
    const timeToInput = (timeStr) => {
        if (!timeStr) return '';
        // timeStr is like "8:00 AM" or "12:30 PM"
        // We need to convert to "08:00" or "12:30"
        const parts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/);
        if (!parts) return '';
        let hours = parseInt(parts[1]);
        const minutes = parts[2];
        const ampm = parts[3];
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        return `${String(hours).padStart(2, '0')}:${minutes}`;
    };

    const selectedRecord = selectedDate ? getRecordForDate(selectedDate) : null;

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage Attendance – {trainee.full_name}</h2>}>
            <Head title="Manage Attendance" />
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Trainee Info */}
                    <div className="mb-6 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                            <div>
                                <p className="text-sm text-gray-500">Trainee</p>
                                <p className="text-xl font-semibold">{trainee.full_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="font-medium">{trainee.department}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Required Hours</p>
                                <p className="font-medium">{trainee.required_hours} hrs</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Rendered (total)</p>
                                <p className="font-medium text-green-600">{trainee.rendered_hours} hrs</p>
                            </div>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {format(currentMonth, 'MMMM yyyy')}
                            </h3>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => navigateMonth('prev')}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => navigateMonth('next')}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="py-1">{day}</div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const hasAtt = hasAttendance(day);
                                const isTodayDate = isToday(day);
                                const isSelected = selectedDate && isSameDay(day, selectedDate);
                                const record = getRecordForDate(day);
                                const isManual = record?.is_manual;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleDateClick(day)}
                                        className={`
                                            relative aspect-square flex items-center justify-center rounded-lg cursor-pointer
                                            transition-colors text-sm
                                            ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                                            ${hasAtt ? 'hover:ring-2 hover:ring-blue-200' : 'hover:bg-gray-50'}
                                            ${isSelected ? 'bg-blue-100 ring-2 ring-blue-400' : ''}
                                            ${isTodayDate && !isSelected ? 'border-2 border-blue-300' : ''}
                                            ${isManual ? 'bg-indigo-50' : ''}
                                        `}
                                    >
                                        <span className="z-10">{format(day, 'd')}</span>
                                        {hasAtt && (
                                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isManual ? 'bg-indigo-500' : 'bg-blue-500'}`}></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 text-xs text-gray-500 flex flex-wrap items-center gap-3 justify-center">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span>QR attendance</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span>Manual credit</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 border-2 border-blue-300 rounded-full"></div>
                                <span>Today</span>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm text-gray-500">
                            Click a date to add or edit attendance.
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for adding/editing attendance */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select Date'}
                            </h3>
                            {editingRecord && editingRecord.is_manual && (
                                <button
                                    onClick={() => handleDelete(editingRecord.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {editingRecord && !editingRecord.is_manual && (
                            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5" />
                                This record was created via QR scan and cannot be edited here.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <input type="hidden" value={data.date} />

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Morning Time In</label>
                                    <input
                                        type="time"
                                        value={data.morning_time_in}
                                        onChange={e => setData('morning_time_in', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        disabled={editingRecord && !editingRecord.is_manual}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lunch Time Out</label>
                                    <input
                                        type="time"
                                        value={data.lunch_time_out}
                                        onChange={e => setData('lunch_time_out', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        disabled={editingRecord && !editingRecord.is_manual}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Afternoon Time In</label>
                                    <input
                                        type="time"
                                        value={data.afternoon_time_in}
                                        onChange={e => setData('afternoon_time_in', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        disabled={editingRecord && !editingRecord.is_manual}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time Out</label>
                                    <input
                                        type="time"
                                        value={data.time_out}
                                        onChange={e => setData('time_out', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        disabled={editingRecord && !editingRecord.is_manual}
                                    />
                                </div>
                            </div>

                            {errors && Object.keys(errors).length > 0 && (
                                <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                    {Object.values(errors).map((err, i) => <p key={i}>{err}</p>)}
                                </div>
                            )}

                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                {(editingRecord && !editingRecord.is_manual) ? (
                                    <div className="text-sm text-gray-500">Read‑only</div>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Attendance'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </HrmoLayout>
    );
}
