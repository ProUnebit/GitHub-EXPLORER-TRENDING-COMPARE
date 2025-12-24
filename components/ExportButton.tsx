'use client';

import { useState } from 'react';
import { Download, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
            } else if (format === 'csv' && onExportCSV) {
                await onExportCSV();
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    // Если только один формат - кнопка без dropdown
    if (formats.length === 1) {
        return (
            <Button
                onClick={() => handleExport(formats[0])}
                disabled={disabled || isExporting}
                variant="outline"
                size="sm"
            >
                {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Download className="mr-2 h-4 w-4" />
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <FileDown className="mr-2 h-4 w-4" />
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
