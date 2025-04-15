import {Box, Button, CircularProgress, Container, InputAdornment, Paper, TextField, Typography} from "@mui/material";
import {House, Person, Phone} from "@mui/icons-material";
import {PartProviderType} from "@/types/maintenance";
import React from "react";

interface PartProviderFormProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCancel: () => void;
    formData: PartProviderType;
    isLoading: boolean;
}

const PartProviderForm = ({handleCancel, handleChange, handleSubmit, formData, isLoading}: PartProviderFormProps) => {
    return (
        <Container maxWidth="sm" className={"py-10"}>
            <Paper elevation={3} className={"p-8 rounded-lg"}>
                {isLoading ? (
                    <Box className={"flex justify-center items-center h-80"}>
                        <CircularProgress color="primary"/>
                    </Box>
                ) : (
                    <Box component={"form"} onSubmit={handleSubmit} className={"space-y-5"}>
                        <Box className={"text-center mb-6"}>
                            <Typography variant={"body1"} color={"textSecondary"} className={"mt-2"}>
                                Fill all the fields !
                            </Typography>
                        </Box>
                        <Box className={"grid grid-cols-1 gap-4"}>
                            <TextField fullWidth
                                       required
                                       id={"name"}
                                       name={"name"}
                                       label={"Name"}
                                       value={formData.name}
                                       onChange={handleChange}
                                       slotProps={{
                                           input: {
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <Person/>
                                                   </InputAdornment>
                                               )
                                           }
                                       }}
                            /><TextField fullWidth
                                         required
                                         id={"phone_number"}
                                         name={"phone_number"}
                                         label={"Phone number"}
                                         value={formData.phone_number}
                                         onChange={handleChange}
                                         slotProps={{
                                             input: {
                                                 startAdornment: (
                                                     <InputAdornment position="start">
                                                         <Phone/>
                                                     </InputAdornment>
                                                 )
                                             }
                                         }}
                        /><TextField fullWidth
                                     id={"address"}
                                     name={"address"}
                                     label={"Address"}
                                     value={formData.address}
                                     onChange={handleChange}
                                     slotProps={{
                                         input: {
                                             startAdornment: (
                                                 <InputAdornment position="start">
                                                     <House/>
                                                 </InputAdornment>
                                             )
                                         }
                                     }}
                        />
                        </Box>
                        {/* Action Buttons */}
                        <Box sx={{mt: 3}}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{backgroundColor: "#3f51b5", '&:hover': {backgroundColor: "#3847a3"}, py: 1.5}}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handleCancel}
                                sx={{backgroundColor: "#9BA1A6", mt: 1.5, py: 1.5, '&:hover': {backgroundColor: "#8E9499"}}}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>

                )}
            </Paper>
        </Container>
    )
}

export default PartProviderForm;