// app/sitemap.ts
import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing'; // i18n 설정에서 locales 배열을 가져옴

// 기본 도메인 설정 (환경 변수 사용 권장)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://my-game-todo.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const locales = routing.locales; // ['ko', 'en', ...]

    const urls: MetadataRoute.Sitemap = [];

    // 1. 정적 페이지 (각 언어별로 생성)
    locales.forEach(locale => {
        urls.push({
            url: `${BASE_URL}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        });
    });

    return urls;
}