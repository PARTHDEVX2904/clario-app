import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Clario",
  description: "Terms of Use for Clario — read before using our medical bill analysis service.",
};

const EFFECTIVE_DATE = "April 14, 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-primary-600 mb-2">Legal</p>
        <h1 className="font-display text-4xl font-semibold text-foreground mb-4">Terms of Use</h1>
        <p className="text-sm text-muted-foreground">Effective date: {EFFECTIVE_DATE}</p>
      </div>

      <div className="prose prose-sm max-w-none text-foreground space-y-10">

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using Clario ("the Service," "we," "our"), you agree to be bound by
            these Terms of Use and our{" "}
            <Link href="/privacy" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
              Privacy Policy
            </Link>
            . If you do not agree to these terms, please do not use the Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            Clario is an AI-assisted platform that helps patients review and understand medical
            bills, identify potentially questionable charges, and generate template dispute or
            negotiation letters. All analysis is generated automatically and is intended for
            informational purposes only.
          </p>
        </Section>

        <Section title="3. Not Legal or Medical Advice">
          <p>
            <strong>Clario does not provide legal advice, medical advice, or financial advice.</strong>{" "}
            Nothing on this platform constitutes a professional relationship between you and Clario
            or any licensed attorney, physician, or financial adviser. The information provided is
            informational support only.
          </p>
          <p>
            You should consult a qualified patient advocate, billing specialist, healthcare
            attorney, or licensed professional before taking action on any analysis or generated
            document produced by the Service.
          </p>
        </Section>

        <Section title="4. Eligibility">
          <p>
            You must be at least 18 years old and legally capable of entering into a binding
            contract to use this Service. By using the Service, you represent and warrant that
            you meet these requirements.
          </p>
        </Section>

        <Section title="5. User Responsibilities">
          <ul>
            <li>You are responsible for the accuracy of any documents or information you upload.</li>
            <li>You must not upload documents belonging to another person without their explicit consent.</li>
            <li>You must not use the Service for any unlawful purpose.</li>
            <li>You must not attempt to reverse-engineer, scrape, or exploit any part of the Service.</li>
            <li>You are solely responsible for any actions taken based on the Service&apos;s output.</li>
          </ul>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All content, branding, software, and features of the Service are the property of
            Clario and its licensors. You are granted a limited, non-exclusive, non-transferable
            license to use the Service for personal, non-commercial purposes.
          </p>
          <p>
            Documents you upload remain your property. By uploading, you grant Clario a limited
            license to process your documents solely to provide the Service.
          </p>
        </Section>

        <Section title="7. Disclaimers and Limitation of Liability">
          <p>
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
            Clario makes no warranties, express or implied, regarding accuracy, reliability, or
            fitness for a particular purpose.
          </p>
          <p>
            To the fullest extent permitted by law, Clario shall not be liable for any indirect,
            incidental, special, or consequential damages arising from your use of the Service,
            including reliance on any analysis or generated document.
          </p>
        </Section>

        <Section title="8. Third-Party Services">
          <p>
            The Service may use third-party AI and cloud infrastructure providers to process your
            data. Clario is not responsible for the practices or content of these third-party
            services. Use of the Service constitutes your acknowledgment of this.
          </p>
        </Section>

        <Section title="9. Modifications to Terms">
          <p>
            We reserve the right to update these Terms at any time. Changes will be posted on
            this page with a revised effective date. Continued use of the Service after changes
            are posted constitutes your acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            We reserve the right to suspend or terminate your access to the Service at any time,
            with or without cause, and without prior notice.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms are governed by the laws of the applicable jurisdiction, without regard
            to conflict of law principles. Any disputes shall be resolved through binding
            arbitration or in a court of competent jurisdiction.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            If you have questions about these Terms, please reach out via the contact information
            provided on our website.
          </p>
        </Section>

      </div>

      {/* Footer links */}
      <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
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
