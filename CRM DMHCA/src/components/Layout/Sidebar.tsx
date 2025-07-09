import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users, 
  BookOpen, 
  BarChart3, 
  UserCog, 
  Calendar,
  Settings,
  Home,
  TrendingUp,
  MessageCircle,
  FileText,
  Building
} from 'lucide-react';
import logo from '../../assets/logo.png.png';
import { useCRM } from '../../context/CRMContext';



export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = useCRM();
  const currentUser = state.currentUser;

  // Role-based navigation filtering
  const roleNavPermissions: Record<string, string[]> = {
    senior_manager: [
      '/', '/leads', '/kanban', '/courses', '/hospitals', '/whatsapp', '/followups', '/analytics', '/counselors', '/settings', '/sales-report'
    ],
    manager: [
      '/', '/leads', '/kanban', '/courses', '/hospitals', '/whatsapp', '/followups', '/analytics', '/counselors', '/settings', '/sales-report'
    ],
    floor_manager: [
      '/', '/leads', '/kanban', '/courses', '/hospitals', '/whatsapp', '/followups', '/analytics', '/counselors', '/settings'
    ],
    team_leader: [
      '/', '/leads', '/kanban', '/courses', '/hospitals', '/whatsapp', '/followups', '/counselors'
    ],
    counselor: [
      '/', '/leads', '/kanban', '/courses', '/hospitals', '/whatsapp', '/followups', '/counselors'
    ]
  };

  const allowedHrefs = roleNavPermissions[currentUser.role] || [];

  const navigationItems = [
    { name: t('nav.dashboard'), href: '/', icon: Home },
    { name: t('nav.leadManagement'), href: '/leads', icon: Users },
    { name: t('nav.kanbanBoard'), href: '/kanban', icon: TrendingUp },
    { name: t('nav.courses'), href: '/courses', icon: BookOpen },
    { name: t('nav.hospitals'), href: '/hospitals', icon: Building },
    { name: t('nav.whatsapp'), href: '/whatsapp', icon: MessageCircle },
    { name: t('nav.followUps'), href: '/followups', icon: Calendar },
    { name: t('nav.analytics'), href: '/analytics', icon: BarChart3 },
    { name: t('nav.counselors'), href: '/counselors', icon: UserCog },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
    { name: 'Sales Report', href: '/sales-report', icon: FileText },
  ];

  const filteredNavigationItems = navigationItems.filter(item => allowedHrefs.includes(item.href));

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-full border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col items-center space-y-2">
          <img src={logo} alt="DMHCA Logo" style={{ height: 60 }} />
          <span style={{ fontWeight: 'bold', fontSize: 20, marginTop: 8 }}>DMHCA CRM</span>
        </div>
      </div>

      <nav className="mt-8">
        <div className="px-3">
          {filteredNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
          <li>
            <a
              href="/followups"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded transition-colors hover:bg-blue-100 hover:text-blue-900 ${location.pathname === '/followups' ? 'bg-blue-200 text-blue-900' : 'text-gray-700'}`}
            >
              <span className="mr-2">⏰</span>
              Followups
              {/* Show count of leads with followUpDate set */}
              {state.leads && state.leads.filter(l => l.followUpDate).length > 0 && (
                <span className="ml-2 bg-blue-600 text-white rounded-full px-2 text-xs">
                  {state.leads.filter(l => l.followUpDate).length}
                </span>
              )}
            </a>
          </li>
        </div>
      </nav>
    </div>
  );
}