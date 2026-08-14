import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import axios from 'axios';
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
    ExclamationCircleIcon,
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

    // Correction modal state
    const [showCorrectionModal, setShowCorrectionModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [correctionField, setCorrectionField] = useState('');
    const [correctionValue, setCorrectionValue] = useState('');
    const [correctionReason, setCorrectionReason] = useState('');
    const [correctionError, setCorrectionError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form for manual attendance
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
            // For QR records, we still fill the data but disable editing
            setData({
                date: dateStr,
                morning_time_in: record.morning_time_in || '',
                lunch_time_out: record.lunch_time_out || '',
                afternoon_time_in: record.afternoon_time_in || '',
                time_out: record.time_out || '',
            });
            // If it's a QR record, we don't open the manual modal; we open the correction modal directly?
            // We'll open the manual modal anyway, but it will show a "Correct" button instead of save.
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
        // If there is a QR record, we should not allow manual save.
        if (editingRecord && !editingRecord.is_manual) {
            // This should not happen because we conditionally show the correct button.
            return;
        }
        post(route('hrmo.trainees.attendance.store', trainee.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
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

    // Correction handlers
    const openCorrectionModal = (attendance) => {
        setSelectedAttendance(attendance);
        setCorrectionField('');
        setCorrectionValue('');
        setCorrectionReason('');
        setCorrectionError(null);
        setShowCorrectionModal(true);
        // Close the manual modal
        setShowModal(false);
    };

    const handleCorrectionSubmit = async () => {
    if (!correctionField) {
        setCorrectionError('Please select a field to correct.');
        return;
    }
    if (!correctionReason.trim()) {
        setCorrectionError('Please provide a reason for the correction.');
        return;
    }

    setIsSubmitting(true);
    setCorrectionError(null);

    try {
        // Convert datetime-local value to Y-m-d H:i:s
        let formattedValue = null;
        if (correctionValue) {
            const dateObj = new Date(correctionValue);
            if (!isNaN(dateObj)) {
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const hours = String(dateObj.getHours()).padStart(2, '0');
                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                const seconds = String(dateObj.getSeconds()).padStart(2, '0');
                formattedValue = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            }
        }

        await axios.post(route('hrmo.attendance-corrections.store'), {
            attendance_id: selectedAttendance.id,
            field: correctionField,
            new_value: formattedValue,
            reason: correctionReason,
        });

        setShowCorrectionModal(false);
        setSelectedAttendance(null);
        setCorrectionField('');
        setCorrectionValue('');
        setCorrectionReason('');
        window.location.reload();
    } catch (err) {
        // Handle both validation errors and other errors
        let errorMsg = 'Failed to save correction. Please try again.';
        if (err.response?.data?.errors) {
            // Laravel validation errors
            const messages = Object.values(err.response.data.errors).flat();
            errorMsg = messages.join('. ');
        } else if (err.response?.data?.message) {
            errorMsg = err.response.data.message;
        }
        setCorrectionError(errorMsg);
    } finally {
        setIsSubmitting(false);
    }
};



    const closeCorrectionModal = () => {
        setShowCorrectionModal(false);
        setSelectedAttendance(null);
        setCorrectionField('');
        setCorrectionValue('');
        setCorrectionReason('');
        setCorrectionError(null);
    };

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

            {/* Modal for adding/editing manual attendance */}
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

                        {editingRecord && !editingRecord.is_manual ? (
                            // QR record – show read‑only + Correct button
                            <div>
                                <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    This record was created via QR scan. Use the correction button below to modify it.
                                </div>
                                {/* Read‑only fields */}
                                <div className="space-y-3 opacity-70">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Morning Time In</label>
                                        <input
                                            type="text"
                                            value={data.morning_time_in || '—'}
                                            disabled
                                            className="mt-1 block w-full border-gray-200 bg-gray-50 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lunch Time Out</label>
                                        <input
                                            type="text"
                                            value={data.lunch_time_out || '—'}
                                            disabled
                                            className="mt-1 block w-full border-gray-200 bg-gray-50 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Afternoon Time In</label>
                                        <input
                                            type="text"
                                            value={data.afternoon_time_in || '—'}
                                            disabled
                                            className="mt-1 block w-full border-gray-200 bg-gray-50 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Time Out</label>
                                        <input
                                            type="text"
                                            value={data.time_out || '—'}
                                            disabled
                                            className="mt-1 block w-full border-gray-200 bg-gray-50 rounded-md shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => openCorrectionModal(editingRecord)}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                    >
                                        <PencilSquareIcon className="w-4 h-4 inline mr-1" />
                                        Correct
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // No record or manual record – allow add/edit
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
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lunch Time Out</label>
                                        <input
                                            type="time"
                                            value={data.lunch_time_out}
                                            onChange={e => setData('lunch_time_out', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Afternoon Time In</label>
                                        <input
                                            type="time"
                                            value={data.afternoon_time_in}
                                            onChange={e => setData('afternoon_time_in', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Time Out</label>
                                        <input
                                            type="time"
                                            value={data.time_out}
                                            onChange={e => setData('time_out', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : (editingRecord ? 'Update' : 'Add')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Correction Modal */}
            {showCorrectionModal && selectedAttendance && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Correct Attendance</h3>
                            <button
                                onClick={closeCorrectionModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-1">
                            <p className="text-sm text-gray-600">
                                Trainee: <span className="font-medium text-gray-800">{selectedAttendance.trainee || trainee.full_name}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Date: <span className="font-medium text-gray-800">{format(new Date(selectedAttendance.date), 'MMMM d, yyyy')}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Current Status: <span className="font-medium text-gray-800">{selectedAttendance.status}</span>
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field to Correct <span className="text-red-500">*</span></label>
                            <select
                                value={correctionField}
                                onChange={(e) => {
                                    setCorrectionField(e.target.value);
                                    setCorrectionValue('');
                                }}
                                className="block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select field...</option>
                                <option value="morning_time_in">Morning Time In</option>
                                <option value="lunch_time_out">Lunch Time Out</option>
                                <option value="afternoon_time_in">Afternoon Time In</option>
                                <option value="time_out">Time Out</option>
                            </select>
                        </div>

                        {correctionField && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Value <span className="text-red-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    value={correctionValue}
                                    onChange={(e) => setCorrectionValue(e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Current value: <span className="font-medium">{selectedAttendance[correctionField] || 'Not set'}</span>
                                </p>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Correction <span className="text-red-500">*</span></label>
                            <textarea
                                value={correctionReason}
                                onChange={(e) => setCorrectionReason(e.target.value)}
                                rows="3"
                                className="block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="Explain why this correction is needed..."
                            />
                        </div>

                        {correctionError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2 text-sm">
                                <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{correctionError}</span>
                            </div>
                        )}

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                            <button
                                onClick={closeCorrectionModal}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCorrectionSubmit}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <PencilSquareIcon className="w-4 h-4" />
                                        Save Correction
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </HrmoLayout>
    );
}
