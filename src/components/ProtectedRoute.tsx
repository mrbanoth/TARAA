import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAdmin();

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}
