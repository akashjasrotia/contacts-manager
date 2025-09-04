import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function UserIndicator() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [user]);

  return (
    <div className="absolute gap-2 top-6 right-6 bg-white/10 cursor-pointer hover:bg-white/30 hover:border-0 flex items-center space-x-2  rounded-full p-3">
        {user && <button onClick={()=>navigate('/logout')} className="px-2 w-full h-full cursor-pointer hover:bg-white/30 text-white">Logout</button>}
      <div
        className={`w-8 h-8 rounded-full shrink-0 ${
          user ? "bg-blue-500" : "bg-gray-500"
        } flex items-center justify-center text-white text-sm font-semibold shadow-md transition-colors duration-300`}
        title={user ? user.email : "Not logged in"}
      >
        {user ? user.name?.[0].toUpperCase() || user.email?.[0].toUpperCase() : "?"}
      </div>
      {user && <span className="text-white font-medium text-sm">{user.name || user.email}</span>}
    </div>
  );
}
