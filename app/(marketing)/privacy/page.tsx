import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Clario",
  description: "Clario's Privacy Policy — how we collect, use, and protect your data.",
};

const EFFECTIVE_DATE = "April 14, 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-primary-600 mb-2">Legal</p>
        <h1 className="font-display text-4xl font-semibold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Effective date: {EFFECTIVE_DATE}</p>
      </div>

      <div className="prose prose-sm max-w-none text-foreground space-y-10">

        <Section title="1. Introduction">
          <p>
            Clario (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;) respects your privacy and is
            committed to protecting the personal information you share with us. This Privacy Policy
            explains what data we collect, how we use it, and your rights regarding that data.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information in the following ways:</p>
          <ul>
            <li>
              <strong>Account information:</strong> Email address and password when you create an
              account.
            </li>
            <li>
              <strong>Uploaded documents:</strong> Medical bills or related documents you upload
              for analysis. These may contain sensitive health and financial information.
            </li>
            <li>
              <strong>Usage data:</strong> Pages visited, features used, browser type, IP address,
              and timestamps — collected automatically via server logs and analytics.
            </li>
            <li>
              <strong>Communications:</strong> Any messages you send us through support channels.
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul>
            <li>To provide, operate, and improve the Service.</li>
            <li>To analyze uploaded documents and generate bill summaries and dispute templates.</li>
            <li>To authenticate your account and keep it secure.</li>
            <li>To communicate with you about your account or the Service.</li>
            <li>To comply with legal obligations.</li>
          </ul>
          <p>
            We do not sell your personal information or uploaded documents to third parties.
          </p>
        </Section>

        <Section title="4. AI Processing of Your Documents">
          <p>
            Documents you upload are processed using AI models to extract text and identify
            billing patterns. This processing may occur on third-party cloud infrastructure
            (such as AI API providers). Data sent to these providers is governed by their
            respective privacy and data processing agreements, which restrict use to service
            delivery only.
          </p>
          <p>
            We do not use your uploaded documents to train AI models without your explicit
            consent.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your account data and uploaded documents for as long as your account is
            active or as needed to provide the Service. You may request deletion of your data
            at any time by contacting us. Upon verified request, we will delete your personal
            data within 30 days, except where retention is required by law.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            We implement industry-standard security measures including encryption in transit
            (TLS), encrypted storage, and access controls. However, no system is completely
            secure. We cannot guarantee absolute security and encourage you to use strong
            passwords and keep your credentials confidential.
          </p>
        </Section>

        <Section title="7. Cookies and Tracking">
          <p>
            We use essential cookies to maintain your session and authenticate your account.
            We may use analytics tools that set cookies to understand aggregate usage patterns.
            You can configure your browser to refuse cookies, though some features may not
            function properly without them.
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            The Service is not directed to individuals under 18 years of age. We do not
            knowingly collect personal information from minors. If you believe a minor has
            provided us with personal information, please contact us so we can delete it.
          </p>
        </Section>

        <Section title="9. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data.</li>
            <li>Object to or restrict certain processing activities.</li>
            <li>Data portability — receive a copy of your data in a machine-readable format.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information on our
            website. We will respond within 30 days.
          </p>
        </Section>

        <Section title="10. Third-Party Links">
          <p>
            Our Service may contain links to third-party websites. We are not responsible for
            the privacy practices of those sites and encourage you to review their policies.
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this Privacy Policy periodically. Changes will be posted on this
            page with a revised effective date. Continued use of the Service after changes
            are posted constitutes your acceptance of the updated Policy.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy,
            please contact us via the contact information provided on our website.
          </p>
        </Section>

      </div>

      {/* Footer links */}
      <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
        <Link href="/" className="hover:text-foreground transition-colors">← Back to home</Link>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
