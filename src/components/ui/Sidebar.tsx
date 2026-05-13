import { NavLink } from "./NavLink";

const NAV_ITEMS = [
  { href: "/", icon: "⬛", label: "Dashboard" },
  { href: "/sectors", icon: "🗺", label: "Sector Map" },
  { href: "/watchlist", icon: "👁", label: "Watchlist" },
  { href: "/catalysts", icon: "⚡", label: "Catalysts" },
  { href: "/risks", icon: "⚠", label: "Risk Tracker" },
  { href: "/portfolio", icon: "📊", label: "Portfolio Ideas" },
  { href: "/reports", icon: "🤖", label: "AI Reports" },
  { href: "/learn", icon: "📚", label: "Learn" },
];

export function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900/50 min-h-screen">
      <div className="px-4 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">📈</span>
          <div>
            <div className="text-sm font-bold text-white">PlayMarket</div>
            <div className="text-xs text-gray-500">AI Research OS</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} />
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="text-xs text-gray-600">
          <div className="font-medium text-gray-500 mb-1">Focus Sectors</div>
          <div className="space-y-0.5 text-gray-600">
            <div>AI · Semis · Optics</div>
            <div>Robotics · Defense</div>
            <div>Rare Earth · Power</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
