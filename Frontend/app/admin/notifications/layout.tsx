import { useNotifications } from "@/components/NotificationsContext";
import { NotificationCenter } from "@/components/notification-center";
export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NotificationCenter />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">{children}</div>
      </div>
    </>
  );
}
