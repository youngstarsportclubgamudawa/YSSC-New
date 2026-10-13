import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

// Standard Google Cloud / Firebase client configuration for AI Studio Workspace OAuth
const firebaseConfig = {
  projectId: "gen-lang-client-0525460540",
  appId: "1:296318105334:web:e7cac0edeed1ebc2675ed7",
  apiKey: "AIzaSyBlDvLO8GGwVw1O3jxPY3f2KySKUZES990",
  authDomain: "gen-lang-client-0525460540.firebaseapp.com",
  storageBucket: "gen-lang-client-0525460540.firebasestorage.app",
  messagingSenderId: "296318105334"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

let cachedAccessToken: string | null = null;
let currentSignInPromise: Promise<{ user: User; accessToken: string } | null> | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!currentSignInPromise) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (currentSignInPromise) {
    return currentSignInPromise;
  }

  currentSignInPromise = (async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('Failed to obtain Google access token');
      }
      cachedAccessToken = credential.accessToken;
      return { user: result.user, accessToken: cachedAccessToken };
    } catch (error: any) {
      const errorCode = error?.code || '';
      const errorMsg = error?.message || '';

      // Gracefully handle expected user actions and iframe popup suppression
      if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request' ||
        errorCode === 'auth/popup-blocked' ||
        errorMsg.includes('popup-closed-by-user') ||
        errorMsg.includes('Pending promise was never set') ||
        errorMsg.includes('cancelled-popup-request')
      ) {
        console.info('Google sign-in popup closed or dismissed by user.');
        return null;
      }

      console.warn('Google sign-in notice:', error);
      throw error;
    } finally {
      currentSignInPromise = null;
    }
  })();

  return currentSignInPromise;
};

export const isPopupBlockedError = (error: any): boolean => {
  const errorCode = error?.code || '';
  const errorMsg = error?.message || '';
  return (
    errorCode === 'auth/popup-closed-by-user' ||
    errorCode === 'auth/cancelled-popup-request' ||
    errorCode === 'auth/popup-blocked' ||
    errorMsg.includes('popup-closed-by-user') ||
    errorMsg.includes('Pending promise was never set') ||
    errorMsg.includes('cancelled-popup-request')
  );
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCustomAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const googleSignOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (e) {
    console.info('Sign-out completed locally');
  }
  cachedAccessToken = null;
  localStorage.removeItem('youngstar_custom_auth_user');
};

