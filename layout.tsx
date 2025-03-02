import Sidebar from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar>
          {children}
        </Sidebar>
      </body>
    </html>
  );
} 