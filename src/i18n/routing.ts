import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // 지원되는 언어를 입력하세요 ! 
    locales: ['en', 'ko', 'ja', 'zh'],

    // 기본 언어 설정
    defaultLocale: 'en',

    localeDetection: false
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);