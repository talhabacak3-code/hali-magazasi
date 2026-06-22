"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="font-serif text-2xl text-ink">Kampanyalardan ilk siz haberdar olun</h2>
        <p className="mt-2 text-ink/60 text-sm">
          Yeni koleksiyonlar ve indirimler için e-posta listemize katılın.
        </p>
        {done ? (
          <p className="mt-6 text-brand font-medium">Teşekkürler! Kaydınız alındı. 🎉</p>
        ) : (
          <form
            className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              className="flex-1 rounded-lg border border-black/10 px-4 py-3 bg-white outline-none focus:border-brand"
            />
            <button
              type="submit"
              className="bg-brand text-white rounded-lg px-5 py-3 font-medium hover:bg-brand-dark transition-colors"
            >
              Abone Ol
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
