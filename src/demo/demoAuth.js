export const demoAdminUser = {
  id: "demo-admin",
  email: "admin@demo.com",
  user_metadata: {
    full_name: "Demo Administrator",
    role: "admin",
  },
};

export const demoAdminSession = {
  access_token: "demo-admin-access-token",
  token_type: "bearer",
  user: demoAdminUser,
};

export function createDemoAuth() {
  return {
    getSession: async () => ({
      data: { session: demoAdminSession },
      error: null,
    }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe() {} } },
    }),
    signInWithPassword: async () => ({
      data: { session: demoAdminSession, user: demoAdminUser },
      error: null,
    }),
    signUp: async () => ({
      data: { session: demoAdminSession, user: demoAdminUser },
      error: null,
    }),
    signInWithOAuth: async () => ({
      data: { session: demoAdminSession, user: demoAdminUser },
      error: null,
    }),
    signInWithOtp: async () => ({
      data: { session: demoAdminSession, user: demoAdminUser },
      error: null,
    }),
    resetPasswordForEmail: async () => ({ data: {}, error: null }),
    updateUser: async () => ({ data: { user: demoAdminUser }, error: null }),
    signOut: async () => ({ error: null }),
  };
}

