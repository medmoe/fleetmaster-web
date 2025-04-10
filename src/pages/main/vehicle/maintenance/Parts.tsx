import React, {useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import {Add as AddIcon, Close as CloseIcon, Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon} from '@mui/icons-material';
import useGeneralDataStore from "../../../../store/useGeneralDataStore.ts";
import {PartType} from "../../../../types/maintenance.ts";
import {API} from '../../../../constants/endpoints.ts';
import axios from 'axios';

const PartsManagementPage: React.FC = () => {
    // Get data from store
    const {generalData, setGeneralData} = useGeneralDataStore();

    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredParts, setFilteredParts] = useState<PartType[]>([]);
    const [selectedPart, setSelectedPart] = useState<PartType | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [newPart, setNewPart] = useState<PartType>({name: '', description: ''});
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        isError: false,
        message: ""
    })
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const options = {headers: {"Content-Type": "application/json"}, withCredentials: true};
    const url = `${API}maintenance/parts/`

    // Filter parts when search query changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredParts(generalData.parts);
        } else {
            const filtered = generalData.parts.filter(part =>
                part.name.toLowerCase().startsWith(searchQuery.toLowerCase())
            );
            setFilteredParts(filtered);
        }
    }, [searchQuery, generalData.parts]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery])

    // Calculate paginated parts based on current page and items per page
    const paginatedParts = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredParts.slice(startIndex, endIndex);
    }, [filteredParts, page, itemsPerPage]);

    const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeItemsPerPage = (e: SelectChangeEvent<number>) => {
        setItemsPerPage(Number(e.target.value));
        setPage(1);
    }

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Handle adding a new part
    const handleAddPart = () => {
        setIsEditMode(false);
        setNewPart({name: '', description: ''});
        setIsDialogOpen(true);
    };

    // Handle editing a part
    const handleEditPart = (part: PartType) => {
        setIsEditMode(true);
        setNewPart({...part});
        setIsDialogOpen(true);
    };

    // Handle deleting a part
    const handleDeleteConfirm = (part: PartType) => {
        setSelectedPart(part);
        setIsDeleteConfirmOpen(true);
    };

    // Handle form input changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewPart(prev => ({...prev, [name]: value}));
    };

    // Submit form (add or edit)
    const handleSubmit = async () => {
        if (!newPart.name.trim()) return;
        setIsLoading(true);
        try {
            const response = isEditMode ? await axios.put(`${url}${newPart?.id}/`, newPart, options) : await axios.post(url, newPart, options);
            setGeneralData({
                ...generalData,
                parts: isEditMode ? [...generalData.parts.filter(part => part.id !== newPart?.id), response.data] : [...generalData.parts, response.data]
            });
        } catch (error) {
            setError({isError: true, message: isEditMode ? "Error while updating part" : "Error while creating part"})
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsDialogOpen(false);
        }
    };

    // Delete part
    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`${url}${selectedPart?.id}/`, options);
            setGeneralData({...generalData, parts: generalData.parts.filter(part => part.id !== selectedPart?.id)});
        } catch (error) {
            console.error(error);
            setError({isError: true, message: "Error while deleting part"})
        } finally {
            setIsLoading(false);
            setIsDeleteConfirmOpen(false);

        }
    };

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', p: 3}}>
            <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: 'bold', color: 'primary.main'}}>
                Parts Management
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p" sx={{mb: 4}}>
                Manage your parts inventory by adding, editing, or removing parts.
            </Typography>
            {error.isError && (
                <Alert
                    severity="error"
                    sx={{mb: 2}}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setError({isError: false, message: ""})}
                        >
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                >
                    {error.message}
                </Alert>

            )}

            <Paper sx={{p: 2, mb: 3}} elevation={2}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                    <TextField
                        placeholder="Search parts..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{flexGrow: 1}}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action"/>
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{backgroundColor: '#3f51b5', '&:hover': {backgroundColor: '#3847a3'}, ml: 2}}
                        startIcon={<AddIcon/>}
                        onClick={handleAddPart}
                    >
                        Add Part
                    </Button>
                </Box>

                {/* Results count */}
                <Typography variant="body2" color="textSecondary" sx={{mb: 2}}>
                    {searchQuery ? `${filteredParts.length} results found` : `${generalData.parts.length} total parts`}
                </Typography>
            </Paper>

            {/* Parts List */}
            <Paper sx={{mb: 4}} elevation={3}>
                {filteredParts.length === 0 ? (
                    <Box sx={{p: 4, textAlign: 'center'}}>
                        <Typography color="textSecondary">
                            {searchQuery ? 'No parts match your search' : 'No parts available. Add your first part!'}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <List sx={{width: '100%'}}>
                            {/* Use paginatedParts instead of filteredParts */}
                            {paginatedParts.map((part, index) => (
                                <React.Fragment key={part.id || index}>
                                    <ListItem
                                        secondaryAction={
                                            <Box>
                                                <IconButton edge="end" onClick={() => handleEditPart(part)} color="primary">
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton edge="end" onClick={() => handleDeleteConfirm(part)} color="error">
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Box>
                                        }
                                    >
                                        <ListItemText
                                            primary={part.name}
                                            secondary={part.description}
                                            sx={{fontSize: '0.9rem', color: 'text.primary', fontWeight: 'bold'}}
                                        />
                                    </ListItem>
                                    {index < paginatedParts.length - 1 && <Divider component="li"/>}
                                </React.Fragment>
                            ))}
                        </List>

                        {/* Pagination Controls */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2,
                            borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                        }}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="body2" color="text.secondary" sx={{mr: 2}}>
                                    Items per page:
                                </Typography>
                                <Select
                                    value={itemsPerPage}
                                    onChange={handleChangeItemsPerPage}
                                    size="small"
                                    sx={{minWidth: 70}}
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                </Select>
                            </Box>

                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="body2" color="text.secondary" sx={{mr: 2}}>
                                    {`${(page - 1) * itemsPerPage + 1}-${Math.min(page * itemsPerPage, filteredParts.length)} of ${filteredParts.length}`}
                                </Typography>
                                <Pagination
                                    count={Math.ceil(filteredParts.length / itemsPerPage)}
                                    page={page}
                                    onChange={handleChangePage}
                                    color="primary"
                                    shape="rounded"
                                    size="small"
                                />
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>

            {/* Add/Edit Part Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEditMode ? 'Edit Part' : 'Add New Part'}
                    {isLoading && <CircularProgress color="primary" size={20} thickness={4} className={"ml-2"}/>}
                    <IconButton
                        aria-label="close"
                        onClick={() => setIsDialogOpen(false)}
                        sx={{position: 'absolute', right: 8, top: 8}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Part Name"
                            name="name"
                            value={newPart.name}
                            onChange={handleFormChange}
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Description"
                            name="description"
                            value={newPart.description}
                            onChange={handleFormChange}
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        sx={{backgroundColor: '#3f51b5', '&:hover': {backgroundColor: '#3847a3'}}}
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!newPart.name.trim()}
                    >
                        {isEditMode ? 'Save Changes' : 'Add Part'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the part "{selectedPart?.name}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteConfirmOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PartsManagementPage;