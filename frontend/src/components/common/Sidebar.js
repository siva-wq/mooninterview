import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Video,
  FileText,
  Menu,
  Clock3,
  X,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Schedule Interview",
      path: "/admin/schedule",
      icon: <CalendarDays size={20} />,
    },
    {
      name: "Interviews",
      path: "/admin/interviews",
      icon: <Video size={20} />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <FileText size={20} />,
    },
    {
      name: "Waiting Room",
      path: "/admin/waiting",
      icon: <Clock3 size={20} />,
    },
  ];

  return (
    <div
      className={`
        h-screen
        bg-white
        border-r
        border-custom
        shadow-lg
        transition-all
        duration-300
        flex
        flex-col

        ${open ? "w-72" : "w-24"}
      `}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-5">
        {open && (
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer select-none"
          >
            <h1 className="text-2xl font-extrabold">
              <span className="text-gold">Moon</span>
              <span className="text-primary">Interview</span>
            </h1>

            <span className="text-secondary text-sm">
              Smart Interviews. Better Hiring
            </span>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-xl text-navy hover:bg-zinc-100 transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 px-3 mt-8 flex flex-col gap-3">
        {menu.map((item, index) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`
                flex items-center
                ${open ? "justify-start gap-4 px-5" : "justify-center"}
                py-4 rounded-2xl
                transition-all duration-300
                font-medium group

                ${
                  active
                    ? "bg-primary text-white shadow-md"
                    : "text-primary hover:bg-blue-50"
                }
              `}
            >
              <div
                className={`
                  ${
                    active
                      ? "text-white"
                      : "text-secondary group-hover:text-gold"
                  }
                `}
              >
                {item.icon}
              </div>

              {open && (
                <span
                  className={`
                    ${
                      active
                        ? "text-white"
                        : "text-secondary group-hover:text-navy"
                    }
                  `}
                >
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Brand */}
      <div className="border-t border-custom p-6 flex flex-col items-center">
        <img
          src="/main_icon.png"
          alt="MoonInterview"
          className={`${open ? "w-24 h-24" : "w-12 h-12"} object-contain`}
        />
      </div>
    </div>
  );
}

export default Sidebar;