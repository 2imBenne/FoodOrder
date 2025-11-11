import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCart } from "../contexts/CartContext";
import {
  fetchShippingZones,
  applyVoucher,
  createOrder,
} from "../services/orders";
import { CartSummary } from "../components/CartSummary";
import { useAuthContext } from "../contexts/AuthContext";

type CheckoutForm = {
  address: string;
  phone: string;
  note: string;
  voucherCode?: string;
  shippingZoneId?: string;
};

export const CheckoutPage = () => {
  const { user } = useAuthContext();
  const toast = useToast();
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    shippingFee,
    discount,
    total,
    note,
    setNote,
    shippingZone,
    setShippingZone,
    voucherCode,
    applyVoucher: setVoucher,
    clear,
  } = useCart();

  const { register, handleSubmit, setValue } = useForm<CheckoutForm>({
    defaultValues: {
      address: user?.address ?? "",
      phone: user?.phone ?? "",
      note,
      voucherCode,
      shippingZoneId: shippingZone?.id ? String(shippingZone.id) : undefined,
    },
  });

  const { data: zones } = useQuery({
    queryKey: ["shipping-zones"],
    queryFn: fetchShippingZones,
  });

  const voucherMutation = useMutation({
    mutationFn: applyVoucher,
    onSuccess: (data) => {
      setVoucher({ code: data.voucher.code, discount: data.discount });
      toast({ title: "Đã áp dụng mã giảm giá", status: "success" });
    },
    onError: () => toast({ title: "Mã không hợp lệ", status: "error" }),
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast({ title: "Đặt hàng thành công", status: "success" });
      clear();
      navigate(`/orders`);
    },
    onError: () => toast({ title: "không thể tạo đơn", status: "error" }),
  });

  const onSubmit = async (values: CheckoutForm) => {
    if (items.length === 0) {
      toast({ title: "Giỏ hàng đang trống", status: "warning" });
      return;
    }
    setNote(values.note);
    await orderMutation.mutateAsync({
      items: items.map((item) => ({
        dishId: item.dish.id,
        quantity: item.quantity,
      })),
      address: values.address,
      phone: values.phone,
      note: values.note,
      shippingZoneId: values.shippingZoneId
        ? Number(values.shippingZoneId)
        : undefined,
      voucherCode: voucherCode,
    });
  };

  const handleApplyVoucher = (values: CheckoutForm) => {
    if (!values.voucherCode) return;
    voucherMutation.mutate({
      code: values.voucherCode,
      subtotal,
    });
  };

  if (items.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        Vui lòng thêm món vào giỏ trước khi thanh toán.
      </Alert>
    );
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", lg: "2fr 1fr" }}
      gap={8}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={4} layerStyle="glass" borderRadius="3xl" p={6}>
        <FormControl isRequired>
          <FormLabel>Địa chỉ giao hàng</FormLabel>
          <Input {...register("address", { required: true })} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Số điện thoại</FormLabel>
          <Input {...register("phone", { required: true })} />
        </FormControl>
        <FormControl>
          <FormLabel>Khu vực giao</FormLabel>
          <Select
            placeholder="Chọn khu vực"
            {...register("shippingZoneId")}
            onChange={(event) => {
              const zone = zones?.find(
                (item) => String(item.id) === event.target.value
              );
              if (zone) {
                setShippingZone(zone);
              }
              setValue("shippingZoneId", event.target.value);
            }}
          >
            {zones?.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} (+{zone.fee} VND)
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Ghi chú</FormLabel>
          <Textarea rows={3} {...register("note")} />
        </FormControl>
        <FormControl>
          <FormLabel>Mã giảm giá</FormLabel>
          <Stack direction="row">
            <Input {...register("voucherCode")} />
            <Button
              onClick={handleSubmit(handleApplyVoucher)}
              isLoading={voucherMutation.isPending}
            >
              Áp dụng
            </Button>
          </Stack>
        </FormControl>
        <Button type="submit" isLoading={orderMutation.isPending}>
          Đặt hàng
        </Button>
      </Stack>
      <CartSummary
        subtotal={subtotal}
        shippingFee={shippingFee}
        discount={discount}
        total={total}
      />
    </Box>
  );
};
