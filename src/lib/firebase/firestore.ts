import { db } from './config';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc
} from 'firebase/firestore';

export interface Favorite {
  id: string;
  type: 'match' | 'league';
  name: string;
}

export const toggleFavorite = async (userId: string, item: Favorite) => {
  if (!db) {
    console.error("Firestore is not initialized.");
    return;
  }

  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, { favorites: [item] });
    return;
  }

  const favorites = userDoc.data().favorites || [];
  const exists = favorites.some((f: Favorite) => f.id === item.id);

  if (exists) {
    await updateDoc(userRef, {
      favorites: arrayRemove(item)
    });
  } else {
    await updateDoc(userRef, {
      favorites: arrayUnion(item)
    });
  }
};

export const getFavorites = async (userId: string): Promise<Favorite[]> => {
  if (!db) {
    console.error("Firestore is not initialized.");
    return [];
  }

  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data().favorites || [];
  }
  return [];
};
