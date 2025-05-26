import React from 'react';
import {Box, Button, ButtonGroup} from '@mui/material';

interface YearSelectorProps {
    years: number[];
    selectedYear: number;
    onSelect: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({years, selectedYear, onSelect}) => (
    <Box sx={{mb: 3}}>
        <ButtonGroup variant="outlined" aria-label="year selection">
            {years.map((year) => (
                <Button
                    key={year}
                    variant={year === selectedYear ? 'contained' : 'outlined'}
                    onClick={() => onSelect(year)}
                >
                    {year}
                </Button>
            ))}
        </ButtonGroup>
    </Box>
);

export default YearSelector;