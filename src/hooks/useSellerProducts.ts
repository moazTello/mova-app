import { CreateProductPayload, sellerService } from "@/services/seller";
import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductOptionInput } from '@/services/seller';

/** بعد أي تعديل على منتج: منحدّث قائمة التاجر وقوائم الزبون */
function useInvalidateProducts() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: KEY });
    qc.invalidateQueries({ queryKey: ['products'] });
    qc.invalidateQueries({ queryKey: ['product'] });
  };
}

export function useUpdateProduct(id: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (payload: Parameters<typeof sellerService.updateProduct>[1]) =>
      sellerService.updateProduct(id, payload),
    onSuccess: invalidate,
  });
}

export function useAddOption(productId: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (o: ProductOptionInput) => sellerService.addOption(productId, o),
    onSuccess: invalidate,
  });
}

export function useDeleteOption(productId: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (optionId: string) => sellerService.deleteOption(productId, optionId),
    onSuccess: invalidate,
  });
}

export function useAddImages(productId: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (uris: string[]) => sellerService.addImages(productId, uris),
    onSuccess: invalidate,
  });
}
const KEY = ["seller-products"];

export function useSellerProducts() {
  return useQuery({ queryKey: KEY, queryFn: sellerService.products });
}
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateProductPayload) => sellerService.createProduct(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
export function useToggleProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      sellerService.updateProduct(id, { is_active }),
    // تحديث متفائل: المفتاح بيتحرك فوراً
    onMutate: async ({ id, is_active }) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Product[]>(KEY);
      qc.setQueryData<Product[]>(KEY, (list) =>
        list?.map((p) => (p.id === id ? { ...p, is_active } : p)),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(KEY, ctx.prev),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["products"] }); // قائمة الزبون كمان
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sellerService.deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useAddVideos(productId: string) {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (uris: string[]) => sellerService.addVideos(productId, uris),
    onSuccess: invalidate,
  });
}