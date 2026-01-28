import { formatPrice } from "@/lib";

export default function PriceContainer({
  price,
  currency,
  textSize = "base",
  textColor = "foreground/80",
}: {
  price: number;
  currency: string;
  textSize?: string;
  textColor?: string;
}) {
  return (
    <div className={`text-${textSize} gap-2 text-${textColor} flex items-center `}>
      <p>
        {currency !== "NGN" && (
          <span className="text-base text-foreground/80">≈</span>
        )}
      </p>
      <p>{formatPrice(price, currency)}</p>
    </div>
  );
}
