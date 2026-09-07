import TraineeLayout from '@/Layouts/TraineeLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { formatHours } from '@/Helpers/formatTime';
import { useState, useMemo } from 'react';
import {
    CalendarIcon,
    AdjustmentsHorizontalIcon,
    ArrowDownTrayIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SunIcon,
    MoonIcon,
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

export default function Index({ records, attendanceDates, filters, statuses }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(() => {
        if (filters?.date_from) {
            const from = new Date(filters.date_from);
            if (!isNaN(from)) return from;
        }
        return new Date();
    });

    const { data, setData, get } = useForm({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        status: filters.status || '',
    });

    const navigateMonth = (direction) => {
        const newMonth = direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1);
        setCurrentMonth(newMonth);
        const from = format(startOfMonth(newMonth), 'yyyy-MM-dd');
        const to = format(endOfMonth(newMonth), 'yyyy-MM-dd');
        setData({
            ...data,
            date_from: from,
            date_to: to,
        });
        get(route('trainee.attendance.index'), { date_from: from, date_to: to, status: data.status });
    };

    const resetFilters = () => {
        setData({
            date_from: '',
            date_to: '',
            status: '',
        });
        setCurrentMonth(new Date());
        get(route('trainee.attendance.index'), {
            date_from: '',
            date_to: '',
            status: '',
        });
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.date_from && data.date_to) {
            const from = new Date(data.date_from);
            if (!isNaN(from)) setCurrentMonth(from);
        }
        get(route('trainee.attendance.index'), data);
    };



    const handleExport = () => {
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            if (data[key]) params.append(key, data[key]);
        });
        window.location.href = route('trainee.attendance.export') + '?' + params.toString();
    };

    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentMonth]);

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
        if (!hasAttendance(date)) return;
        setSelectedDate(date);
    };

    const selectedRecord = selectedDate ? getRecordForDate(selectedDate) : null;

    const statusBadge = (status) => {
        const classes = {
            present: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
            absent: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
            incomplete: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
        };
        return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    };

    const inputBase = 'block w-full rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent';

    return (
        <TraineeLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">My Attendance History</h2>}>
            <Head title="Attendance History" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header – dark mode ready */}
                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800/50 p-4 sm:p-6 transition-colors duration-200">
                        <div className="flex items-start gap-3">
                            <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Your Attendance Calendar</h3>
                                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    View your attendance by month. Highlighted dates have records.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters (currently not visible in this component, but we keep the inputBase updated) */}

                    {/* Calendar + Detail */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Calendar container */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 transition-colors duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {format(currentMonth, 'MMMM yyyy')}
                                </h3>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => navigateMonth('prev')}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => navigateMonth('next')}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Weekday headers */}
                            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
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

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => hasAtt && handleDateClick(day)}
                                            className={`
                                                relative aspect-square flex items-center justify-center rounded-lg cursor-pointer
                                                transition-colors text-sm
                                                ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}
                                                ${hasAtt ? 'hover:bg-blue-50 dark:hover:bg-gray-700 hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                                                ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-400 dark:ring-blue-600' : ''}
                                                ${isTodayDate && !isSelected ? 'border-2 border-blue-300 dark:border-blue-600' : ''}
                                            `}
                                        >
                                            <span className="z-10">{format(day, 'd')}</span>
                                            {hasAtt && (
                                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4 justify-center">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                                    <span>Attendance recorded</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 border-2 border-blue-300 dark:border-blue-600 rounded-full"></div>
                                    <span>Today</span>
                                </div>
                            </div>
                        </div>

                        {/* Detail Panel */}
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 transition-colors duration-200">
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Attendance Details</h4>
                            {!selectedRecord ? (
                                <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
                                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                                    <p>Select a highlighted date</p>
                                    <p className="text-xs">to view attendance details</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-100">
                                                {format(new Date(selectedRecord.date), 'MMMM d, yyyy')}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRecord.department}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge(selectedRecord.status)}`}>
                                            {selectedRecord.status}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                                        {/* Morning */}
                                        <div className="bg-blue-50/70 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-100/50 dark:border-blue-800/50 transition-colors duration-200">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                                                <SunIcon className="w-3.5 h-3.5" />
                                                Morning
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
                                                <div className="text-gray-600 dark:text-gray-400">Morning In</div>
                                                <div className="text-gray-800 dark:text-gray-100 text-right font-medium">{selectedRecord.morning_time_in || '—'}</div>
                                                <div className="text-gray-600 dark:text-gray-400">Lunch Out</div>
                                                <div className="text-gray-800 dark:text-gray-100 text-right font-medium">{selectedRecord.lunch_time_out || '—'}</div>
                                                <div className="text-gray-600 dark:text-gray-400 col-span-2 border-t border-blue-200/50 dark:border-blue-800/50 pt-0.5 mt-0.5">
                                                    <span className="font-medium">Hours:</span> {formatHours(selectedRecord.morning_hours)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Afternoon */}
                                        <div className="bg-indigo-50/70 dark:bg-indigo-900/20 rounded-lg p-2 border border-indigo-100/50 dark:border-indigo-800/50 transition-colors duration-200">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                                                <MoonIcon className="w-3.5 h-3.5" />
                                                Afternoon
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
                                                <div className="text-gray-600 dark:text-gray-400">Afternoon In</div>
                                                <div className="text-gray-800 dark:text-gray-100 text-right font-medium">{selectedRecord.afternoon_time_in || '—'}</div>
                                                <div className="text-gray-600 dark:text-gray-400">Time Out</div>
                                                <div className="text-gray-800 dark:text-gray-100 text-right font-medium">{selectedRecord.time_out || '—'}</div>
                                                <div className="text-gray-600 dark:text-gray-400 col-span-2 border-t border-indigo-200/50 dark:border-indigo-800/50 pt-0.5 mt-0.5">
                                                    <span className="font-medium">Hours:</span> {formatHours(selectedRecord.afternoon_hours)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2 text-sm">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Total Hours</span>
                                            <span className="font-bold text-gray-900 dark:text-gray-100">{formatHours(selectedRecord.total_hours)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </TraineeLayout>
    );
}
