import { redirect } from 'next/navigation';

/** Catch-all: old embedded admin routes → separate admin app */
export default function AdminCatchAll() {
  redirect(process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001');
}
