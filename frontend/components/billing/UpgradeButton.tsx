'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createCheckoutSession, initiateEsewaPayment } from "@/services/billingService";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/authStore";
import { Modal } from "../ui/Modal";

export const UpgradeButton = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const openUpgradeModal = () => setIsModalOpen(true);

  const handleStripeSession = async () => {
    if (!user) {
      router.push("/login?redirect=/&triggerUpgrade=true");
      return;
    }

    setIsLoading(true);
    try {
      const res = await createCheckoutSession();
      if (res?.url) {
        window.location.href = res.url; 
      } else {
        console.error("Upgrade generation failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEsewaSession = async () => {
    if (!user) {
      router.push("/login?redirect=/&triggerUpgrade=true");
      return;
    }

    setIsLoading(true);
    try {
      const res = await initiateEsewaPayment();
      
      // Keep form POST logic for secure sandbox handshake
      if (res?.url && res?.formData) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = res.url;

        Object.entries(res.formData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        console.error("Failed to initiate eSewa payment payload");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={openUpgradeModal} variant="primary" label="Upgrade to Pro" />
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Choose Payment Method">
        <div className="p-1 text-center sm:text-left">
          <p className="text-xs text-secondary mb-6 -mt-2 leading-relaxed">
            Select your preferred billing gateway below to unlock premium form automation and webhooks pipelines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Premium Stripe Payment Card */}
            <div className="app-card group flex flex-col justify-between items-center text-center p-6 bg-surface border border-surface-border rounded-xl transition-all duration-200 hover:border-primary/40 hover:shadow-md">
              <div className="h-14 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Image 
                  src="/assets/stripe.png"  // FIXED: Pointing directly to public/assets/
                  alt="Stripe Secure Payments" 
                  width={110} 
                  height={35} 
                  priority
                  className="opacity-90 object-contain"
                />
              </div>
              <p className="text-[11px] text-secondary mb-4 leading-normal max-w-[160px]">
                Supports all major international credit/debit instruments smoothly.
              </p>
              <div className="w-full">
                <Button 
                  onClick={handleStripeSession} 
                  variant="primary" 
                  label={isLoading ? "Connecting..." : "Pay with Stripe"} 
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Premium eSewa Payment Card */}
            <div className="app-card group flex flex-col justify-between items-center text-center p-6 bg-surface border border-surface-border rounded-xl transition-all duration-200 hover:border-success/40 hover:shadow-md">
              <div className="h-14 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Image 
                  src="/assets/esewa.png"   // FIXED: Pointing directly to public/assets/
                  alt="eSewa Digital Wallet" 
                  width={110} 
                  height={35} 
                  priority
                  className="opacity-90 object-contain"
                />
              </div>
              <p className="text-[11px] text-secondary mb-4 leading-normal max-w-[160px]">
                Pay instantly via native eSewa digital wallet infrastructure securely.
              </p>
              <div className="w-full">
                <Button 
                  onClick={handleEsewaSession} 
                  variant="secondary" 
                  label={isLoading ? "Redirecting..." : "Pay with eSewa"} 
                  disabled={isLoading}
                />
              </div>
            </div>

          </div>
        </div>
      </Modal>
    </>
  );
};