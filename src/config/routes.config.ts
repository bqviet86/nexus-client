const routes = {
    home: '/',
    welcome: '/welcome',
    login: '/login',
    register: '/register',
    chat: '/chat',
    profile: '/profile/:profile_id',
    updateProfile: '/update-profile',
    postDetail: '/post-detail/:post_id',
    hashtag: '/hashtag/:hashtag_name',
    dating: '/dating',
    datingCall: '/dating/call',
    datingCallHistory: '/dating/call-history',
    datingChat: '/dating/chat',
    datingChatDetail: '/dating/chat/:profile_id',
    datingNotification: '/dating/notification',
    datingProfile: '/dating/profile/:profile_id',
    datingUpdateProfile: '/dating/update-profile',
    datingUpdateCriteria: '/dating/update-criteria',
    datingPersonalityTest: '/dating/personality-test',
    datingPersonalityTestDetail: '/dating/personality-test/:test_id',

    // Admin
    adminStats: '/admin/stats',
    adminUsers: '/admin/users',
    adminConstructiveTests: '/admin/constructive-tests',
    adminPersonalityTests: '/admin/personality-tests'
}

export default routes
