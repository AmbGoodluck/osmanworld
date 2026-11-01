import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Osman Amadu Jalloh | Digital Card",
  description:
    "Digital contact card for Osman Amadu Jalloh, Computer Science junior at Berea College, Class of 2028.",
};

const links = [
  { label: "Call", href: "tel:+18597561485" },
  { label: "Email", href: "mailto:jallohosmanamadu311@gmail.com" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/osman-jalloh-257293151",
  },
  { label: "GitHub", href: "https://github.com/AmbGoodluck" },
  { label: "Portfolio", href: "https://osmanamadujalloh.com" },
];

export default function DigitalCardPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://osmanamadujalloh.com/images/osman-profile.webp"
          alt="Osman Amadu Jalloh"
          width={112}
          height={112}
          className="mx-auto h-28 w-28 rounded-full border border-white/20 object-cover"
        />
        <h1 className="mt-5 text-center text-3xl">Osman Amadu Jalloh</h1>
        <p className="mt-2 text-center text-white/80">
          Computer Science Junior at Berea College, Class of 2028
        </p>
        <p className="mt-1 text-center text-sm text-white/60">
          Aspiring Software Engineer. Seeking a Summer 2027 software
          engineering internship.
        </p>
        <p className="mt-1 text-center text-sm text-white/60">
          Berea, Kentucky
        </p>

        <a
          href="/osman-jalloh.vcf"
          className="mt-6 block rounded-lg bg-[#ededed] py-3.5 text-center font-semibold text-[#101624]"
        >
          Save Contact
        </a>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg border border-white/15 py-3 text-center text-sm text-white transition hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="rounded-xl bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/qr-digitalcard.svg"
              alt="QR code that opens this digital card"
              width={260}
              height={260}
            />
          </div>
          <p className="mt-3 text-sm text-white/60">Scan to open this card</p>
        </div>

        <p className="mt-8 text-center text-sm text-white/60">
          React Native, TypeScript, Python, React, Next.js, SQL, Java
        </p>

        <div className="mt-8 space-y-5 border-t border-white/10 pt-6 text-left">
          <div>
            <h2 className="text-lg">Fynd</h2>
            <p className="mt-1 text-sm leading-6 text-white/70">
              A campus discovery app I built as the only engineer, with
              authorization pushed down to the database using row-level
              security and an edge cache in front of the places API. Currently
              under review by Apple.
            </p>
          </div>
          <div>
            <h2 className="text-lg">Regain AI</h2>
            <p className="mt-1 text-sm leading-6 text-white/70">
              A Python platform that converts client leads from website visits
              into structured CRM records, using a RAG system and external
              APIs.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
