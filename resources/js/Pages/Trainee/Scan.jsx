import TraineeLayout from '@/Layouts/TraineeLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import {
    CameraIcon,
    ArrowPathIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ClockIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function Scan() {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [manualSecret, setManualSecret] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalError, setModalError] = useState(null);

    // References
    const html5QrCodeRef = useRef(null);
    const scannerContainerRef = useRef(null);
    const isCleaningRef = useRef(false);

    // Cleanup scanner function
    const cleanupScanner = useCallback(async () => {
        if (isCleaningRef.current) return;
        isCleaningRef.current = true;

        const scanner = html5QrCodeRef.current;
        if (scanner) {
            try {
                await scanner.stop().catch(() => {});
                await scanner.clear().catch(() => {});
            } catch (err) {
                // ignore
            }
            html5QrCodeRef.current = null;
        }
        isCleaningRef.current = false;
    }, []);

    // === QR Scanner Lifecycle ===
    useEffect(() => {
        if (!scanning) {
            cleanupScanner();
            return;
        }

        const container = scannerContainerRef.current;
        if (!container) return;

        if (html5QrCodeRef.current) {
            cleanupScanner().then(() => {
                initializeScanner();
            });
        } else {
            initializeScanner();
        }

        function initializeScanner() {
            const html5QrCode = new Html5Qrcode(container.id);
            html5QrCodeRef.current = html5QrCode;

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            };

            html5QrCode.start(
                { facingMode: 'environment' },
                config,
                onScanSuccess,
                onScanError
            ).catch((err) => {
                console.error('Scanner start error:', err);
                setError('Unable to access camera. Please check permissions.');
                setScanning(false);
            });
        }

        return () => {
            cleanupScanner();
        };
    }, [scanning, cleanupScanner]);

    // === Scan success/error handlers ===
    const onScanSuccess = useCallback(async (decodedText) => {
        setScanning(false);
        await handleScan(decodedText);
    }, []);

    const onScanError = useCallback((errorMessage) => {
        if (errorMessage.includes('No QR code found')) {
            return;
        }
        console.warn('QR scan error:', errorMessage);
    }, []);

    // === Get current location ===
    const getLocation = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser.'));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    });
                },
                (error) => {
                    let message = 'Unable to get your location. ';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message += 'Please allow location access in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message += 'GPS signal not available. Please move to an open area.';
                            break;
                        case error.TIMEOUT:
                            message += 'Location request timed out. Please try again.';
                            break;
                        default:
                            message += 'Please enable GPS and try again.';
                    }
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0,
                }
            );
        });
    }, []);

    // === Main scan handler (with location) ===
    const handleScan = async (data) => {
        if (!data || isProcessing) return;

        setIsProcessing(true);
        setError(null);
        setLocationError(null);

        // Show modal with loading state
        setShowModal(true);
        setModalLoading(true);
        setModalData(null);
        setModalError(null);

        try {
            // 1. Get location (if possible)
            let location = null;
            try {
                location = await getLocation();
                setLocation(location);
                console.log('📍 Location obtained:', location);
            } catch (locErr) {
                setLocationError(locErr.message);
                // We still proceed, but backend may reject if geofencing is enabled
                // The backend will return a clear error message.
            }

            // 2. Send scan with location data
            const response = await axios.post(route('trainee.scan'), {
                scanned_data: data,
                latitude: location?.latitude || null,
                longitude: location?.longitude || null,
            });

            setModalLoading(false);
            setModalData(response.data);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Scan failed. Please try again.';
            setError(errorMsg);
            setModalLoading(false);
            setModalError(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalData(null);
        setModalError(null);
        setScanning(false);
        setManualSecret('');
        cleanupScanner();
    };

    return (
        <TraineeLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Scan Attendance</h2>}>
            <Head title="Scan Attendance" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Human‑centered message – dark mode ready */}
                    <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl shadow-sm border border-purple-100 dark:border-purple-800/50 p-4 sm:p-6 transition-colors duration-200">
                        <div className="flex items-start gap-3">
                            <CameraIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Ready to log your attendance?</h3>
                                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    Hold your phone over the official OJT QR code. We'll record your time in/out instantly.
                                </p>
                                {locationError && (
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                        ⚠️ {locationError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4 sm:p-6 transition-colors duration-200">
                        {/* QR Scanner Section */}
                        <div className="w-full">
                            {!scanning ? (
                                <button
                                    onClick={() => setScanning(true)}
                                    className="w-full py-3 sm:py-4 bg-blue-600 dark:bg-blue-700 text-white rounded-xl text-base sm:text-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    Start Camera
                                </button>
                            ) : (
                                <div className="relative">
                                    <div
                                        id="qr-reader"
                                        ref={scannerContainerRef}
                                        className="bg-black rounded-xl overflow-hidden aspect-square max-w-sm mx-auto"
                                    />
                                    <button
                                        onClick={() => setScanning(false)}
                                        className="absolute top-2 right-2 p-2 bg-red-500 dark:bg-red-600 text-white rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                                        aria-label="Stop camera"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                    {isProcessing && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                                            <ArrowPathIcon className="w-10 h-10 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>



                        {/* Error display (for non‑modal errors) */}
                        {error && !showModal && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-2 text-sm sm:text-base transition-colors duration-200">
                                <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========== MODAL ========== */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto transform transition-all scale-100 p-5 sm:p-8">
                        {modalLoading ? (
                            // --- Loading state ---
                            <div className="text-center py-8">
                                <ArrowPathIcon className="w-14 h-14 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">Processing your scan...</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Please wait while we record your attendance.</p>
                            </div>
                        ) : modalError ? (
                            // --- Error state ---
                            <div className="text-center py-6">
                                <ExclamationCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 dark:text-red-400 mx-auto mb-4" />
                                <h3 className="text-xl sm:text-2xl font-bold text-red-800 dark:text-red-300">Scan Failed</h3>
                                <p className="text-sm sm:text-base text-red-600 dark:text-red-300 mt-2">{modalError}</p>
                                <button
                                    onClick={closeModal}
                                    className="mt-6 w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-red-600 dark:bg-red-700 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-base font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : modalData && (
                            // --- Success state ---
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3 sm:p-4">
                                        <CheckCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">Success!</h3>

                                <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50 text-left">
                                    <p className="text-green-800 dark:text-green-200 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                                        {modalData.message}
                                    </p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 text-left">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Action</span>
                                        <p className="font-semibold text-xs sm:text-sm mt-0.5 flex items-center gap-1.5 text-gray-900 dark:text-gray-100">
                                            <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400" />
                                            {modalData.action_label}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Recorded at</span>
                                        <p className="font-semibold text-xs sm:text-sm mt-0.5 text-gray-900 dark:text-gray-100">
                                            {new Date(modalData.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Today's hours</span>
                                        <p className="font-semibold text-xs sm:text-sm mt-0.5 text-blue-600 dark:text-blue-400">
                                            {modalData.today_hours} hrs
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Remaining</span>
                                        <p className="font-semibold text-xs sm:text-sm mt-0.5 text-yellow-600 dark:text-yellow-400">
                                            {modalData.remaining_hours} hrs
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        <span className="font-medium">Completion</span>
                                        <span className="font-bold text-gray-700 dark:text-gray-200">{modalData.completion_percent}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-700"
                                            style={{ width: `${modalData.completion_percent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <button
                                    onClick={closeModal}
                                    className="mt-6 w-full py-3 sm:py-3.5 bg-blue-600 dark:bg-blue-700 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-base sm:text-lg font-medium shadow-sm flex items-center justify-center gap-2"
                                >
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Okay, Thank You
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </TraineeLayout>
    );
}
