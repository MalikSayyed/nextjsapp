import AuthProviders from "@/components/providers/AuthProviders";
import "../globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["300", "400"],
  subsets: ["latin"],
});

export default function LoginLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={montserrat.className} suppressHydrationWarning={true}>
        <AuthProviders>
          <section>{children}</section>
        </AuthProviders>
      </body>
    </html>
  );
}
