import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { FaDiscord, FaTwitter, FaInstagram } from "react-icons/fa";

export const Footer = () => {
  const t = useTranslations("LandingPage.Footer");

  return (
    <footer className="py-6 mt-auto border-t border-border/40">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-sm text-muted-foreground text-center">
        <p>
          &copy; {new Date().getFullYear()} My Game TODO. {t("rights")}
        </p>

        {/* 소셜 아이콘 - 가운데 정렬 */}
        <div className="flex gap-4 text-lg mx-auto">
          <a
            href="https://discord.gg/Cg9VwJrbTk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="Discord"
          >
            <FaDiscord />
          </a>
          <a
            href="https://x.com/Mabowling95"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com/devmh1995"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>

        {/* 개인정보 처리방침 등 */}
        <div className="flex gap-4 mt-1">
          <Link
            href="/privacy"
            className="hover:text-foreground hover:underline transition-colors"
          >
            {t("privacyPolicy")}
          </Link>
        </div>
      </div>
    </footer>
  );
};
