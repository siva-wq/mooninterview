function DashboardCard({ title, value, increase }) {

  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border border-zinc-200
        bg-white
        p-6
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >

      {/* Glow Effect */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-zinc-100 blur-3xl"></div>

      {/* Top Section */}
      <div className="flex items-start justify-between">

        {/* Title */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            {title}
          </p>

          <h1 className="mt-4 text-4xl font-bold text-zinc-900">
            {value}
          </h1>
        </div>

        {/* Increase Badge */}
        <span
          className="
            rounded-2xl
            border border-emerald-200
            bg-emerald-50
            px-3
            py-1
            text-sm
            font-semibold
            text-emerald-600
            shadow-sm
          "
        >
          {increase}
        </span>

      </div>

      {/* Bottom Accent Line */}
      <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-zinc-900 to-zinc-400"></div>

    </div>
  );
}

export default DashboardCard;