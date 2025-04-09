import {cloneElement, isValidElement, ReactNode} from "react";
import {NavLink} from "react-router-dom";

interface NavigationItemProps {
    to: string;
    icon: ReactNode;
    label: string;
}

const NavigationItem = ({to, icon, label}: NavigationItemProps) => (
    <NavLink
        to={to}
        className={({isActive}) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
            }`
        }
    >
        {({isActive}) => (
            <>
                <div className="text-xl">
                    {isValidElement(icon) ?
                        cloneElement(icon, {
                            sx: {
                                color: isActive ? 'white' : "#3f51b5",
                                ...(isValidElement(icon) && icon.props.sx)
                            }
                        }) :
                        icon
                    }
                </div>
                <span className="font-merriweather-regular">{label}</span>
            </>
        )}

    </NavLink>
);

export default NavigationItem;
