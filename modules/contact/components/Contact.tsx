import Breakline from "@/common/components/elements/Breakline";
import DiscoveryForm from "./discovery/DiscoveryForm";
import ContactList from "./ContactList";
import ContactForm from "./ContactForm";

const Contact = () => {
  return (
    <div className="space-y-10">
      {/* Discovery / Project Inquiry Section */}
      <section aria-labelledby="discovery-form-heading">
        <div className="mb-5 space-y-1.5">
          <h2
            id="discovery-form-heading"
            className="text-xl font-semibold text-foreground"
          >
            🚀 Mulai Proyek Bersama
          </h2>
          <p className="text-sm text-muted-foreground">
            Isi formulir singkat ini dan saya akan menghubungi Anda dalam 1×24 jam.
          </p>
        </div>
        <DiscoveryForm />
      </section>

      <Breakline />

      {/* Social Media Links */}
      <ContactList />

      <Breakline className="my-2" />

      {/* Simple Email Form */}
      <section aria-labelledby="email-form-heading">
        <div className="mb-4 space-y-1">
          <h2
            id="email-form-heading"
            className="text-xl font-semibold text-foreground"
          >
            ✉️ Kirim Email Langsung
          </h2>
          <p className="text-sm text-muted-foreground">
            Atau kirim pesan singkat lewat email jika lebih nyaman.
          </p>
        </div>
        <ContactForm />
      </section>
    </div>
  );
};

export default Contact;

