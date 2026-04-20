import { useState } from "react";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { Textarea } from "../../components/ecommerce/ecommerce-ui/textarea";
import { Label } from "../../components/ecommerce/ecommerce-ui/label";
import { Card, CardContent } from "../../components/ecommerce/ecommerce-ui/card";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight, MessageSquare } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    { icon: MapPin, title: "Our Location", value: "Addis Ababa, Ethiopia", desc: "Come visit our flagship store." },
    { icon: Phone, title: "Phone Number", value: "+251 942497990", desc: "We are available Mon-Fri, 9am-6pm." },
    { icon: Mail, title: "Email Address", value: "yanoltech@gmail.com", desc: "We'll reply within 24 hours." },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Message Sent Successfully", description: "We'll get back to you as soon as possible." });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-900">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=2000&q=80"
              alt="Contact Support"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          </div>

          <div className="container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-6 border border-white/20 backdrop-blur-md">
                <MessageSquare className="w-4 h-4 text-primary" />
                24/7 Support Available
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                Get in <span className="text-primary">Touch</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Have a question about a product, order, or just want to say hi? We'd love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-16 -mt-16 relative z-20 container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="h-full border-0 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300 bg-white rounded-3xl overflow-hidden group">
                  <CardContent className="p-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/10">
                      <info.icon className="w-8 h-8 text-gray-900 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                    <p className="text-primary font-semibold text-lg mb-3">{info.value}</p>
                    <p className="text-gray-500 text-sm">{info.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Form and Map Section */}
        <section className="py-16 container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                <p className="text-gray-500">
                  Fill out the form below and our team will get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                    <Input id="firstName" placeholder="" required className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                    <Input id="lastName" placeholder="" required className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <Input id="email" type="email" required className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 font-medium">Subject</Label>
                  <Input id="subject" required className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20 rounded-xl" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                    <Textarea id="message" rows={6} required className="bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20 rounded-xl resize-none" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-gray-900/20 group"
                >
                  {loading ? (
                    "Sending Message..."
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Map & Office Hours */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-full flex flex-col"
            >
              <div className="bg-gray-50 rounded-3xl p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Business Hours
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative flex-1 rounded-3xl overflow-hidden bg-gray-200 min-h-[300px] border border-gray-100 shadow-inner group">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.0202897456!2d38.61332804027581!3d8.963479541607593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24e49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1716301234567!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                  className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
