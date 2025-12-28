'use client';

import { useState } from 'react';
import { Download, FileDown, LoaderPinwheel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { delay } from '@/lib/utils/async';

// ============================================
// EXPORT BUTTON - Client Component
// ============================================
// Переиспользуемая кнопка экспорта с выбором формата
//
// Props:
// - onExportPDF: callback для PDF экспорта
// - onExportCSV: callback для CSV экспорта
// - formats: доступные форматы ['pdf', 'csv']
// - disabled: отключить кнопку

type ExportButtonProps = {
    onExportPDF?: () => void | Promise<void>;
    onExportCSV?: () => void | Promise<void>;
    formats?: Array<'pdf' | 'csv'>;
    disabled?: boolean;
    label?: string;
};

export function ExportButton({
    onExportPDF,
    onExportCSV,
    formats = ['pdf', 'csv'],
    disabled = false,
    label = 'Export',
}: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (format: 'pdf' | 'csv') => {
        setIsExporting(true);


        try {
            if (format === 'pdf' && onExportPDF) {
                await onExportPDF();
                toast.success('PDF exported successfully!'); 
            } else if (format === 'csv' && onExportCSV) {
                await onExportCSV();
                toast.success('CSV exported successfully!');
            }
            await delay(1000);
        } catch (error) {
            toast.error(`Export failed`, {
                description: 'Please try again',
            });
        } finally {
            setIsExporting(false)
        }
    };

    // Если только один формат - кнопка без dropdown
    if (formats.length === 1) {
        return (
            <Button
                onClick={() => handleExport(formats[0])}
                disabled={disabled || isExporting}
                variant="outline"
                className='hover:border-teal-400 dark:hover:border-teal-500 dark:hover:bg-accent hover:bg-slate-50 cursor-pointer bg-stone-50 '
            >
                {isExporting ? (
                    <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin text-teal-600 dark:text-amber-300/80" />
                ) : (
                    <Download className="mr-2 h-4 w-4 text-teal-600 " />
                )}
                {label} ({formats[0].toUpperCase()})
            </Button>
        );
    }

    // Если несколько форматов - dropdown
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    disabled={disabled || isExporting}
                    variant="outline"
                    size="sm"
                >
                    {isExporting ? (
                        <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin text-teal-600" />
                    ) : (
                        <FileDown className="mr-2 h-4 w-4 text-teal-600" />
                    )}
                    {label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {formats.includes('pdf') && onExportPDF && (
                    <DropdownMenuItem
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        Export as PDF
                    </DropdownMenuItem>
                )}
                {formats.includes('csv') && onExportCSV && (
                    <DropdownMenuItem
                        onClick={() => handleExport('csv')}
                        disabled={isExporting}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export as CSV
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
