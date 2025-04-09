import {Link} from 'react-router-dom';
import {Alert, Box, Button, CircularProgress, Container, Divider, IconButton, InputAdornment, Paper, TextField, Typography} from '@mui/material';
import {Email, Person, Phone, Visibility, VisibilityOff} from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useSignup} from "../../hooks/auth/useSignup.ts";

const SignUp = () => {
    const {
        loading,
        error,
        formData,
        handleSubmit,
        handleChange,
        handleBlur,
        formErrors,
        showPassword,
        showConfirmPassword,
        showAddressFields,
        setShowAddressFields,
        setShowConfirmPassword,
        setShowPassword,
    } = useSignup();
    return (
        <Container maxWidth="sm" className="py-10">
            <Paper elevation={3} className="p-8 rounded-lg">
                {loading ? (
                    <Box className="flex justify-center items-center h-80">
                        <CircularProgress color="primary"/>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} className="space-y-5">
                        <Box className="text-center mb-6">
                            <Typography variant="h4" component="h1" className="font-bold text-gray-800">
                                Welcome to Fleet Master
                            </Typography>
                            <Typography variant="body1" color="textSecondary" className="mt-2">
                                Start managing your fleet with ease. Sign up now to keep track of your fleet and stay organized.
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        <Box className="grid grid-cols-2 gap-4">
                            <TextField
                                fullWidth
                                id="firstname"
                                name="user.first_name"
                                label="First Name"
                                value={formData.user.first_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!formErrors['user.first_name']}
                                helperText={formErrors['user.first_name']}
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
                                label="Last Name"
                                value={formData.user.last_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!formErrors['user.last_name']}
                                helperText={formErrors['user.last_name']}
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
                                label="Username"
                                value={formData.user.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!formErrors.username}
                                helperText={formErrors.username}
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
                                label="Email Address"
                                type="email"
                                value={formData.user.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
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
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!formErrors.phone}
                                helperText={formErrors.phone}
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
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={formData.user.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!formErrors.password}
                                helperText={formErrors.password}
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
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!formErrors.confirmPassword}
                                helperText={formErrors.confirmPassword}
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
                                <Typography variant="h6" sx={{mr: 2}}>
                                    Address Information (Optional)
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setShowAddressFields(!showAddressFields)}
                                    startIcon={showAddressFields ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                >
                                    {showAddressFields ? 'Hide' : 'Add Address'}
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
                                        label="Street Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        error={!!formErrors['address']}
                                        helperText={formErrors['address']}
                                    />
                                </Box>

                                {/* City and State - Side by side */}
                                <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
                                    <Box sx={{flexGrow: 1, minWidth: '250px'}}>
                                        <TextField
                                            fullWidth
                                            id="city"
                                            name="city"
                                            label="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            error={!!formErrors['city']}
                                            helperText={formErrors['city']}
                                        />
                                    </Box>
                                    <Box sx={{flexGrow: 1, minWidth: '250px'}}>
                                        <TextField
                                            fullWidth
                                            id="state"
                                            name="state"
                                            label="State/Province"
                                            value={formData.state}
                                            onChange={handleChange}
                                            error={!!formErrors['state']}
                                            helperText={formErrors['state']}
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
                                            label="Country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            error={!!formErrors['country']}
                                            helperText={formErrors['country']}
                                        />
                                    </Box>
                                    <Box sx={{flexGrow: 1, minWidth: '250px'}}>
                                        <TextField
                                            fullWidth
                                            id="zip_code"
                                            name="zip_code"
                                            label="ZIP / Postal Code"
                                            value={formData.zip_code}
                                            onChange={handleChange}
                                            error={!!formErrors['zip_code']}
                                            helperText={formErrors['zip_code']}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>


                        <Box className={"flex flex-col items-center gap-3"}>
                            <Typography variant="body2" color="textSecondary" className="text-sm mt-4">
                                By continuing you agree to Fleet Master's
                                <Link to="/terms" className="text-secondary-500 hover:underline"> Terms of Service </Link>
                                and
                                <Link to="/privacy" className="text-secondary-500 hover:underline"> Privacy Policy</Link>
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
                                {loading ? <CircularProgress size={24} color="inherit"/> : "Create Account"}
                            </Button>
                            <Divider className="my-4"/>
                            <Typography variant="body1" align="center" className="mt-4">
                                Already registered?{" "}
                                <Link to="/" className="text-secondary-500 font-medium hover:underline">
                                    Sign in
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