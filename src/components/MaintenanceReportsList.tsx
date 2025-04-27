import React, {useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {ArrowBack as ArrowBackIcon, Search as SearchIcon} from '@mui/icons-material';
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
    setShowReportsList: (show: boolean) => void;
    showBackButton: boolean;
}

const MaintenanceReportsList: React.FC<MaintenanceReportsListProps> = ({
                                                                           reports,
                                                                           setOpenSnackBar,
                                                                           setShowReportsList,
                                                                           showBackButton,
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
    } = useMaintenanceReport(setShowReportsList, setOpenSnackBar);
    const {setRequest} = useGeneralDataStore();
    const {t} = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [sortBy, setSortBy] = useState('date_desc');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<MaintenanceReportWithStringsType | null>(null);

    // Filter reports based on search query and filter type
    const filteredReports = reports.filter(report => {
        const matchesSearch = searchQuery === '' ||
            (report.vehicle_details?.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.vehicle_details?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.description?.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = filterType === 'ALL' || report.maintenance_type === filterType;

        return matchesSearch && matchesType;
    });

    // Sort reports
    const sortedReports = [...filteredReports].sort((a, b) => {
        switch (sortBy) {
            case 'date_desc':
                return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
            case 'date_asc':
                return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
            case 'cost_desc':
                return parseFloat(b.total_cost || '0') - parseFloat(a.total_cost || '0');
            case 'cost_asc':
                return parseFloat(a.total_cost || '0') - parseFloat(b.total_cost || '0');
            default:
                return 0;
        }
    });

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
            setShowReportsList(false);
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
            {/* Filters and Search */}
            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid sx={{width: {xs: '100%', sm: '50%'}}}>
                    {showBackButton && (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon/>}
                            onClick={() => setShowReportsList(false)}
                            size="medium"
                            sx={{
                                height: '100%',
                                borderColor: "#3f51b5",
                                color: "#3f51b5",
                                '&:hover': {borderColor: "#30349f", backgroundColor: "rgba(63, 81, 181, 0.04)"}
                            }}
                        >
                            {t('pages.vehicle.maintenance.overview.reports.list.goBack')}
                        </Button>
                    )}

                </Grid>

                <Grid sx={{width: {xs: '100%', sm: '50%'}}}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder={t('pages.vehicle.maintenance.overview.reports.list.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small"/>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </Grid>

                <Grid sx={{width: {xs: '100%', sm: '50%'}}}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="filter-type-label">{t('pages.vehicle.maintenance.overview.reports.list.type.title')}</InputLabel>
                        <Select
                            labelId="filter-type-label"
                            id="filter-type"
                            value={filterType}
                            label={t('pages.vehicle.maintenance.overview.reports.list.type.title')}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <MenuItem value="ALL">{t('pages.vehicle.maintenance.overview.reports.list.type.types.ALL')}</MenuItem>
                            <MenuItem value="PREVENTIVE">{t('pages.vehicle.maintenance.overview.reports.list.type.types.PREVENTIVE')}</MenuItem>
                            <MenuItem value="CURATIVE">{t('pages.vehicle.maintenance.overview.reports.list.type.types.CURATIVE')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid sx={{width: {xs: '100%', sm: '50%'}}}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="sort-by-label">{t('pages.vehicle.maintenance.overview.reports.list.sort.title')}</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            id="sort-by"
                            value={sortBy}
                            label={t('pages.vehicle.maintenance.overview.reports.list.sort.title')}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="date_desc">{t('pages.vehicle.maintenance.overview.reports.list.sort.types.date_desc')}</MenuItem>
                            <MenuItem value="date_asc">{t('pages.vehicle.maintenance.overview.reports.list.sort.types.date_asc')}</MenuItem>
                            <MenuItem value="cost_desc">{t('pages.vehicle.maintenance.overview.reports.list.sort.types.cost_desc')}</MenuItem>
                            <MenuItem value="cost_asc">{t('pages.vehicle.maintenance.overview.reports.list.sort.types.cost_asc')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Results Summary */}
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="subtitle1">
                    {sortedReports.length} {sortedReports.length === 1 ? t('pages.vehicle.maintenance.overview.reports.list.resultSummary.single') : t('pages.vehicle.maintenance.overview.reports.list.resultSummary.plural')}
                </Typography>
            </Box>

            <Divider sx={{mb: 3}}/>

            {/* Reports List */}
            {sortedReports.length > 0 ? (
                <Box>
                    {sortedReports.map((report) => (
                        <MaintenanceReportCard
                            key={report.id}
                            report={report}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
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