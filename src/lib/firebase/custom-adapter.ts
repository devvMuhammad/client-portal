import { FirestoreAdapter } from "@auth/firebase-adapter";
import { Adapter } from "@auth/core/adapters";

export function CustomFirestoreAdapter(config: any) {
  const adapter = FirestoreAdapter(config);
  return {
    ...adapter,
    createUser: (user: any) => {
      // Add your custom field here
      const customUser = {
        ...user,
        status: user.email === "muhammadaljoufi@gmail.com" ? "seller" : "buyer", // Default to "customer" if not set
        createdAt: new Date().toLocaleDateString(),
      };
      if (!adapter.createUser) return;

      return adapter.createUser(customUser);
    },
    // You might need to modify other methods as well, depending on your needs
  } as Adapter;
}
