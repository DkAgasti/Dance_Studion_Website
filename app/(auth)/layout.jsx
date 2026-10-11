// Auth layout — minimal full-screen shell for standalone auth pages (login,
// etc.), without the dashboard sidebar/topbar chrome. The login page itself
// handles centering/card styling.
export default function AuthLayout({ children }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
