import React, {RefObject, useState} from 'react';
import {Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from '@mui/material';
import MaintenanceReportCard from "./cards/MaintenanceReportCard";
import {MaintenanceReportWithStringsType} from '@/types/maintenance';
import axios from "axios";
import {API} from "@/constants/endpoints";
import {useMaintenanceReport} from "@/hooks/maintenance/useMaintenanceReport";
import useGeneralDataStore from '../store/useGeneralDataStore';
import NewMaintenanceReportDialog from "./dialogs/NewMaintenanceReportDialog";
import {useTranslation} from "react-i18next";

interface MaintenanceReportsListProps {
    reports: MaintenanceReportWithStringsType[];
    setOpenSnackBar: (open: boolean) => void;
    openSnackbar: boolean;
    snackBarMessage: string;
    reportRefs?: RefObject<Map<string, HTMLDivElement>>;
}

const MaintenanceReportsList: React.FC<MaintenanceReportsListProps> = ({
                                                                           reports,
                                                                           setOpenSnackBar,
                                                                           reportRefs,
                                                                       }) => {
    const {setMaintenanceReports, maintenanceReports} = useGeneralDataStore();
    const {
        isLoading,
        setIsLoading,
        error,
        handleAddPartPurchase,
        handleAddServiceEvent,
        handleMaintenanceReportFormChange,
        handleMaintenanceReportSubmission,
        handleRemovePartPurchase,
        handleRemoveServiceEvent,
        handleServiceProviderChange,
        handlePartPurchaseChange,
        partPurchaseEvent,
        serviceProviderEvent,
        setError,
        setOpenFormDialog,
        maintenanceReportFormData,
        openFormDialog,
        setMaintenanceReportFormData,
    } = useMaintenanceReport(setOpenSnackBar);
    const {setRequest} = useGeneralDataStore();
    const {t} = useTranslation();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<MaintenanceReportWithStringsType | null>(null);

    // Handle opening delete confirmation dialog
    const handleDeleteClick = (report: MaintenanceReportWithStringsType) => {
        setReportToDelete(report);
        setDeleteDialogOpen(true);
        setRequest('delete');
    };

    // Handle confirmed deletion
    const handleConfirmDelete = async () => {
        if (!reportToDelete) return;
        setIsLoading(true);

        try {
            const options = {headers: {"Content-Type": "application/json"}, withCredentials: true};
            const url = `${API}maintenance/reports/${reportToDelete.id}/`;
            await axios.delete(url, options);
            setDeleteDialogOpen(false);
            setMaintenanceReports(maintenanceReports.filter(report => report.id !== reportToDelete.id));
            setOpenSnackBar(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (report: MaintenanceReportWithStringsType) => {
        setOpenFormDialog(true)
        setRequest('edit')
        setMaintenanceReportFormData(report)
    }
    return (
        <Box maxWidth={'lg'}>


            {/* Results Summary */}
            {/*<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>*/}
            {/*    <Typography variant="subtitle1">*/}
            {/*        {sortedReports.length} {sortedReports.length === 1 ? t('pages.vehicle.maintenance.overview.reports.list.resultSummary.single') : t('pages.vehicle.maintenance.overview.reports.list.resultSummary.plural')}*/}
            {/*    </Typography>*/}
            {/*</Box>*/}


            {/* Reports List */}
            {reports.length > 0 ? (
                <Box>
                    {reports.map((report) => (
                        <div key={report.id} ref={(el) => {
                            if (el) {
                                reportRefs?.current.set(report.id as string, el);
                            }else {
                                reportRefs?.current.delete(report.id as string);
                            }
                        }}>
                            <MaintenanceReportCard
                                key={report.id}
                                report={report}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                            />
                        </div>

                    ))}
                </Box>
            ) : (
                <Box sx={{textAlign: 'center', py: 5}}>
                    <Typography variant="h6" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.reports.list.none')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.reports.list.try')}
                    </Typography>
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>{t('pages.vehicle.maintenance.overview.reports.deleteDialog.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('pages.vehicle.maintenance.overview.reports.deleteDialog.subtitle')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setDeleteDialogOpen(false)
                        setRequest('idle')
                    }}>{t('common.cancel')}</Button>
                    <Button onClick={handleConfirmDelete}
                            color="error"
                            startIcon={isLoading && (
                                <CircularProgress size={20} color={"inherit"}/>
                            )}
                    >{t('common.delete')}</Button>
                </DialogActions>
            </Dialog>

            {/*Edit maintenance report dialog*/}
            <NewMaintenanceReportDialog open={openFormDialog}
                                        onClose={() => {
                                            setOpenFormDialog(false);
                                            setRequest('idle');
                                        }}
                                        partPurchaseEvent={partPurchaseEvent}
                                        serviceProviderEvent={serviceProviderEvent}
                                        handleServiceProviderChange={handleServiceProviderChange}
                                        handlePartPurchaseChange={handlePartPurchaseChange}
                                        handleAddPartPurchase={handleAddPartPurchase}
                                        handleAddServiceEvent={handleAddServiceEvent}
                                        maintenanceReportFormData={maintenanceReportFormData}
                                        handleMaintenanceReportFormChange={handleMaintenanceReportFormChange}
                                        handleMaintenanceReportSubmission={handleMaintenanceReportSubmission}
                                        handleRemovePartPurchase={handleRemovePartPurchase}
                                        handleRemoveServiceEvent={handleRemoveServiceEvent}
                                        errorState={error}
                                        isLoading={isLoading}
                                        handleErrorClosing={() => setError({isError: false, message: ""})}
            />
        </Box>
    );
};

export default MaintenanceReportsList;