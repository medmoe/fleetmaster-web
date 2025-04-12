import React, {useState} from 'react';
import {
    Box,
    Button,
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
import MaintenanceReportCard from "./cards/MaintenanceReportCard.tsx";
import {MaintenanceReportType} from '../types/maintenance';

interface MaintenanceReportsListProps {
    reports: MaintenanceReportType[];
    onEditReport: (report: MaintenanceReportType) => void;
    onDeleteReport: (reportId: string) => void;
    setShowReportsList: (show: boolean) => void;
}

const MaintenanceReportsList: React.FC<MaintenanceReportsListProps> = ({
                                                                           reports,
                                                                           onEditReport,
                                                                           onDeleteReport,
                                                                           setShowReportsList
                                                                       }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [sortBy, setSortBy] = useState('date_desc');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<MaintenanceReportType | null>(null);

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
    const handleDeleteClick = (report: MaintenanceReportType) => {
        setReportToDelete(report);
        setDeleteDialogOpen(true);
    };

    // Handle confirmed deletion
    const handleConfirmDelete = () => {
        if (reportToDelete?.id) {
            onDeleteReport(reportToDelete.id);
            setDeleteDialogOpen(false);
            setReportToDelete(null);
        }
    };

    return (
        <Box>
            {/* Filters and Search */}
            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid sx={{width: {xs: '100%', sm: '50%'}}}>
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
                        Go Back
                    </Button>
                </Grid>

                <Grid sx={{width: {xs: '100%', sm: '50%'}}}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Search reports..."
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
                        <InputLabel id="filter-type-label">Type</InputLabel>
                        <Select
                            labelId="filter-type-label"
                            id="filter-type"
                            value={filterType}
                            label="Type"
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <MenuItem value="ALL">All Types</MenuItem>
                            <MenuItem value="PREVENTIVE">Preventive</MenuItem>
                            <MenuItem value="CURATIVE">Curative</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid sx={{width: {xs: '100%', sm: '50%'}}}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="sort-by-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            id="sort-by"
                            value={sortBy}
                            label="Sort By"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="date_desc">Newest First</MenuItem>
                            <MenuItem value="date_asc">Oldest First</MenuItem>
                            <MenuItem value="cost_desc">Highest Cost</MenuItem>
                            <MenuItem value="cost_asc">Lowest Cost</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Results Summary */}
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="subtitle1">
                    {sortedReports.length} {sortedReports.length === 1 ? 'Report' : 'Reports'} Found
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
                            onEdit={onEditReport}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </Box>
            ) : (
                <Box sx={{textAlign: 'center', py: 5}}>
                    <Typography variant="h6" color="text.secondary">
                        No maintenance reports found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filters
                    </Typography>
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this maintenance report for
                        {reportToDelete?.vehicle_details?.make} {reportToDelete?.vehicle_details?.model}?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MaintenanceReportsList;