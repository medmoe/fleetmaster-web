import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import {Add as AddIcon, Search as SearchIcon} from "@mui/icons-material";
import {Delete, DriverCardComponent, DriverDialog} from "@/components";
import {useTranslation} from "react-i18next";
import {useDriver} from "@/hooks/main/useDriver";


const Drivers = () => {
        const {t} = useTranslation();
        const {
            driverToDelete,
            filterStatus,
            filteredDrivers,
            formData,
            formError,
            handleAddDriver,
            handleDeleteClick,
            handleDeleteConfirm,
            handleEditDriver,
            handleFormChange,
            handleSubmit,
            isEditing,
            loading,
            openDeleteDialog,
            openDialog,
            searchQuery,
            setFilterStatus,
            setFormError,
            setOpenDeleteDialog,
            setOpenDialog,
            setSearchQuery,
            setSnackbar,
            snackbar
        } = useDriver()


        return (
            <Container maxWidth="lg" sx={{py: 4}}>
                <Box sx={{mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}}>
                        {t('pages.driver.title')}
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={handleAddDriver}
                        sx={{
                            backgroundColor: '#3f51b5',
                            '&:hover': {backgroundColor: '#303f9f'}
                        }}
                    >
                        {t('pages.driver.addButton')}
                    </Button>
                </Box>

                <Typography variant="body1" sx={{mb: 4}}>
                    {t('pages.driver.subtitle')}
                </Typography>

                {/* Filters */}
                <Box sx={{display: 'flex', gap: 2, mb: 4, flexDirection: {xs: 'column', sm: 'row'}}}>
                    <TextField
                        fullWidth
                        placeholder={t('pages.driver.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                )
                            }
                        }}
                        sx={{flexGrow: 1}}
                    />

                    <FormControl sx={{minWidth: 200}}>
                        <InputLabel id="status-filter-label">{t('pages.driver.filter.status')}</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            value={filterStatus}
                            label={t('pages.driver.filter.status')}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="ALL">{t('pages.driver.filter.all')}</MenuItem>
                            <MenuItem value="ACTIVE">{t('pages.driver.filter.active')}</MenuItem>
                            <MenuItem value="ON_LEAVE">{t('pages.driver.filter.onLeave')}</MenuItem>
                            <MenuItem value="INACTIVE">{t('pages.driver.filter.inactive')}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Results count */}
                <Typography variant="subtitle1" sx={{mb: 2}}>
                    {filteredDrivers.length} {
                    filteredDrivers.length === 1
                        ? t('pages.driver.resultsCount.single')
                        : t('pages.driver.resultsCount.plural')
                }
                </Typography>

                <Divider sx={{mb: 4}}/>

                {/*/!* Loading spinner *!/*/}
                {/*{loading && !openDialog && !openDeleteDialog && (*/}
                {/*    <Box sx={{display: 'flex', justifyContent: 'center', my: 8}}>*/}
                {/*        <CircularProgress size={60}/>*/}
                {/*    </Box>*/}
                {/*)}*/}

                {/* No results message */}
                {!loading && filteredDrivers.length === 0 && (
                    <Box sx={{textAlign: 'center', py: 8}}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {searchQuery
                                ? t('pages.driver.noResults.withSearch')
                                : t('pages.driver.noResults.empty')
                            }
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {searchQuery
                                ? t('pages.driver.noResults.tryDifferent')
                                : t('pages.driver.noResults.addFirst')
                            }
                        </Typography>
                    </Box>
                )}

                {/* Drivers list */}
                {!loading && filteredDrivers.map(driver => (
                    <DriverCardComponent
                        key={driver.id}
                        driver={driver}
                        onEdit={handleEditDriver}
                        onDelete={handleDeleteClick}
                    />
                ))}

                {/* Add/Edit Driver Dialog */}
                <DriverDialog loading={loading}
                              openDialog={openDialog}
                              setOpenDialog={setOpenDialog}
                              setFormError={setFormError}
                              handleSubmit={handleSubmit}
                              formData={formData}
                              formError={formError}
                              isEditing={isEditing}
                              handleFormChange={handleFormChange}
                />

                {/* Delete Confirmation Dialog */}
                <Delete openDeleteDialog={openDeleteDialog}
                        setOpenDeleteDialog={setOpenDeleteDialog}
                        driverToDelete={driverToDelete}
                        handleDeleteConfirm={handleDeleteConfirm}
                        loading={loading}
                />

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert
                        onClose={() => setSnackbar({...snackbar, open: false})}
                        severity={snackbar.severity}
                        sx={{width: '100%'}}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        );
    }
;

export default Drivers;