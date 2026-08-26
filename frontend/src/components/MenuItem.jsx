import { Link, useLocation } from "react-router-dom";
export default function MenuItem({ 
    to, 
    children 
}) { 

        const location = useLocation();
        
        return <Link
            to={to}
            className={location.pathname === to ? 'selected' : ''}
        >
            {children}
        </Link>;
}