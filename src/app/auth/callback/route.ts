import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  // Redirect to dashboard after auth callback — the Supabase client
  // will automatically detect and consume the tokens from the URL hash
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
