interface TimeTranslations {
    dueText: string;
    days: string;
    hours: string;
    minutes: string;
}

export const formatRemainingTime = (
    dueDate: string | null,
    translations: TimeTranslations
): string => {
    if (!dueDate) return "";

    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();

    if (diff <= 0) {
        return translations.dueText;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}${translations.days} ${hours}${translations.hours}`;
    if (hours > 0) return `${hours}${translations.hours} ${minutes}${translations.minutes}`;
    return `${minutes}${translations.minutes}`;
};