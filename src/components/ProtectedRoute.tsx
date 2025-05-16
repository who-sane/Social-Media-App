import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const toastRef = useRef<HTMLDivElement>(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (!user && toastRef.current) {
            toastRef.current.style.opacity = "1";
            const timeout = setTimeout(() => {
                if (toastRef.current) toastRef.current.style.opacity = "0";
                setTimeout(() => setShouldRedirect(true), 300); // Wait for fade out
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [user]);

    if (!user) {
        if (shouldRedirect) {
            return <Navigate to="/" replace />;
        }
        return (
            <div
                ref={toastRef}
                style={{
                    opacity: 0,
                    transition: "opacity 0.5s",
                    position: "fixed",
                    top: 80,
                    right: 20,
                    zIndex: 1000,
                }}
                className="bg-amber-600 text-white px-4 py-2 rounded shadow-lg"
            >
                Please sign in to access this page.
            </div>
        );
    }
    return <>{children}</>;
}
