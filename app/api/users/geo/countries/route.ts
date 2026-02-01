import { NextResponse } from "next/server";

export const revalidate = 60 * 60 * 24; 

export async function GET() {
  const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions", {
    next: { revalidate },
  });

  const json = await res.json();

  return NextResponse.json(json);
}
