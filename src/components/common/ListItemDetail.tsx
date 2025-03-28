
interface ListItemDetailProps {
    label: string
    value?: string
    containerStyle?: string
    textStyle?: string
}

function ListItemDetail({label, value, containerStyle, textStyle}: ListItemDetailProps) {
    return (
        <div className={`${containerStyle}`}>
            <p className={`text-sm font-open-sans ${textStyle}`}>
                <span className={"text-default text-sm font-open-sans"}>{label}:</span> {value}</p>
        </div>
    );
}

export default ListItemDetail;
