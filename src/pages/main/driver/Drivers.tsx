import {Box, Button, Container, Divider, Typography, useTheme,} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {DeleteDriver, DriverCardComponent, DriverDialog, Filter, NotificationBar} from "@/components";
import {useTranslation} from "react-i18next";
import {useDriver} from "@/hooks/main/useDriver";


const Drivers = () => {
        const {t} = useTranslation();
        const theme = useTheme()
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
            refreshAccessCode,
            searchQuery,
            setFilterStatus,
            setFormError,
            setOpenDeleteDialog,
            setOpenDialog,
            setSearchQuery,
            setSnackbar,
            snackbar,
        } = useDriver()

        const menuItems = [
            {label: "pages.driver.filter.all", value: "ALL"},
            {label: "pages.driver.filter.active", value: "ACTIVE"},
            {label: "pages.driver.filter.onLeave", value: "ON_LEAVE"},
            {label: "pages.driver.filter.inactive", value: "INACTIVE"},
        ]

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
                            backgroundColor: theme.palette.custom.primary[600],
                            '&:hover': {backgroundColor: theme.palette.custom.primary[700]}
                        }}
                    >
                        {t('pages.driver.addButton')}
                    </Button>
                </Box>

                <Typography variant="body1" sx={{mb: 4}}>
                    {t('pages.driver.subtitle')}
                </Typography>

                {/* Filters */}
                <Filter searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        inputLabel={'pages.driver.filter.status'}
                        filterInput={filterStatus}
                        setFilterInput={setFilterStatus}
                        items={menuItems}
                />

                {/* Results count */}
                <Typography variant="subtitle1" sx={{mb: 2}}>
                    {filteredDrivers.length} {
                    filteredDrivers.length === 1
                        ? t('pages.driver.resultsCount.single')
                        : t('pages.driver.resultsCount.plural')
                }
                </Typography>

                <Divider sx={{mb: 4}}/>

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
                {filteredDrivers.map(driver => (
                    <DriverCardComponent
                        key={driver.id}
                        driver={driver}
                        onEdit={handleEditDriver}
                        onDelete={handleDeleteClick}
                        refreshAccessCode={refreshAccessCode}
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
                <DeleteDriver openDeleteDialog={openDeleteDialog}
                              setOpenDeleteDialog={setOpenDeleteDialog}
                              driverToDelete={driverToDelete}
                              handleDeleteConfirm={handleDeleteConfirm}
                              loading={loading}
                />

                {/* Snackbar for notifications */}
                <NotificationBar snackbar={snackbar} setSnackbar={setSnackbar}/>
            </Container>
        );
    }
;

export default Drivers;