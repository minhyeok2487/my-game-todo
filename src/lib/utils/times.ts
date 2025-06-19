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

    const result = [];
    if (days > 0) result.push(`${days}일`);
    if (hours > 0) result.push(`${hours}시간`);
    // 분은 항상 표시하거나, 일 단위가 있을 땐 생략하는 등 정책에 따라 조절 가능
    if (minutes > 0) result.push(`${minutes}분`);

    // 아무것도 없으면 (1분 미만) "곧 마감"으로 표시
    if (result.length === 0) {
        return "곧 마감";
    }

    return `${result.join(" ")} 남음`;
};