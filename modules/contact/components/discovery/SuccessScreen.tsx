"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, RotateCcw } from "lucide-react";

interface SuccessScreenProps {
  name?: string;
  onReset: () => void;
}

const SuccessScreen = ({ name, onReset }: SuccessScreenProps) => {
  return (
    <motion.div
      id="discovery-form-success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center gap-6 py-8 text-center"
    >
      {/* Animated checkmark */}
      <div className="relative">
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
        >
          <CheckCircle2 className="h-10 w-10 text-primary" strokeWidth={1.5} />
        </motion.div>

        {/* Ripple effects */}
        {[0.3, 0.5, 0.7].map((delay, i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
            transition={{ duration: 1.5, delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="space-y-2"
      >
        <h3 className="text-2xl font-bold text-foreground">
          {name ? `Terima kasih, ${name}! 🎉` : "Pesan terkirim! 🎉"}
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground leading-relaxed">
          Formulir Anda sudah saya terima. Saya akan segera menghubungi Anda dalam{" "}
          <span className="font-semibold text-foreground">1×24 jam</span> untuk mendiskusikan lebih lanjut.
        </p>
      </motion.div>

      {/* WhatsApp note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-muted-foreground"
      >
        <MessageCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
        <span>Notifikasi sudah dikirim via WhatsApp</span>
      </motion.div>

      {/* Reset button */}
      <motion.button
        id="discovery-form-reset-btn"
        type="button"
        onClick={onReset}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Kirim permintaan lain
      </motion.button>
    </motion.div>
  );
};

export default SuccessScreen;
