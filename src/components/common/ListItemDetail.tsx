import {useTranslation} from "react-i18next";

interface ListItemDetailProps {
    label: string
    value?: string
    containerStyle?: string
    textStyle?: string
}

function ListItemDetail({label, value, containerStyle, textStyle}: ListItemDetailProps) {
    const {i18n} = useTranslation();
    const isRtl = i18n.language === 'ar';
    return (
        <div className={`${containerStyle} text-${isRtl ? 'right' : 'left'}`}>
            <p className={`text-sm font-open-sans ${textStyle}`}><span className={"text-default text-sm font-open-sans"}>{label}:</span> {value}</p>
        </div>
    );
}

export default ListItemDetail;
