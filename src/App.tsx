import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Login from "./components/Login";

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </NotificationProvider>
  );
}
