import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("LandingPage.Footer");

  return (
    <footer className="py-6 mt-auto border-t border-border/40">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center text-sm text-muted-foreground gap-2 px-4">
        <p>
          &copy; {new Date().getFullYear()} My Game TODO. {t("rights")}
        </p>

        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="hover:text-foreground hover:underline transition-colors"
          >
            {t("privacyPolicy")}
          </Link>
          {/* 나중에 '이용약관' */}
          {/*
          <Link
            href="/terms"
            className="hover:text-gray-300 hover:underline transition-colors"
          >
            이용약관
          </Link>
          */}
        </div>
      </div>
    </footer>
  );
};
