import { NavLink } from 'react-router-dom';
import { Home, Briefcase, FileText, Users, Calendar, Settings, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Ask a Question', icon: MessageSquare, href: '/ask' },
  { name: 'Find a Lawyer', icon: Users, href: '/lawyers' },
  { name: 'Cases', icon: Briefcase, href: '/cases' },
  { name: 'Documents', icon: FileText, href: '/documents', children: [
    { name: 'All Documents', href: '/documents' },
    { name: 'E-Sign', href: '/documents/esign' }
  ]},
  { name: 'Community', icon: Users, href: '/community' },
  { name: 'Calendar', icon: Calendar, href: '/calendar' }
];

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Documents']);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-gray-900 pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <span className="text-xl font-bold text-white">ProSe Legal</span>
        </div>
        
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              <div
                className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md cursor-pointer ${
                  window.location.pathname === item.href || 
                  item.children?.some(child => window.location.pathname === child.href)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => item.children && toggleExpanded(item.name)}
              >
                <NavLink
                  to={item.href}
                  className="flex items-center flex-1"
                  onClick={(e) => item.children && e.preventDefault()}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
                {item.children && (
                  expandedItems.includes(item.name) 
                    ? <ChevronDown className="h-5 w-5" />
                    : <ChevronRight className="h-5 w-5" />
                )}
              </div>
              {item.children && expandedItems.includes(item.name) && (
                <div className="ml-8 space-y-1 mt-1 transition-all duration-200">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.href}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`
                      }
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto px-2 pb-4">
          <NavLink
            to="/settings"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </div>
    </div>
  );
}