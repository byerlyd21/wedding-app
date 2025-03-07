"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  // Redirect to /rsvp when the component mounts
  useEffect(() => {
    router.push('/rsvp');
  }, [router]);

  return null; // Nothing renders because we are redirecting immediately
}
