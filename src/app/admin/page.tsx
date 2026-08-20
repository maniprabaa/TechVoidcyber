import { redirect } from 'next/navigation';

/** Admin lives on a separate app (port 3001). */
export default function AdminMovedPage() {
  redirect(process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001');
}
