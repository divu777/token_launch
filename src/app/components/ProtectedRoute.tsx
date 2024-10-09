// app/components/ProtectedRoute.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Adjust the key according to your implementation

    if (!token) {
      router.push("/"); // Redirect to login page if not authenticated
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
