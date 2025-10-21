import React, { useState } from 'react';
import { Teacher, Notification } from './types';
import { mockTeachers, mockGroups, mockFriendRequests, mockReports, mockSessions, mockAppointments, mockNotifications } from './data/mockData';
import { LoginRegistration } from './components/LoginRegistration';
import { PrimaryNavbar } from './components/PrimaryNavbar';
import { SecondarySidebar } from './components/SecondarySidebar';
import { Homepage } from './components/Homepage';
import { ChatInterface } from './components/ChatInterface';
import { GroupChatInterface } from './components/GroupChatInterface';
import { TeacherProfile } from './components/TeacherProfile';
import { UserProfileEdit } from './components/UserProfileEdit';
import { AllTeachers } from './components/AllTeachers';
import { AllGroups } from './components/AllGroups';
import { NotificationsPage } from './components/NotificationsPage';
import { LanguageToggle } from './components/LanguageToggle';
import { AddFriendModal } from './components/AddFriendModal';
import { CreateGroupModal } from './components/CreateGroupModal';
import { translations, Language } from './translations';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import 'antd/dist/reset.css';

type ViewType = 'home' | 'chat' | 'contacts' | 'all-teachers' | 'all-groups' | 'notifications' | 'admin';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<Teacher | null>(null);
  const [language, setLanguage] = useState<Language>('ja');
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [selectedProfile, setSelectedProfile] = useState<Teacher | null>(null);
  const [chatTeacher, setChatTeacher] = useState<Teacher | null>(null);
  const [chatGroup, setChatGroup] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [friends, setFriends] = useState<Teacher[]>([mockTeachers[0], mockTeachers[2]]);
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ja' ? 'vi' : 'ja');
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setIsAuthenticated(true);
    setActiveView('admin');
    toast.success('Admin login successful');
  };

  const handleLogin = (userData: { name: string; email: string; nationality: 'Japanese' | 'Vietnamese' }) => {
    const newUser: Teacher = {
      id: 'current-user',
      name: userData.name,
      nationality: userData.nationality,
      avatar: 'https://images.unsplash.com/photo-1664382951771-40432ecc81bd?w=400',
      specialties: ['General Education'],
      experience: 5,
      interests: ['Teaching Methods', 'Cultural Exchange'],
      bio: 'Passionate educator looking to connect with teachers worldwide.',
      subjects: ['Various']
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setActiveView('home');
    setChatTeacher(null);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const handleSaveProfile = (updatedUser: Teacher) => {
    setCurrentUser(updatedUser);
    toast.success(language === 'ja' ? 'プロフィールを更新しました' : 'Đã cập nhật hồ sơ');
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    if (view !== 'chat') {
      setChatTeacher(null);
      setChatGroup(null);
    }
  };

  const handleSelectChat = (teacher: Teacher) => {
    setChatTeacher(teacher);
    setChatGroup(null);
    setActiveView('chat');
  };

  const handleSelectGroup = (group: any) => {
    setChatGroup(group);
    setChatTeacher(null);
    setActiveView('chat');
  };

  const handleSendFriendRequest = (teacher: Teacher) => {
    toast.success(
      language === 'ja'
        ? `${teacher.name}さんに友達リクエストを送信しました`
        : `Đã gửi lời mời kết bạn đến ${teacher.name}`
    );
  };

  const handleJoinGroup = (groupId: string) => {
    const group = mockGroups.find(g => g.id === groupId);
    if (group) {
      toast.success(
        language === 'ja'
          ? `${group.name}に参加しました`
          : `Đã tham gia ${group.name}`
      );
    }
  };

  const handleAddFriend = () => {
    setIsAddFriendModalOpen(true);
  };

  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <div className="relative">
          <div className="absolute top-4 right-4 z-50">
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          </div>
          <LoginRegistration
            onLogin={handleLogin}
            onAdminLogin={handleAdminLogin}
            language={language}
          />
        </div>
        <Toaster />
      </>
    );
  }

  // Admin Panel
  if (isAdmin) {
    return (
      <>
        <div className="h-screen flex flex-col bg-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">🛡️ TeachMate Admin Panel</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-4">Welcome, Administrator</h2>
                <p className="text-gray-600 mb-6">You have successfully logged in to the admin dashboard.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <h3 className="font-semibold text-lg">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">25</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                    <h3 className="font-semibold text-lg">Pending Reports</h3>
                    <p className="text-3xl font-bold text-orange-600">6</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold text-lg">Active Groups</h3>
                    <p className="text-3xl font-bold text-green-600">12</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Account Information</h3>
                  <p className="text-sm">Email: admin@gmail.com</p>
                  <p className="text-sm">Access Level: Full Control</p>
                  <p className="text-sm">Status: Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  // Main application layout
  return (
    <>
      <div className="h-screen flex overflow-hidden">
        {/* Primary Navbar (1.5cm / ~80px) */}
        <PrimaryNavbar
          user={currentUser!}
          activeView={activeView}
          onViewChange={handleViewChange}
          onEditProfile={() => setIsEditingProfile(true)}
          onLogout={handleLogout}
          onViewNotifications={() => setActiveView('notifications')}
          unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
          language={language}
        />

        {/* Secondary Sidebar (shown for chat and contacts views) */}
        {(activeView === 'chat' || activeView === 'contacts') && (
          <SecondarySidebar
            view={activeView as 'chat' | 'contacts'}
            language={language}
            friends={friends}
            groups={mockGroups}
            friendRequests={friendRequests}
            onSelectChat={handleSelectChat}
            onSelectGroup={handleSelectGroup}
            onAddFriend={handleAddFriend}
            onCreateGroup={handleCreateGroup}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b-2 px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h1 className="mb-1">{t.appName}</h1>
              <p className="text-gray-600">{t.tagline}</p>
            </div>
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeView === 'home' && (
              <Homepage
                user={currentUser!}
                language={language}
                teachers={mockTeachers}
                groups={mockGroups}
                exchangeSessions={mockSessions}
                appointments={mockAppointments}
                onSendFriendRequest={handleSendFriendRequest}
                onViewTeacherProfile={setSelectedProfile}
                onJoinGroup={handleJoinGroup}
                onViewAllTeachers={() => setActiveView('all-teachers')}
                onViewAllGroups={() => setActiveView('all-groups')}
              />
            )}

            {activeView === 'all-teachers' && (
              <AllTeachers
                teachers={mockTeachers}
                language={language}
                onSendFriendRequest={handleSendFriendRequest}
                onViewTeacherProfile={setSelectedProfile}
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'all-groups' && (
              <AllGroups
                groups={mockGroups}
                language={language}
                onJoinGroup={handleJoinGroup}
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'notifications' && (
              <NotificationsPage
                notifications={notifications}
                teachers={mockTeachers}
                language={language}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDeleteNotification={handleDeleteNotification}
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'chat' && chatTeacher && (
              <ChatInterface
                currentTeacher={currentUser}
                selectedTeacher={chatTeacher}
                onBack={() => setChatTeacher(null)}
                onViewProfile={setSelectedProfile}
                isFriend={friends.some(friend => friend.id === chatTeacher.id)}
                onSendFriendRequest={handleSendFriendRequest}
                language={language}
              />
            )}

            {activeView === 'chat' && chatGroup && (
              <GroupChatInterface
                currentUser={currentUser}
                selectedGroup={chatGroup}
                onBack={() => setChatGroup(null)}
                language={language}
              />
            )}

            {activeView === 'chat' && !chatTeacher && !chatGroup && (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <p className="text-lg">{t.noConversations}</p>
                  <p className="text-sm mt-2">{language === 'ja' ? '左側のリストから友達またはグループを選択してください' : 'Chọn một người bạn hoặc nhóm từ danh sách bên trái'}</p>
                </div>
              </div>
            )}

            {activeView === 'contacts' && (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <p className="text-lg">{language === 'ja' ? '連絡先管理' : 'Quản lý danh bạ'}</p>
                  <p className="text-sm mt-2">{language === 'ja' ? '左側のリストから友達やグループを管理できます' : 'Quản lý bạn bè và nhóm từ danh sách bên trái'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TeacherProfile
        teacher={selectedProfile}
        open={selectedProfile !== null}
        onClose={() => setSelectedProfile(null)}
        onStartChat={(teacher) => {
          setActiveView('chat');
          setChatTeacher(teacher);
          setSelectedProfile(null);
        }}
        language={language}
      />

      <UserProfileEdit
        user={currentUser}
        open={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        onSave={handleSaveProfile}
        language={language}
      />

      <AddFriendModal
        open={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        teachers={mockTeachers}
        currentUserId={currentUser?.id || ''}
        onSendFriendRequest={handleSendFriendRequest}
        language={language}
      />

      <CreateGroupModal
        open={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        teachers={mockTeachers}
        onCreateGroup={(name, memberIds) => {
          toast.success(language === 'ja' ? `${name}を作成しました` : `Đã tạo nhóm ${name}`);
        }}
        language={language}
      />

      <Toaster />
    </>
  );
}
