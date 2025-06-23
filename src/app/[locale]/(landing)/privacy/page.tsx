import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";

function Disclaimer({ text }: { text: string }) {
  return (
    <div className="mb-8 p-4 border-l-4 border-yellow-500 bg-yellow-500/10 text-yellow-300 rounded-r-lg">
      <p className="font-semibold">{text}</p>
    </div>
  );
}

function Article({ title, content }: { title: string; content: string[] }) {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {content.map((line, idx) => (
        <p key={idx} className="mb-1 leading-relaxed whitespace-pre-line">
          {line}
        </p>
      ))}
    </div>
  );
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("PrivacyPolicyPage");
  const locale = await getLocale(); // 서버 컴포넌트에서 현재 locale 가져오기

  const articles = Array.from({ length: 9 }, (_, index) => ({
    title: t(`articles.${index}.title`),
    content: t.raw(`articles.${index}.content`) as string[],
  }));

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{t("pageTitle")}</h1>
      <p className="text-sm text-gray-500 mb-10">
        {t("effectiveDate", {
          date: new Date(2025, 5, 23),
        })}
      </p>

      {locale !== "ko" && <Disclaimer text={t("disclaimer")} />}

      <section className="space-y-6">
        {articles.map((article, index) => (
          <Article
            key={index}
            title={article.title}
            content={article.content}
          />
        ))}
      </section>
    </div>
  );
}
