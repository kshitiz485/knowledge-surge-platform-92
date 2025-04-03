
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading } = useAuth();
  
  // Get user id and user role from the app_metadata (default to "USER" if not found)
  const userId = user?.id;
  const userRole = (user && user.app_metadata && user.app_metadata.role) || "USER";
  
  // You are the admin - any logged in user can access admin pages for development
  // In production, you would restrict this more carefully
  const isAdmin = userRole === "ADMIN" || userId === user?.id;

  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Deny access if not an admin
  if (!isAdmin) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/tests" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
