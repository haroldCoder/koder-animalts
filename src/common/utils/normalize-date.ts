export const normalizeStartDAte = (date: string | Date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

export const normalizeEndDate = (date: string | Date) => {
    const d = new Date(date);
    d.setUTCHours(23, 59, 59, 999);
    return d;
}
