import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/landing/HeroSection";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default async function LandingPage() {
  const t = await getTranslations("LandingPage");
  const supabase = createSupabaseServerClient();

  const { data: images, error } = await supabase
    .from("predefined_games")
    .select("default_image_url")
    .limit(5);

  if (error) {
    console.error("배경 이미지 로딩 실패:", error);
  }

  const imageUrls = images?.map((img) => img.default_image_url) || [];

  const featureItems = [
    {
      title: t("Features.items.0.title"),
      description: t("Features.items.0.description"),
    },
    {
      title: t("Features.items.1.title"),
      description: t("Features.items.1.description"),
    },
    {
      title: t("Features.items.2.title"),
      description: t("Features.items.2.description"),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <HeroSection
          imageUrls={imageUrls}
          translations={{
            title_line1: t("Hero.title_line1"),
            title_line2_span: t("Hero.title_line2_span"),
            title_line2_rest: t("Hero.title_line2_rest"),
            subtitle_line1: t("Hero.subtitle_line1"),
            subtitle_line2: t("Hero.subtitle_line2"),
            subtitle_line3_strong: t("Hero.subtitle_line3_strong"),
            subtitle_line3_rest: t("Hero.subtitle_line3_rest"),
            button: t("Hero.button"),
            alt_text: t("Hero.alt_text"),
          }}
        />

        <Features
          title={t("Features.title")}
          subtitle={t("Features.subtitle")}
          items={featureItems}
        />

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
