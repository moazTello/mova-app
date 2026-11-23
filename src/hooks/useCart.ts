import { cartService } from "@/services/cart";
import { useAuthStore } from "@/store/authStore";
import { Cart } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CART_KEY = ["cart"];

export function useCart() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: CART_KEY,
    queryFn: cartService.get,
    enabled: user?.role === "customer",
  });
}

/** بعد أي تعديل: إذا السيرفر رجّع السلة منحطها مباشرة، وإلا منعيد جلبها */
function useCartMutation<V>(fn: (vars: V) => Promise<Cart | void>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (cart) => {
      if (cart?.id) qc.setQueryData(CART_KEY, cart);
      else qc.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export const useAddToCart = () =>
  useCartMutation(
    ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.add(productId, quantity),
  );

export const useUpdateCartItem = () =>
  useCartMutation(
    ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.update(itemId, quantity),
  );

export const useRemoveCartItem = () =>
  useCartMutation((itemId: string) => cartService.remove(itemId));

export const useClearCart = () => useCartMutation(() => cartService.clear());
