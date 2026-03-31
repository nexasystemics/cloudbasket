// © 2026 NEXQON HOLDINGS — CloudBasket biometric.ts
// F27: Biometric Auth using WebAuthn
export type BiometricResult = { success: boolean; credentialId?: string; error?: string }

export async function isBiometricAvailable(): Promise<boolean> {
  try { return !!(window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) }
  catch { return false }
}

export async function registerBiometric(userId: string, userName: string): Promise<BiometricResult> {
  try {
    const challenge = new Uint8Array(32); crypto.getRandomValues(challenge)
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge, rp: { name: 'CloudBasket', id: window.location.hostname },
        user: { id: new TextEncoder().encode(userId), name: userName, displayName: userName },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }, { alg: -257, type: 'public-key' }],
        authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
        timeout: 60000
      }
    }) as PublicKeyCredential
    const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
    localStorage.setItem(`cb_biometric_${userId}`, credentialId)
    return { success: true, credentialId }
  } catch (e) { return { success: false, error: String(e) } }
}

export async function verifyBiometric(userId: string): Promise<BiometricResult> {
  try {
    const storedId = localStorage.getItem(`cb_biometric_${userId}`)
    if (!storedId) return { success: false, error: 'No biometric registered' }
    const challenge = new Uint8Array(32); crypto.getRandomValues(challenge)
    await navigator.credentials.get({ publicKey: { challenge, timeout: 60000, userVerification: 'required' } })
    return { success: true }
  } catch (e) { return { success: false, error: String(e) } }
}
