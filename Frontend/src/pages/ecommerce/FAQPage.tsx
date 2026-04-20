import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ecommerce/ecommerce-ui/accordion";
import { useLanguage } from "../../contexts/LanguageContext";

const FAQPage = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      category: t("faq.ordersShipping"),
      questions: [
        { q: t("faq.q1"), a: t("faq.a1") },
        { q: t("faq.q2"), a: t("faq.a2") },
        { q: t("faq.q3"), a: t("faq.a3") },
        { q: t("faq.q4"), a: t("faq.a4") },
      ],
    },
    {
      category: t("faq.returnsRefunds"),
      questions: [
        { q: t("faq.q5"), a: t("faq.a5") },
        { q: t("faq.q6"), a: t("faq.a6") },
        { q: t("faq.q7"), a: t("faq.a7") },
      ],
    },
    {
      category: t("faq.paymentSecurity"),
      questions: [
        { q: t("faq.q8"), a: t("faq.a8") },
        { q: t("faq.q9"), a: t("faq.a9") },
        { q: t("faq.q10"), a: t("faq.a10") },
      ],
    },
    {
      category: t("faq.accountWarranty"),
      questions: [
        { q: t("faq.q11"), a: t("faq.a11") },
        { q: t("faq.q12"), a: t("faq.a12") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="container relative text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t("faq.helpCenter")}</p>
              <h1 className="text-4xl font-bold md:text-5xl">{t("faq.title1")}<span className="gold-text">{t("faq.title2")}</span></h1>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{t("faq.desc")}</p>
            </motion.div>
          </div>
        </section>

        <section className="container max-w-3xl pb-8 space-y-10">
          {faqs.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="h-1 w-6 rounded-full gold-gradient inline-block" />
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="rounded-xl border border-border bg-card overflow-hidden">
                {section.questions.map((item, j) => (
                  <AccordionItem key={j} value={`${i}-${j}`} className="border-border/50">
                    <AccordionTrigger className="px-5 py-4 text-sm font-medium text-foreground hover:text-primary hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
