import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head } from '@inertiajs/react';
import {
    QrCodeIcon,
    ArrowDownTrayIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

export default function Show({ qrImage }) {
    // Extract HTML from various formats
    let qrHtml = '';

    if (typeof qrImage === 'string') {
        qrHtml = qrImage;
    } else if (qrImage && typeof qrImage === 'object') {
        // Check common serialization keys
        if (qrImage.__html) {
            qrHtml = qrImage.__html;
        } else if (qrImage.html) {
            qrHtml = qrImage.html;
        } else if (qrImage.svg) {
            qrHtml = qrImage.svg;
        } else if (typeof qrImage.toString === 'function') {
            const str = qrImage.toString();
            if (str.startsWith('<svg')) {
                qrHtml = str;
            }
        }
    }

    const hasQr = !!qrHtml;

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Official QR Code</h2>}>
            <Head title="QR Code" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-4 sm:p-6">
                        <div className="flex items-start gap-3">
                            <QrCodeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Official OJT QR Code</h3>
                                <p className="text-sm sm:text-base text-gray-700">
                                    Trainees scan this code using the mobile app to record their attendance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-xl p-4 sm:p-8">
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-50 p-4 sm:p-8 rounded-xl border-2 border-dashed border-gray-200 mb-6 w-full max-w-sm mx-auto">
                                {hasQr ? (
                                    <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: qrHtml }} />
                                ) : (
                                    <div className="text-center text-gray-400 py-8">
                                        <QrCodeIcon className="w-16 h-16 mx-auto text-gray-300" />
                                        <p className="mt-2 text-sm">QR code not available</p>
                                    </div>
                                )}
                            </div>

                            <div className="w-full max-w-sm space-y-4">
                                <div className="flex items-start gap-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                    <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span>
                                        Trainees should open the <span className="font-medium">Scan Attendance</span> feature in their mobile app and point the camera at this QR code.
                                    </span>
                                </div>

                                <a
                                    href={route('hrmo.qr-code.download')}
                                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    Download QR Code
                                </a>

                                <p className="text-xs text-gray-400 text-center">
                                    PNG image • 500×500 pixels • suitable for printing
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}
