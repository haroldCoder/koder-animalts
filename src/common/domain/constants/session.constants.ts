export const SESSION_DURATION_DAYS = 3;
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * SESSION_DURATION_DAYS; // 3 days in milliseconds
export const SESSION_EXPIRES_IN_JWT = "3d";

export const getSessionExpirationDate = (): Date => {
    return new Date(Date.now() + SESSION_DURATION_MS);
};
