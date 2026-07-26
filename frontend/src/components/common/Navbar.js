import { useEffect, useState } from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
  UserPlus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import CreateCandidate from "../../auth/CreateCandidate";

import API from "../../api/axios";

import socket from "../../socket";
import toast from "react-hot-toast";

function Navbar() {

  const navigate = useNavigate();

  const [openProfile, setOpenProfile] =
    useState(false);

  const [openNotification, setOpenNotification] =
    useState(false);

  const [organisationStatus, setOrganisationStatus] =
    useState(null);

  const [user, setUser] = useState(null);

  const [notifications, setNotifications] =
    useState([]);
  const [showCreateCandidate, setShowCreateCandidate] = useState(false);
  // ==========================================
  // FETCH CURRENT USER
  // ==========================================
  useEffect(() => {
    fetchOrganisationStatus();
    fetchCurrentUser();

  }, []);

  const fetchCurrentUser = async () => {

    try {

      const res = await API.get("/auth/me");

      setUser(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  const fetchOrganisationStatus = async () => {
    try {
      const res = await API.get(
        "/organisation-status"
      );

      setOrganisationStatus(res.data);

    } catch (error) {
      console.log(error);
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
      console.log("Notification received:", data);


      setNotifications((prev) => [

        {
          title: data.type,
          message: data.message
        },

        ...prev

      ]);
      toast(data.message);
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

    <div className="card border-b border-custom px-8 py-4 flex items-center justify-between shadow-sm">

      {/* LEFT */}

      <div className="flex">
        <div>


          <h1 className="text-2xl font-bold text-navy">
            Admin Dashboard
          </h1>

          <p className="text-sm text-secondary">
            Welcome back 👋
          </p>
        </div>
        <div>
          {organisationStatus && (

            <div
              className={`hidden md:block inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
      ${organisationStatus.expired
                  ? "bg-red-100 text-red-600"
                  : organisationStatus.daysLeft <= 7
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-600"
                }`}
            >

              {organisationStatus.expired
                ? "Organisation Expired"
                : `${organisationStatus.daysLeft} Days Remaining`}

            </div>
          )}
        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4 relative">

        <button
          onClick={() => {
            setOpenProfile(false);
            setOpenNotification(false);
            setShowCreateCandidate(true);
          }}
          className="btn-primary flex items-center gap-2 rounded-xl px-4 py-3"
        >
          <UserPlus size={18} />
          <span className="hidden md:block">
            Create Candidate
          </span>
        </button>

        {/* ==========================================
            NOTIFICATIONS
        ========================================== */}

        
<div className="relative hidden md:block">

          <button
            onClick={() =>
              setOpenNotification(
                !openNotification
              )
            }
            className="relative bg-zinc-100 p-2 md:p-3 rounded-xl md:block sm:block"
          >

            <Bell
              size={20}
              className="text-navy"
            />

            {
              notifications.length > 0 && (

                <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"></span>
              )
            }

          </button>

          {/* NOTIFICATION DROPDOWN */}

          {openNotification && (

            <div className="absolute right-0 mt-3 w-80 card border-custom rounded-2xl shadow-xl p-4 z-50">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-lg font-bold text-navy">
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

                            <h3 className="text-sm font-semibold text-navy capitalize">

                              {item.title}

                            </h3>

                            <p className="text-xs text-secondary mt-1">

                              {item.message}

                            </p>

                          </div>

                        </div>
                      )
                    )

                  ) : (

                    <p className="text-sm text-secondary text-center py-4">

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

              <h2 className="text-sm font-semibold text-navy">

                {user?.name || "User"}

              </h2>

              <p className="text-xs text-secondary capitalize">

                {user?.role || "Role"}

              </p>

            </div>

            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${openProfile
                ? "rotate-180"
                : ""
                }`}
            />

          </button>

          {/* PROFILE MENU */}

          {openProfile && (

            <div className="absolute right-0 mt-3 w-60 card border-custom rounded-2xl shadow-xl p-4 z-50">

              <div className="flex items-center gap-3 pb-4 border-b border-custom">

                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}`}
                  alt="profile"
                  className="w-12 h-12 rounded-full"
                />

                <div>

                  <h2 className="font-semibold text-navy">

                    {user?.name}

                  </h2>

                  <p className="text-sm text-secondary capitalize">

                    {user?.role}

                  </p>

                </div>

              </div>

              <button
                onClick={logout}
                className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-red-50 transition-all"
              >

                <LogOut size={18} />

                Logout

              </button>

            </div>
          )}

        </div>

      </div>
      {showCreateCandidate && (
        <CreateCandidate
          onClose={() => setShowCreateCandidate(false)}
        />
      )}

    </div>
  );
}

export default Navbar;