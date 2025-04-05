import { getAuth } from "@/lib/auth";
import { db } from "@/lib/firebase/init";
import { collection, getDocs, query } from "firebase/firestore";
import { cache } from "react";

async function getUsers() {
  const session = await getAuth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const users = await getDocs(query(collection(db, "users")));

  return users.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as any;
}

export default cache(getUsers);
