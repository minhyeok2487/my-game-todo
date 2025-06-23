import { createSupabaseServerClient } from "@/lib/supabase/server";
import { HeroSection } from "./landing/HeroSection";

export default async function LandingPage() {
  const supabase = createSupabaseServerClient();

  const { data: images, error } = await supabase
    .from("predefined_games")
    .select("default_image_url")
    .limit(5);

  if (error) {
    console.error("배경 이미지 로딩 실패:", error);
  }

  const imageUrls = images?.map((img) => img.default_image_url) || [];

  return (
    <div>
      <HeroSection imageUrls={imageUrls} />
    </div>
  );
}
