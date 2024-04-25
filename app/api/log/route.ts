import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response  = await fetch("https://realmtest.sfo3.digitaloceanspaces.com/uic-statt0/log/log.example.txt",{next: { revalidate: 0 }, cache: "no-store"});
  const result = await response.text();

  return NextResponse.json({stamp: new Date(), status: result}, { status: 200 });
  }