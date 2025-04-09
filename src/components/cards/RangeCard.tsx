import { Button } from '@mui/material';

interface RangeCardProps {
    title: string;
    handlePress: (key: string) => void;
    isActive?: boolean;
}

const RangeCard = ({ title, handlePress, isActive = false }: RangeCardProps) => {
    return (
        <Button
            onClick={() => handlePress(title)}
            variant={isActive ? "contained" : "outlined"}
            color="primary"
            sx={{
                margin: 1,
                padding: '8px 16px',
                fontWeight: 'bold',
                borderRadius: 1,
                borderWidth: isActive ? 0 : 2,
                textTransform: 'none',
                minWidth: 'fit-content',
                boxShadow: isActive ? 2 : 0,
                '&:hover': {
                    borderWidth: isActive ? 0 : 2,
                }
            }}
        >
            {title}
        </Button>
    );
};

export default RangeCard;