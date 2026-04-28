import { initializeFirebase } from '@/firebase/index';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { TickerData } from '@/lib/types';

const { firestore: db } = initializeFirebase();

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function getCachedTickerData(symbol: string): Promise<TickerData | null> {
  try {
    const docRef = doc(db, 'tickers', symbol.toUpperCase());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as TickerData;
      const lastUpdated = new Date(data.updatedAt || 0).getTime();
      if (Date.now() - lastUpdated < CACHE_TTL_MS) {
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error('FS_ERR: Error reading from Firestore cache:', error);
    return null;
  }
}

export async function invalidateCache(symbol: string): Promise<void> {
  try {
    const docRef = doc(db, 'tickers', symbol.toUpperCase());
    await setDoc(docRef, { updatedAt: new Date(0).toISOString() }, { merge: true });
  } catch (error) {
    console.error('FS_ERR: Error invalidating Firestore cache:', error);
  }
}
