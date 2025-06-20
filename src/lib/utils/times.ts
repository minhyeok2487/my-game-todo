export const formatRemainingTime = (dueDateString: string | null): string => {
    if (!dueDateString) return "";

    const now = new Date();
    const dueDate = new Date(dueDateString);
    const diff = dueDate.getTime() - now.getTime();

    if (diff <= 0) {
        return "마감";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}일`);
    if (hours > 0) parts.push(`${hours}시간`);
    // 분 단위는 너무 자주 바뀌므로, 일/시간 단위가 있을 때는 생략하는 것이 더 깔끔할 수 있습니다.
    if (days === 0 && hours > 0) parts.push(`${minutes}분`);
    if (days === 0 && hours === 0) return "곧 마감";

    return `${parts.join(" ")} 남음`;
};