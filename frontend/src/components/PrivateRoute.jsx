import { Navigate } from 'react-router-dom';
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You must Login to access this page");
        return <Navigate to="/signin" />
    }
    return children;
}
