import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const res = await fetch("http://localhost:3000/logout", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          navigate("/login"); // redirect to login page
        }
      } catch (err) {
        console.error("Logout failed:", err);
        navigate("/login"); // still redirect if error
      }
    };
    logout();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center text-gray-400 font-medium">
      Logging out...
    </div>
  );
}
