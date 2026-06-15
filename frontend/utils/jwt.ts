/**
 * function to get expiration time from token
 * it decodes the token and gets the expiration time
 * JWT Token is Base64 encoded, so we need to decode it to get the expiration time
 * @param token 
 * @returns 
 */
export function getTokenExpiry(token: string): number {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000; //convert sec to ms timestamp
    } catch {
        return 0;
    }
}
/**
 * function to check if token is expired
 * it compares the current time with the expiration time
 * @param token string
 * @returns boolean
 */
export function isTokenExpired(token: string): boolean {
    return Date.now() >= getTokenExpiry(token);
}