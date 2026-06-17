'use client';
import { createCheckoutSession } from "@/services/billingService";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export const UpgradeButton = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleUpgrade = async () => {
    // If user is not logged in, pass intent instructions into the URL parameters
    if (!user) {
      router.push("/login?redirect=/&triggerUpgrade=true");
      return;
    }

    // User is logged in -> proceed with Stripe checkout generation
    const res = await createCheckoutSession();
    if (res.url) {
      window.location.href = res.url; 
    } else {
      console.error("Upgrade generation failed");
    }
  };

  return (
    <Button onClick={handleUpgrade} variant="primary" label="Upgrade to Pro" />
  );
};