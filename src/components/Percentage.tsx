import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export interface PercentageProps {
    percentage: string;
    icon: 'up' | 'down'; // Changed from ImageSourcePropType to simple string options
    color: string;
}

const Percentage = ({percentage, icon, color}: PercentageProps) => {
    return (
        <div className="flex items-center justify-end">
            {icon === 'up' ? (
                <ArrowUpwardIcon style={{color, fontSize: 20}}/>
            ) : (
                <ArrowDownwardIcon style={{color, fontSize: 20}}/>
            )}
            <span style={{color, fontSize: 12, marginLeft: 4}}>{percentage}</span>
        </div>
    );
};

export default Percentage;