"use client";

import { useState } from "react";

type Labels = {
  name: string;
  org: string;
  email: string;
  phone: string;
  message: string;
  send: string;
  sent: string;
  note: string;
};

export default function ContactForm({ labels }: { labels: Labels }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="cform">
      <div className="form-row">
        <input type="text" placeholder={labels.name} />
        <input type="text" placeholder={labels.org} />
      </div>
      <div className="form-row">
        <input type="email" placeholder={labels.email} />
        <input type="tel" placeholder={labels.phone} />
      </div>
      <textarea placeholder={labels.message}></textarea>
      <button
        type="button"
        className="btn flame"
        style={{ width: "100%", justifyContent: "center" }}
        onClick={() => setSent(true)}
      >
        {sent ? labels.sent : labels.send}
      </button>
      <p style={{ marginTop: 14, fontSize: 12, color: "rgba(246,241,231,.5)" }}>{labels.note}</p>
    </div>
  );
}
