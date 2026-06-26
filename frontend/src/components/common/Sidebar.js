import { useEffect,useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Video,
  FileText,
  Menu,
  Clock3 ,
  X,
} from "lucide-react";

function Sidebar() {

  const location = useLocation();

  const [open, setOpen] = useState(() => {
  const saved = localStorage.getItem("sidebarOpen");
  return saved !== null ? JSON.parse(saved) : true;
});

useEffect(() => {
  localStorage.setItem(
    "sidebarOpen",
    JSON.stringify(open)
  );
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
      name:"Waiting Room",
      path:"/admin/waiting",
      icon:<Clock3 size={20}/>
    },
  ];

  return (

    <div
      className={`
        min-h-screen bg-white border-r border-zinc-200 shadow-lg
        transition-all duration-300

        ${open ? "w-72" : "w-24"}
      `}
    >

      {/* Top */}

      <div className="flex items-center justify-between p-5">

        {open && (

          <div>

            <h1 className="text-2xl font-extrabold text-blue-600">
              Moon Interview
            </h1>

            <p className="text-zinc-500 text-sm">
              AI Interview Platform
            </p>

          </div>
        )}

        {/* Toggle Button */}

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-xl hover:bg-zinc-100 transition"
        >

          {open ? <X size={22} /> : <Menu size={22} />}

        </button>

      </div>

      {/* Menu */}

      <div className="flex flex-col gap-3 px-3 mt-8">

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
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-zinc-700 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >

              <div
                className={`
                  ${
                    active
                      ? "text-white"
                      : "text-zinc-500 group-hover:text-blue-600"
                  }
                `}
              >
                {item.icon}
              </div>

              {open && (
                <span className="text-[15px]">
                  {item.name}
                </span>
              )}

            </Link>
          );
        })}

      </div>
    </div>
  );
}

export default Sidebar;
