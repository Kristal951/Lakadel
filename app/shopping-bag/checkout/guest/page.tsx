"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import useProductStore from "@/store/productStore";
import useUserStore from "@/store/userStore";
import {
  IoArrowBackOutline,
  IoLockClosedOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

// ... [Keep NIGERIA_STATES, Product, CartItem, CartLine, formatMoney, isValidEmail as they were] ...

const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  // Add more countries as needed
] as const;

type ShippingInfo = {
  fullName: string;
  address1: string;
  landmark: string;
  city: string;
  state: string; // Now string to allow flexibility
  country: (typeof COUNTRIES)[number];
};

export default function GuestCheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const { products } = useProductStore();
  const { currency } = useUserStore();

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products as Product[]) map.set(p.id, p);
    return map;
  }, [products]);

  const cartItems: CartLine[] = useMemo(() => {
    return (items as CartItem[])
      .map((cartItem) => {
        const product = productMap.get(cartItem.id);
        return product ? ({ ...cartItem, product } as CartLine) : null;
      })
      .filter((x): x is CartLine => x !== null);
  }, [items, productMap]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
    [cartItems],
  );
  const shippingFee = useMemo(() => (subtotal > 50_000 ? 0 : 2500), [subtotal]);
  const totalAmount = useMemo(
    () => subtotal + shippingFee,
    [subtotal, shippingFee],
  );

  useEffect(() => {
    if (cartItems.length === 0) router.push("/shop");
  }, [cartItems.length, router]);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined); // Fixed type
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: "",
    address1: "",
    landmark: "",
    city: "",
    state: "Lagos",
    country: "Nigeria",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const NIGERIA_STATES = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ] as const;

  type Product = {
    id: string;
    label: string;
    price: number;
    SRC: string;
  };

  type CartItem = {
    id: string;
    quantity: number;
    selectedSize?: string;
  };

  type CartLine = CartItem & { product: Product };

  function formatMoney(amount: number, currency: string) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: currency === "NGN" ? 0 : 2,
      }).format(amount);
    } catch {
      return `${amount.toLocaleString()} ${currency}`;
    }
  }

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  const isFormValid = useMemo(() => {
    return (
      shipping.fullName.trim() &&
      shipping.address1.trim() &&
      shipping.city.trim() &&
      isValidEmail(email) &&
      phone?.length >= 8
    );
  }, [shipping, email, phone]);

  const handleGuestPay = async () => {
    setError("");
    if (!isFormValid)
      return setError("Please fill in all required fields correctly.");
    setLoading(true);
    try {
      // Logic for Paystack...
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 min-h-screen">
        {/* LEFT SIDE: FORM (7 Columns) */}
        <div className="lg:col-span-7 px-6 py-12 lg:px-16 lg:py-20 overflow-y-auto">
          <div className="max-w-lg">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground/50 hover:text-foreground transition-colors mb-12"
            >
              <IoArrowBackOutline className="text-base" />
              Back to Cart
            </button>

            <header className="mb-12">
              <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-3">
                Checkout
              </h1>
              <p className="text-foreground/60 text-sm">
                Enter your details to complete your order.
              </p>
            </header>

            {error && (
              <div className="mb-8 p-4 bg-red-50/50 border border-red-100 text-red-600 text-sm flex items-center gap-3 rounded-lg">
                <IoInformationCircleOutline className="text-lg" /> {error}
              </div>
            )}

            <div className="space-y-16">
              {/* SECTION 01 */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-bold w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wide text-foreground">
                    Contact Information
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <ModernInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="hello@domain.com"
                  />
                  <div className="group flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-foreground/50 group-focus-within:text-foreground transition-colors">
                      Phone Number
                    </label>
                    <PhoneInput
                      placeholder="Your Phone Number"
                      value={phone}
                      onChange={setPhone}
                      defaultCountry="NG" 
                      international
                      countryCallingCodeEditable
                      className="bg-transparent border-b border-foreground/20 py-3 text-sm focus-within:border-foreground outline-none transition-colors"
                      inputComponent={({ value, onChange, ...props }: any) => (
                        <input
                          {...props}
                          value={value}
                          onChange={onChange}
                          className="bg-transparent outline-none placeholder:text-foreground/20"
                        />
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 02 */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-bold w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wide text-foreground">
                    Shipping Address
                  </h2>
                </div>
                <div className="space-y-6">
                  <ModernInput
                    label="Full Name"
                    value={shipping.fullName}
                    onChange={(v: any) => setShipping({ ...shipping, fullName: v })}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                        Country
                      </label>
                      <select
                        value={shipping.country}
                        onChange={(e) =>
                          setShipping({
                            ...shipping,
                            country: e.target.value as any,
                            state: e.target.value === "Nigeria" ? "Lagos" : "",
                          })
                        }
                        className="bg-transparent border-b border-foreground/20 py-3 text-sm focus:border-foreground outline-none transition-colors"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <ModernInput
                      label="City"
                      value={shipping.city}
                      onChange={(v: any) => setShipping({ ...shipping, city: v })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                        State
                      </label>
                      <select
                        value={shipping.state}
                        onChange={(e) =>
                          setShipping({ ...shipping, state: e.target.value })
                        }
                        className="bg-transparent border-b border-foreground/20 py-3 text-sm focus:border-foreground outline-none transition-colors"
                        disabled={shipping.country !== "Nigeria"}
                      >
                        {shipping.country === "Nigeria" ? (
                          NIGERIA_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))
                        ) : (
                          <option value="">Select State</option>
                        )}
                      </select>
                    </div>
                    <ModernInput
                      label="Street Address"
                      value={shipping.address1}
                      onChange={(v: any) =>
                        setShipping({ ...shipping, address1: v })
                      }
                    />
                  </div>

                  <ModernInput
                    label="Landmark (Optional)"
                    value={shipping.landmark}
                    onChange={(v: any) => setShipping({ ...shipping, landmark: v })}
                  />
                </div>
              </section>

              <button
                onClick={handleGuestPay}
                disabled={loading || !isFormValid}
                className="w-full py-4 bg-foreground text-background rounded-lg font-semibold text-sm hover:bg-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin mx-auto" />
                ) : (
                  `Complete Purchase — ${formatMoney(totalAmount, currency)}`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: SUMMARY (5 Columns) */}
        <div className="lg:col-span-5 bg-foreground/2 border-l border-foreground/3 px-6 py-12 lg:px-16 lg:py-20">
          <div className="sticky top-16 max-w-sm mx-auto lg:mx-0">
            <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-8">
              Your Order
            </h3>

            <div className="space-y-6 mb-12 max-h-[50vh] overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-4 items-center"
                >
                  <div className="relative w-16 h-20 bg-foreground/3 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.product.SRC}
                      alt={item.product.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">
                      {item.product.label}
                    </h4>
                    <p className="text-xs text-foreground/50 mt-1">
                      {item.selectedSize && `Size ${item.selectedSize} • `}Qty{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatMoney(item.product.price * item.quantity, currency)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 py-6 border-y border-foreground/5">
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0
                    ? "Free"
                    : formatMoney(shippingFee, currency)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-8">
              <span className="text-xs font-bold uppercase tracking-wide">
                Total
              </span>
              <span className="text-3xl font-light">
                {formatMoney(totalAmount, currency)}
              </span>
            </div>

            <div className="mt-12 flex items-start gap-3 text-foreground/50">
              <IoLockClosedOutline className="text-lg shrink-0" />
              <p className="text-xs leading-relaxed">
                Secure payment via Paystack. Your data is encrypted and not
                stored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModernInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helperText,
}: any) {
  return (
    <div className="group flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-foreground/50 group-focus-within:text-foreground transition-colors">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-b border-foreground/20 py-3 text-sm focus:border-foreground outline-none transition-colors placeholder:text-foreground/20"
      />
      {helperText && (
        <span className="text-xs text-foreground/40 mt-1">{helperText}</span>
      )}
    </div>
  );
}