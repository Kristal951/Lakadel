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
import PhoneInput, {
  isValidPhoneNumber,
  formatPhoneNumberIntl,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { countries } from "@/lib";
import { CartItem, Product, ShippingAddress } from "@/store/types";
import { Images } from "lucide-react";
import { useToast } from "@/hooks/useToast";

// ... [Keep NIGERIA_STATES, Product, CartItem, CartLine, formatMoney, isValidEmail as they were] ...

type PaymentMethod = "PAYSTACK" | "STRIPE";

export default function GuestCheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const { products } = useProductStore();
  const { currency } = useUserStore();
  const {showToast} = useToast()

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
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(() =>
    currency === "NGN" ? "PAYSTACK" : "STRIPE",
  );

  const phoneOk = useMemo(() => {
    if (!phone) return false;
    return isValidPhoneNumber(phone);
  }, [phone]);

  useEffect(() => {
    setPaymentMethod(currency === "NGN" ? "PAYSTACK" : "STRIPE");
  }, [currency]);

  const recommendedMethod: PaymentMethod =
    currency === "NGN" ? "PAYSTACK" : "STRIPE";

  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: "",
    streetAddress: "",
    landMark: "",
    city: "",
    state: "Lagos",
    country: "Nigeria",
    postalCode: "",
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
      shipping.streetAddress.trim() &&
      shipping.city.trim() &&
      isValidEmail(email) &&
      phoneOk
    );
  }, [shipping, email, phoneOk]);

  const handlePay = async () => {
    setError("");
    if (!isFormValid) {
      setError("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);

    try {
      const orderRes = await fetch("/api/users/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          phone: phone ? formatPhoneNumberIntl(phone) : null,
          currency,
          shippingAddress: shipping,
          items: cartItems.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            selectedSize: i.selectedSize ?? null,
            selectedColor: i.selectedColor ?? null,
          })),
          subtotal,
          shippingFee,
          total: totalAmount,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok)
        throw new Error(orderData?.error || "Failed to create order");

      const orderId = orderData?.orderId as string | undefined;
      if (!orderId) throw new Error("Order creation failed (missing orderId)");

      if (paymentMethod === "PAYSTACK") {
        const initRes = await fetch("/api/users/paystack/initialise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const initData = await initRes.json();
        if (!initRes.ok)
          throw new Error(initData?.error || "Failed to initialize Paystack");

        const authorization_url = initData?.authorization_url as
          | string
          | undefined;
        if (!authorization_url)
          throw new Error("Paystack did not return an authorization URL");

        window.location.href = authorization_url;
        return;
      }
      const stripeItems = cartItems.map((i) => ({
        productId: i.product.id, 
        quantity: i.quantity,
        name: i.product.name, 
        image: i.product.images?.[0] || null,
      }));

      const initRes = await fetch("/api/users/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: stripeItems,
          currency,
          email: email.trim().toLowerCase(),
          guestId: localStorage.getItem("guestId"), 
        }),
      });
      const initData = await initRes.json();
      if (!initRes.ok)
        throw new Error(initData?.error || "Failed to initialize Stripe");

      const authorization_url = initData?.url as string | undefined;
      if (!authorization_url)
        throw new Error("Stripe did not return an authorization URL");

      window.location.href = authorization_url;
      return;
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
      showToast('Error Creating Order', 'error')
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 min-h-screen">
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
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
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
                      value={phone}
                      onChange={(v) => {
                        setPhone(v);
                        if (!phoneTouched) setPhoneTouched(true);
                      }}
                      onBlur={() => setPhoneTouched(true)}
                      defaultCountry="NG"
                      international
                      countryCallingCodeEditable={false}
                      className={[
                        "border-b py-3 text-sm transition-colors",
                        "bg-transparent outline-none",
                        phoneTouched && !phoneOk
                          ? "border-red-500"
                          : "border-foreground/20",
                        "focus-within:border-foreground",
                      ].join(" ")}
                      numberInputProps={{
                        className:
                          "bg-transparent outline-none placeholder:text-foreground/20 w-full",
                        placeholder: "e.g. 0801 234 5678",
                      }}
                    />

                    {phoneTouched && !phoneOk && (
                      <span className="text-xs text-red-600">
                        Please enter a valid phone number.
                      </span>
                    )}

                    {phoneOk && phone && (
                      <span className="text-xs text-foreground/40">
                        {formatPhoneNumberIntl(phone)}
                      </span>
                    )}
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
                    onChange={(v: any) =>
                      setShipping({ ...shipping, fullName: v })
                    }
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
                        {countries.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <ModernInput
                      label="City"
                      value={shipping.city}
                      onChange={(v: any) =>
                        setShipping({ ...shipping, city: v })
                      }
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
                      value={shipping.streetAddress}
                      onChange={(v: any) =>
                        setShipping({ ...shipping, streetAddress: v })
                      }
                    />
                  </div>

                  <ModernInput
                    label="Landmark (Optional)"
                    value={shipping.landMark}
                    onChange={(v: any) =>
                      setShipping({ ...shipping, landMark: v })
                    }
                  />
                </div>
              </section>

              {/* SECTION 03 */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-bold w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wide text-foreground">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* PAYSTACK ROW */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("PAYSTACK")}
                    className={[
                      "w-full flex items-start justify-between gap-4 rounded-2xl border p-5 transition-all text-left",
                      paymentMethod === "PAYSTACK"
                        ? "border-foreground"
                        : "border-foreground/10 hover:border-foreground/30",
                    ].join(" ")}
                  >
                    <div className="flex gap-4">
                      <div
                        className={[
                          "mt-1 w-4 h-4 rounded-full border flex items-center justify-center",
                          paymentMethod === "PAYSTACK"
                            ? "border-foreground"
                            : "border-foreground/30",
                        ].join(" ")}
                      >
                        {paymentMethod === "PAYSTACK" && (
                          <div className="w-2 h-2 rounded-full bg-foreground" />
                        )}
                      </div>

                      <div className="flex gap-4 flex-col">
                        <Image
                          src="/assets/paystack.png"
                          alt="Paystack Logo"
                          width={100}
                          height={20}
                          className="w-24 h-5 object-contain"
                        />
                        <p className="text-sm text-foreground/60 mt-1">
                          Best for NGN • Local cards • Bank transfer/USSD
                        </p>

                        {/* <ul className="mt-3 text-xs text-foreground/60 space-y-1">
                          <li>✅ Very smooth for Nigerian customers</li>
                          <li>✅ Often fewer failed local payments</li>
                          <li>⚠️ Limited multi-currency support</li>
                        </ul> */}
                      </div>
                    </div>

                    {recommendedMethod === "PAYSTACK" && (
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-foreground text-background h-fit">
                        Recommended
                      </span>
                    )}
                  </button>

                  {/* STRIPE ROW */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("STRIPE")}
                    className={[
                      "w-full flex items-start justify-between gap-4 rounded-2xl border p-5 transition-all text-left",
                      paymentMethod === "STRIPE"
                        ? "border-foreground"
                        : "border-foreground/10 hover:border-foreground/30",
                    ].join(" ")}
                  >
                    <div className="flex gap-4">
                      <div
                        className={[
                          "mt-1 w-4 h-4 rounded-full border flex items-center justify-center",
                          paymentMethod === "STRIPE"
                            ? "border-foreground"
                            : "border-foreground/30",
                        ].join(" ")}
                      >
                        {paymentMethod === "STRIPE" && (
                          <div className="w-2 h-2 rounded-full bg-foreground" />
                        )}
                      </div>

                      <div className="flex flex-col gap-4">
                        <Image
                          src="/assets/stripe.png"
                          alt="Stripe Logo"
                          width={100}
                          height={40}
                          className="w-24 h-5 object-contain"
                        />
                        <p className="text-xs text-foreground/60 mt-1">
                          Best for USD/EUR/GBP • Global cards • True
                          multi-currency
                        </p>

                        {/* <ul className="mt-3 text-xs text-foreground/60 space-y-1">
                          <li>✅ Strong international card acceptance</li>
                          <li>
                            ✅ Great multi-currency + receipts/disputes tools
                          </li>
                          <li>
                            ⚠️ For NGN-only customers, Paystack may feel simpler
                          </li>
                        </ul> */}
                      </div>
                    </div>

                    {recommendedMethod === "STRIPE" && (
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-foreground text-background h-fit">
                        Recommended
                      </span>
                    )}
                  </button>
                </div>
              </section>

              <button
                onClick={handlePay}
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
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">
                      {item.product.name}
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
                Secure payment via{" "}
                {paymentMethod === "PAYSTACK" ? "Paystack" : "Stripe"}. Your
                data is encrypted and not stored.
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
