# -*- coding: utf-8 -*-
with open(r"app\candidate\layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the lucide-react imports to include MessageSquare, ChevronDown
import_old = """  Search, Bell, Settings, LogOut, HelpCircle, UserPlus, Menu, X
} from 'lucide-react';"""
import_new = """  Search, Bell, Settings, LogOut, HelpCircle, UserPlus, Menu, X, MessageSquare, ChevronDown, User
} from 'lucide-react';"""
content = content.replace(import_old, import_new)

# Add state for dropdown
state_old = """  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);"""
state_new = """  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);"""
content = content.replace(state_old, state_new)

# Add navItems for Messages
nav_old = """    { name: 'Jobs', href: '/candidate/jobs', icon: Briefcase },
    { name: 'Applications', href: '/candidate/applications', icon: FileText },"""
nav_new = """    { name: 'Jobs', href: '/candidate/jobs', icon: Briefcase },
    { name: 'Applications', href: '/candidate/applications', icon: FileText },
    { name: 'Messages', href: '/candidate/messages', icon: MessageSquare },"""
content = content.replace(nav_old, nav_new)

# Add dropdown and message icon to header
header_old = """          <div className="flex items-center gap-3 sm:gap-5">
            <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              <HelpCircle size={18} /> Support
            </button>
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            <button className="relative text-gray-500 hover:text-gray-900 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="text-gray-500 hover:text-gray-900 transition-colors">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 overflow-hidden flex-shrink-0 cursor-pointer">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>"""
header_new = """          <div className="flex items-center gap-3 sm:gap-5 relative">
            <Link href="/candidate/support" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              <HelpCircle size={18} /> Support
            </Link>
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            
            <Link href="/candidate/messages" className="relative text-gray-500 hover:text-gray-900 transition-colors">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></span>
            </Link>

            <Link href="/candidate/notifications" className="relative text-gray-500 hover:text-gray-900 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 overflow-hidden flex-shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Candidate Account</p>
                  </div>
                  <div className="p-1.5">
                    <Link onClick={() => setProfileDropdownOpen(false)} href="/candidate/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"><User size={16}/> View Profile</Link>
                    <Link onClick={() => setProfileDropdownOpen(false)} href="/candidate/profile/edit" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"><Settings size={16}/> Edit Profile</Link>
                    <Link onClick={() => setProfileDropdownOpen(false)} href="/candidate/settings" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"><Shield size={16}/> Settings & Privacy</Link>
                  </div>
                  <div className="p-1.5 border-t border-gray-100">
                    <button onClick={() => { setProfileDropdownOpen(false); logout(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={16}/> Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>"""
content = content.replace(header_old, header_new)

with open(r"app\candidate\layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Dropdown Profile Menu and Message Icon into Layout!")
