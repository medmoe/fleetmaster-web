import Percentage, {PercentageProps} from "../Percentage.tsx"

interface StatCardProps {
    label: string;
    result: string;
    containerStyles?: string;
}

const StatCard = ({ label, result, percentage, icon, color, containerStyles }: StatCardProps & PercentageProps) => {
    return (
        <div className={`flex-1 rounded p-2 bg-white shadow ${containerStyles || ''}`}>
            <div className="flex items-center">
                <span className="text-txt font-semibold text-3xl flex-1">{result}</span>
                <Percentage percentage={percentage} icon={icon} color={color} />
            </div>
            <span className="text-default mt-3 block">{label}</span>
        </div>
    );
};

export default StatCard;