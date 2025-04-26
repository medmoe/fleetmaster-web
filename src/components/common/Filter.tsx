import {Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {Search as SearchIcon} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

interface FilterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    inputLabel: string
    filterInput: string;
    setFilterInput: (input: string) => void;
    items: { label: string, value: string }[];
}

const Filter = ({items, filterInput, setFilterInput, searchQuery, setSearchQuery, inputLabel}: FilterProps) => {
    const {t} = useTranslation();
    return (
        <Box sx={{display: "flex", gap: 2, mb: 4, flexDirection: {xs: 'column', sm: 'row'}}}>
            <TextField fullWidth
                       placeholder={t('pages.vehicle.search')}
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       slotProps={{
                           input: {
                               startAdornment: (
                                   <InputAdornment position={"start"}>
                                       <SearchIcon/>
                                   </InputAdornment>
                               )
                           }
                       }}
                       sx={{flexGrow: 1}}
            />
            <FormControl sx={{minWidth: 200}}>
                <InputLabel id={"status-filter-label"}>{t(inputLabel)}</InputLabel>
                <Select labelId={"status-filter-label"}
                        value={filterInput}
                        label={t(inputLabel)}
                        onChange={(e) => setFilterInput(e.target.value)}
                >
                    {items.map(item => <MenuItem value={item.value}>{t(item.label)}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    )
}

export default Filter;