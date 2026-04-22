
'use client';

import { useMemo, useRef } from 'react';
import { 
  DocumentReference, 
  Query, 
  queryEqual, 
  refEqual 
} from 'firebase/firestore';

/**
 * Custom hook to memoize a Firestore Query or DocumentReference.
 * This prevents unnecessary re-subscriptions and re-renders by ensuring
 * the reference only changes if the underlying query structure or path changes.
 */
export function useMemoFirebase<T extends Query<any> | DocumentReference<any> | null>(
  factory: () => T,
  dependencies: any[]
): T {
  const ref = factory();
  const previousRef = useRef<T>(null);

  return useMemo(() => {
    const isReference = (r: any): r is DocumentReference<any> => r && 'path' in r && !('where' in r);
    const isQuery = (r: any): r is Query<any> => r && 'where' in r;

    let isEqual = false;

    if (!ref || !previousRef.current) {
      isEqual = ref === previousRef.current;
    } else if (isReference(ref) && isReference(previousRef.current)) {
      isEqual = refEqual(ref, previousRef.current);
    } else if (isQuery(ref) && isQuery(previousRef.current)) {
      isEqual = queryEqual(ref, previousRef.current);
    }

    if (!isEqual) {
      previousRef.current = ref;
    }

    return previousRef.current as T;
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
}
