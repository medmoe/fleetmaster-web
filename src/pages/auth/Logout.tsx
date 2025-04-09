import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {API} from "../../constants/endpoints.ts";
import useAuthStore from "../../store/useAuthStore.ts";

interface LogoutButtonProps {
    icon: React.ReactNode;
    label: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({icon, label}) => {
    const navigate = useNavigate();
    const {logout} = useAuthStore();

    const handleLogout = async () => {
        try {
            // Call your logout API endpoint with credentials to include cookies
            await axios.post(`${API}/accounts/logout/`, {}, {
                withCredentials: true
            });

            // Navigate to login page after successful logout
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            // If the API call fails, still redirect to login
            // The backend should have invalidated the cookie even if there was an error response
            navigate('/');
        } finally {
            logout();
            localStorage.clear();
            sessionStorage.clear();
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 w-full text-left"
        >
            <span className="text-gray-500 mr-3">{icon}</span>
            {label}
        </button>
    );
};

export default LogoutButton;