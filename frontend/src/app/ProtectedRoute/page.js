"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Protected = (WrappedComponent) => {
  const Authenticate = (props) => {
    const router = useRouter();

    // Simulated authentication check
    const isAuthenticated = () => {
      let token = false;
      if (typeof window !== "undefined" && localStorage.getItem("token")) {
        token = true;
      }
      return token;
    };
    useEffect(() => {
      // Redirect to login page if user is not authenticated
      if (!isAuthenticated()) {
        router.push("/");
      }
    }, [isAuthenticated, router]);

    // Render the wrapped component if authenticated, or null otherwise
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Authenticate;
};

export default Protected;
