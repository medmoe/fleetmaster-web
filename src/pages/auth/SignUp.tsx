import {Link} from 'react-router-dom';
import {Alert, Box, Button, CircularProgress, Container, Divider, IconButton, InputAdornment, Paper, TextField, Typography} from '@mui/material';
import {Email, Person, Phone, Visibility, VisibilityOff} from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useSignup} from "@/hooks/auth/useSignup";
import {useTranslation} from "react-i18next";
import {LanguageSwitcher} from "@/components";

const SignUp = () => {
    const {
        loading,
        error,
        formData,
        handleSubmit,
        handleChange,
        showPassword,
        showConfirmPassword,
        showAddressFields,
        setShowAddressFields,
        setShowConfirmPassword,
        setShowPassword,
    } = useSignup();
    const {t} = useTranslation();
    return (
        <Container maxWidth="sm" className="py-10">
            <Paper elevation={3} className="p-8 rounded-lg">
                {loading ? (
                    <Box className="flex justify-center items-center h-80">
                        <CircularProgress color="primary"/>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} className="space-y-5">
                        <LanguageSwitcher/>
                        <Box className="text-center mb-6">
                            <Typography variant="h4" component="h1" className="font-bold text-gray-800">
                                {t('auth.register.title')}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" className="mt-2">
                                {t('auth.register.subtitle')}
                            </Typography>
                        </Box>

                        {error.isError && (
                            <Alert severity="error" className="mb-4">
                                {error.message}
                            </Alert>
                        )}

                        <Box className="grid grid-cols-2 gap-4">
                            <TextField
                                fullWidth
                                id="firstname"
                                name="user.first_name"
                                label={t('auth.register.form.firstName')}
                                value={formData.user.first_name}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person/>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                id="lastname"
                                name="user.last_name"
                                label={t('auth.register.form.lastName')}
                                value={formData.user.last_name}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person/>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Box>
                        <Box className="grid grid-cols-1 gap-4">
                            <TextField
                                fullWidth
                                required
                                id="username"
                                name="user.username"
                                label={t('auth.register.form.username')}
                                value={formData.user.username}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person/>
                                            </InputAdornment>
                                        ),
                                    }
                                }}

                            />
                            <TextField
                                fullWidth
                                required
                                id="email"
                                name="user.email"
                                label={t('auth.register.form.email')}
                                type="email"
                                value={formData.user.email}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email/>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                id="phone"
                                name="phone"
                                label={t('auth.register.form.phone')}
                                value={formData.phone}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone/>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                id="password"
                                name="user.password"
                                label={t('auth.register.form.password')}
                                type={showPassword ? "text" : "password"}
                                value={formData.user.password}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)}
                                                            edge="end">
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                id="confirmPassword"
                                name="confirmPassword"
                                label={t('auth.register.form.confirmPassword')}
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton aria-label="toggle confirmed password visibility"
                                                            edge="end"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                    {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{mt: 4, mb: 3}}>
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                <Typography variant="h6" sx={{mr: 2}}>{t('auth.register.form.addressInformationTitle')}</Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setShowAddressFields(!showAddressFields)}
                                    startIcon={showAddressFields ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                >
                                    {showAddressFields ? t('auth.register.form.toggleAddress') : t('auth.register.form.collapseAddress')}
                                </Button>
                            </Box>

                            {/* Collapsible address fields */}
                            <Box
                                sx={{
                                    display: showAddressFields ? 'flex' : 'none',
                                    flexDirection: 'column',
                                    gap: 2,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {/* Street Address - Full width */}
                                <Box sx={{width: '100%'}}>
                                    <TextField
                                        fullWidth
                                        id="address"
                                        name="address"
                                        label={t('auth.register.form.street')}
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </Box>

                                {/* City and State - Side by side */}
                                <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
                                    <Box sx={{flexGrow: 1, minWidth: '250px'}}>
                                        <TextField
                                            fullWidth
                                            id="city"
                                            name="city"
                                            label={t('auth.register.form.city')}
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </Box>
                                    <Box sx={{flexGrow: 1, minWidth: '250px'}}>
                                        <TextField
                                            fullWidth
                                            id="state"
                                            name="state"
                                            label={t('auth.register.form.state')}
                                            value={formData.state}
                                            onChange={handleChange}
                                        />
                                    </Box>
                                </Box>

                                {/* Country and ZIP - Side by side */}
                                <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
                                    <Box sx={{flexGrow: 1, minWidth: '250px'}}>
                                        <TextField
                                            fullWidth
                                            id="country"
                                            name="country"
                                            label={t('auth.register.form.country')}
                                            value={formData.country}
                                            onChange={handleChange}
                                        />
                                    </Box>
                                    <Box sx={{flexGrow: 1, minWidth: '250px'}}>
                                        <TextField
                                            fullWidth
                                            id="zip_code"
                                            name="zip_code"
                                            label={t('auth.register.form.zip')}
                                            value={formData.zip_code}
                                            onChange={handleChange}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>


                        <Box className={"flex flex-col items-center gap-3"}>
                            <Typography variant="body2" color="textSecondary" className="text-sm mt-4">
                                {t('auth.register.agreement.title')}
                                <Link to="/terms" className="text-secondary-500 hover:underline"> {t('auth.register.agreement.terms')}</Link>
                                {t('auth.register.agreement.and')}
                                <Link to="/privacy" className="text-secondary-500 hover:underline"> {t('auth.register.agreement.policy')}</Link>
                            </Typography>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                className="py-3 mt-4 bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit"/> : t('auth.register.registerButton')}
                            </Button>
                            <Divider className="my-4"/>
                            <Typography variant="body1" align="center" className="mt-4">
                                {t('auth.register.hasAccount')}{" "}
                                <Link to="/" className="text-secondary-500 font-medium hover:underline">
                                    {t('auth.register.login')}
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default SignUp;