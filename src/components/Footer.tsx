import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="py-6 mt-auto border-t border-gray-800">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center text-sm text-gray-500 gap-2 px-4">
        <p>
          &copy; {new Date().getFullYear()} My Game TODO. All rights reserved.
        </p>

        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="hover:text-gray-300 hover:underline transition-colors"
          >
            개인정보 처리방침
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
