const PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Simple edge-safe hash function using the standard Web Crypto API
async function getSessionHash(timestamp: string): Promise<string> {
    const data = new TextEncoder().encode(timestamp + ":" + PASSWORD);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a signed session token incorporating the current timestamp.
 */
export async function createSessionToken(): Promise<string> {
    const timestamp = Date.now().toString();
    const hash = await getSessionHash(timestamp);
    return `${timestamp}.${hash}`;
}

/**
 * Verifies if the session token is valid and has not expired (24 hours).
 */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    
    const [timestampStr, hash] = parts;
    const timestamp = parseInt(timestampStr, 10);
    
    // Check if the token has expired (24 hours = 86400000 ms)
    if (isNaN(timestamp) || Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        return false;
    }
    
    // Recompute and verify the SHA-256 signature
    const computedHash = await getSessionHash(timestampStr);
    return computedHash === hash;
}
