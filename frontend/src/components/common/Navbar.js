import { useEffect, useState } from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import API from "../../api/axios";

import socket from "../../socket";

function Navbar() {

  const navigate = useNavigate();

  const [openProfile, setOpenProfile] =
    useState(false);

  const [openNotification, setOpenNotification] =
    useState(false);

  const [user, setUser] = useState(null);

  const [notifications, setNotifications] =
    useState([]);

  // ==========================================
  // FETCH CURRENT USER
  // ==========================================
  useEffect(() => {

    fetchCurrentUser();

  }, []);

  const fetchCurrentUser = async () => {

    try {

      const res = await API.get("https://mooninterview.onrender.com/api/auth/me");

      setUser(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // ==========================================
  // SOCKET REALTIME NOTIFICATIONS
  // ==========================================
  useEffect(() => {

    // CONNECT SOCKET
    socket.connect();

    // LISTEN NOTIFICATIONS
    socket.on("notification", (data) => {

      setNotifications((prev) => [

        {
          title: data.type,
          message: data.message
        },

        ...prev

      ]);
    });

    return () => {

      socket.off("notification");

    };

  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <div className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between shadow-sm">

      {/* LEFT */}

      <div>

        <h1 className="text-2xl font-bold text-zinc-800">
          Admin Dashboard
        </h1>

        <p className="text-sm text-zinc-500">
          Welcome back 👋
        </p>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4 relative">

        {/* ==========================================
            NOTIFICATIONS
        ========================================== */}

        <div className="relative">

          <button
            onClick={() =>
              setOpenNotification(
                !openNotification
              )
            }
            className="relative bg-zinc-100 p-3 rounded-xl hover:bg-zinc-200 transition"
          >

            <Bell
              size={20}
              className="text-zinc-700"
            />

            {
              notifications.length > 0 && (

                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )
            }

          </button>

          {/* NOTIFICATION DROPDOWN */}

          {openNotification && (

            <div className="absolute right-0 mt-3 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl p-4 z-50">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-lg font-bold text-zinc-800">
                  Notifications
                </h2>

                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">

                  {notifications.length} New

                </span>

              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">

                {
                  notifications.length > 0 ? (

                    notifications.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="flex gap-3 p-3 hover:bg-zinc-50 rounded-xl transition"
                        >

                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">

                            {item.title?.charAt(0)}

                          </div>

                          <div>

                            <h3 className="text-sm font-semibold text-zinc-800 capitalize">

                              {item.title}

                            </h3>

                            <p className="text-xs text-zinc-500 mt-1">

                              {item.message}

                            </p>

                          </div>

                        </div>
                      )
                    )

                  ) : (

                    <p className="text-sm text-zinc-500 text-center py-4">

                      No Notifications

                    </p>
                  )
                }

              </div>

            </div>
          )}

        </div>

        {/* ==========================================
            PROFILE DROPDOWN
        ========================================== */}

        <div className="relative">

          <button
            onClick={() =>
              setOpenProfile(!openProfile)
            }
            className="flex items-center gap-3 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-2xl transition-all"
          >

            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}`}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />

            <div className="text-left hidden md:block">

              <h2 className="text-sm font-semibold text-zinc-800">

                {user?.name || "User"}

              </h2>

              <p className="text-xs text-zinc-500 capitalize">

                {user?.role || "Role"}

              </p>

            </div>

            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${
                openProfile
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {/* PROFILE MENU */}

          {openProfile && (

            <div className="absolute right-0 mt-3 w-60 bg-white border border-zinc-200 rounded-2xl shadow-xl p-4 z-50">

              <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">

                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}`}
                  alt="profile"
                  className="w-12 h-12 rounded-full"
                />

                <div>

                  <h2 className="font-semibold text-zinc-800">

                    {user?.name}

                  </h2>

                  <p className="text-sm text-zinc-500 capitalize">

                    {user?.role}

                  </p>

                </div>

              </div>

              <button
                onClick={logout}
                className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
              >

                <LogOut size={18} />

                Logout

              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Navbar;
