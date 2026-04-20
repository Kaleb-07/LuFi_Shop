import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "en" | "am" | "om";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    "nav.store": "Store",
    "nav.categories": "Categories",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.faq": "FAQ",
    "nav.trackOrder": "Track Order",
    "nav.searchProducts": "Search products...",
    "nav.signIn": "Sign In",
    "nav.signOut": "Sign Out",
    "nav.profileSettings": "Profile Settings",
    "nav.pages": "Pages",

    // Hero
    "hero.badge": "Summer Sale Live",
    "hero.upTo": "Up to ",
    "hero.discount": "50% Off",
    "hero.premiumTech": "Premium Tech",
    "hero.desc": "Discover curated deals on laptops, smartphones, and accessories from the world's top brands.",
    "hero.shopNow": "Shop Now",
    "hero.learnMore": "Learn More",

    // Categories
    "cat.browse": "Browse",
    "cat.title": "Shop by Category",
    "cat.laptops": "Laptops",
    "cat.phones": "Phones",
    "cat.accessories": "Accessories",
    "cat.components": "PC Components",

    // Why Choose Us
    "why.subtitle": "Why TechStore",
    "why.title": "Built for Tech Lovers",
    "why.desc": "We're more than just a store — we're your trusted partner in finding the perfect tech.",
    "why.freeShipping": "Free Shipping",
    "why.freeShippingDesc": "On orders over $50 — delivered to your door fast.",
    "why.authentic": "Authentic Products",
    "why.authenticDesc": "100% genuine products sourced directly from brands.",
    "why.support": "24/7 Support",
    "why.supportDesc": "Expert help whenever you need it, day or night.",
    "why.secure": "Secure Payments",
    "why.secureDesc": "SSL encrypted checkout with flexible payment options.",

    // Brand Banner
    "brand.aboutUs": "About Us",
    "brand.title1": "Your Premium ",
    "brand.title2": "Tech Destination",
    "brand.desc1": "TechStore brings together the world's top technology brands under one roof. From powerful laptops to cutting-edge smartphones, we curate only the best products — rigorously tested and backed by expert reviews.",
    "brand.desc2": "Whether you're a gamer, a creative professional, or simply love gadgets, we have something for you. With fast shipping, easy returns, and dedicated support, shopping with us is effortless.",
    "brand.learnMore": "Learn More",
    "brand.happyCustomers": "Happy Customers",
    "brand.premiumBrands": "Premium Brands",
    "brand.expertSupport": "Expert Support",
    "brand.countriesServed": "Countries Served",

    // Testimonials
    "test.subtitle": "Testimonials",
    "test.title": "What Our Customers Say",

    // CTA
    "cta.title": "Ready to Upgrade Your Tech?",
    "cta.desc": "Join 50,000+ customers who trust TechStore for premium technology at the best prices.",
    "cta.shopNow": "Shop Now",
    "cta.createAccount": "Create Account",

    // Product Grid
    "grid.noProducts": "No products found in this category.",
    "grid.add": "Add",

    // Product Detail
    "detail.backToShop": "Back to shop",
    "detail.reviews": "reviews",
    "detail.inStock": "In Stock",
    "detail.outOfStock": "Out of Stock",
    "detail.available": "available",
    "detail.addToCart": "Add to Cart",
    "detail.authenticProduct": "Authentic Product",
    "detail.freeShipping": "Free Shipping",
    "detail.returns": "30-Day Returns",
    "detail.notFound": "Product not found",
    "detail.notFoundDesc": "The product you're looking for doesn't exist.",
    "detail.goHome": "Go back home",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.emptyDesc": "Discover our curated collection of premium tech.",
    "cart.startShopping": "Start Shopping",
    "cart.continueShopping": "Continue Shopping",
    "cart.items": "items",
    "cart.item": "item",
    "cart.inYourCart": "in your cart",
    "cart.orderSummary": "Order Summary",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.free": "Free",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.backToCart": "Back to Cart",
    "checkout.shippingInfo": "Shipping Information",
    "checkout.fullName": "Full Name",
    "checkout.phone": "Phone Number",
    "checkout.email": "Email Address",
    "checkout.address": "Shipping Address",
    "checkout.paymentMethod": "Payment Method",
    "checkout.cod": "Cash on Delivery",
    "checkout.codDesc": "Pay when you receive",
    "checkout.card": "Credit Card",
    "checkout.cardDesc": "Visa, Mastercard, etc.",
    "checkout.placing": "Placing Order...",
    "checkout.pay": "Pay",
    "checkout.orderSummary": "Order Summary",
    "checkout.qty": "Qty",

    // Login
    "login.welcome": "Welcome Back",
    "login.desc": "Enter your credentials to access your account",
    "login.email": "Email",
    "login.password": "Password",
    "login.signIn": "Sign In",
    "login.signingIn": "Signing in...",
    "login.noAccount": "Don't have an account?",
    "login.signUp": "Sign Up",

    // Register
    "register.title": "Create Account",
    "register.desc": "Join TechStore to start shopping",
    "register.name": "Full Name",
    "register.email": "Email",
    "register.password": "Password",
    "register.confirmPassword": "Confirm Password",
    "register.create": "Create Account",
    "register.creating": "Creating account...",
    "register.hasAccount": "Already have an account?",
    "register.signIn": "Sign In",

    // Profile
    "profile.title": "Profile Settings",
    "profile.personalInfo": "Personal Information",
    "profile.personalInfoDesc": "Update your name and email address",
    "profile.name": "Full Name",
    "profile.email": "Email",
    "profile.save": "Save Changes",
    "profile.saving": "Saving...",
    "profile.changePassword": "Change Password",
    "profile.changePasswordDesc": "Update your password to keep your account secure",
    "profile.currentPassword": "Current Password",
    "profile.newPassword": "New Password",
    "profile.confirmNewPassword": "Confirm New Password",
    "profile.updatePassword": "Update Password",
    "profile.updatingPassword": "Updating...",
    "profile.signOut": "Sign Out",
    "profile.signOutDesc": "Log out of your account on this device",
    "profile.loading": "Loading...",

    // About
    "about.ourStory": "Our Story",
    "about.title1": "We Build the Future of ",
    "about.title2": "Tech Shopping",
    "about.desc": "Founded in 2020, TechStore is on a mission to make premium technology accessible to everyone. We curate the best products from top brands and deliver them with unmatched service.",
    "about.happyCustomers": "Happy Customers",
    "about.topBrands": "Top Brands",
    "about.countriesServed": "Countries Served",
    "about.ordersDelivered": "Orders Delivered",
    "about.ourMission": "Our Mission",
    "about.missionTitle1": "Technology for ",
    "about.missionTitle2": "Everyone",
    "about.missionDesc1": "We believe everyone deserves access to the latest technology. That's why we work directly with manufacturers to bring you the best prices without compromising on quality or authenticity.",
    "about.missionDesc2": "Every product in our store goes through a rigorous quality check. Our team of tech experts tests and reviews each item to ensure it meets our high standards.",
    "about.theTeam": "The Team",
    "about.meetExperts": "Meet Our Experts",

    // Contact
    "contact.getInTouch": "Get in Touch",
    "contact.title": "Contact ",
    "contact.titleHighlight": "Us",
    "contact.desc": "Have a question or need help? We'd love to hear from you.",
    "contact.emailLabel": "Email",
    "contact.phoneLabel": "Phone",
    "contact.addressLabel": "Address",
    "contact.hoursLabel": "Hours",
    "contact.name": "Full Name",
    "contact.email": "Email",
    "contact.subject": "Subject",
    "contact.subjectPlaceholder": "How can we help?",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Tell us more...",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.sent": "Message sent!",
    "contact.sentDesc": "We'll get back to you within 24 hours.",

    // FAQ
    "faq.helpCenter": "Help Center",
    "faq.title1": "Frequently Asked ",
    "faq.title2": "Questions",
    "faq.desc": "Find answers to the most common questions about orders, shipping, and more.",
    "faq.ordersShipping": "Orders & Shipping",
    "faq.returnsRefunds": "Returns & Refunds",
    "faq.paymentSecurity": "Payment & Security",
    "faq.accountWarranty": "Account & Warranty",
    // FAQ questions
    "faq.q1": "How long does shipping take?",
    "faq.a1": "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business day delivery.",
    "faq.q2": "Do you offer free shipping?",
    "faq.a2": "Yes! We offer free standard shipping on all orders over $50. Express shipping is available at an additional cost.",
    "faq.q3": "Can I track my order?",
    "faq.a3": "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your order on our Track Order page.",
    "faq.q4": "What countries do you ship to?",
    "faq.a4": "We currently ship to over 30 countries worldwide. Check our shipping page for the full list of supported destinations.",
    "faq.q5": "What is your return policy?",
    "faq.a5": "We offer a 30-day return policy on all products. Items must be in their original packaging and condition.",
    "faq.q6": "How long do refunds take?",
    "faq.a6": "Refunds are processed within 5-7 business days after we receive your returned item. The amount will be credited to your original payment method.",
    "faq.q7": "Can I exchange a product?",
    "faq.a7": "Yes, exchanges are available within 30 days of purchase. Contact our support team to initiate an exchange.",
    "faq.q8": "What payment methods do you accept?",
    "faq.a8": "We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. All transactions are encrypted and secure.",
    "faq.q9": "Is my payment information safe?",
    "faq.a9": "Yes. We use industry-standard SSL encryption and never store your full credit card details on our servers.",
    "faq.q10": "Do you offer installment payments?",
    "faq.a10": "Yes! We partner with Klarna and Afterpay to offer flexible installment plans on qualifying purchases.",
    "faq.q11": "How do I create an account?",
    "faq.a11": "Click the 'Sign Up' button in the top navigation. You'll need an email address and password to get started.",
    "faq.q12": "What warranty do products come with?",
    "faq.a12": "All products come with the manufacturer's standard warranty. Extended warranty options are available at checkout.",

    // Track Order
    "track.subtitle": "Order Status",
    "track.title1": "Track Your ",
    "track.title2": "Order",
    "track.desc": "Enter your order ID to see real-time shipping updates.",
    "track.orderId": "Order ID",
    "track.track": "Track",
    "track.order": "Order",
    "track.status": "Status",
    "track.inTransit": "In Transit",
    "track.orderPlaced": "Order Placed",
    "track.processing": "Processing",
    "track.shipped": "Shipped",
    "track.delivered": "Delivered",

    // 404
    "notFound.title": "Page Not Found",
    "notFound.desc": "The page you're looking for doesn't exist or has been moved to a different location.",
    "notFound.goBack": "Go Back",
    "notFound.home": "Home Page",

    // Footer
    "footer.desc": "Your premium destination for cutting-edge technology and accessories.",
    "footer.shop": "Shop",
    "footer.support": "Support",
    "footer.company": "Company",
    "footer.aboutUs": "About Us",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.newsletter": "Newsletter",
    "footer.newsletterDesc": "Get the latest deals and updates.",
    "footer.go": "Go",
    "footer.rights": "All rights reserved.",
    "footer.contactUs": "Contact Us",

    // Featured
    "featured.title": "Featured Products",
    "featured.subtitle": "Handpicked for you",
    "newArrivals.title": "New Arrivals",
    "newArrivals.subtitle": "Just landed",
  },

  am: {
    // Navbar
    "nav.store": "መደብር",
    "nav.categories": "ምድቦች",
    "nav.about": "ስለ እኛ",
    "nav.contact": "አግኙን",
    "nav.faq": "ተደጋጋሚ ጥያቄዎች",
    "nav.trackOrder": "ትዕዛዝ ይከታተሉ",
    "nav.searchProducts": "ምርቶችን ይፈልጉ...",
    "nav.signIn": "ይግቡ",
    "nav.signOut": "ይውጡ",
    "nav.profileSettings": "የመገለጫ ቅንብሮች",
    "nav.pages": "ገጾች",

    // Hero
    "hero.badge": "የበጋ ሽያጭ በቀጥታ",
    "hero.upTo": "እስከ ",
    "hero.discount": "50% ቅናሽ",
    "hero.premiumTech": "ፕሪሚየም ቴክኖሎጂ",
    "hero.desc": "ከዓለም ዋና ብራንዶች ላፕቶፖች፣ ስማርትፎኖች እና ተጨማሪ መሣሪያዎች ላይ የተመረጡ ቅናሾችን ያግኙ።",
    "hero.shopNow": "አሁን ይግዙ",
    "hero.learnMore": "ተጨማሪ ይወቁ",

    // Categories
    "cat.browse": "ያስሱ",
    "cat.title": "በምድብ ይግዙ",
    "cat.laptops": "ላፕቶፖች",
    "cat.phones": "ስልኮች",
    "cat.accessories": "ተጨማሪ መሣሪያዎች",
    "cat.components": "የፒሲ ክፍሎች",

    // Why Choose Us
    "why.subtitle": "ለምን TechStore",
    "why.title": "ለቴክ አፍቃሪዎች የተሠራ",
    "why.desc": "እኛ ከመደብር በላይ ነን — ትክክለኛውን ቴክ ለማግኘት የሚታመን አጋርዎ ነን።",
    "why.freeShipping": "ነጻ መላኪያ",
    "why.freeShippingDesc": "ከ$50 በላይ ባሉ ትዕዛዞች — ወደ በርዎ በፍጥነት ይደርሳል።",
    "why.authentic": "ኦሪጅናል ምርቶች",
    "why.authenticDesc": "100% ከብራንዶች በቀጥታ የተገኙ ዋናዎቹ ምርቶች።",
    "why.support": "24/7 ድጋፍ",
    "why.supportDesc": "ሌት ተቀን ባለሙያ እርዳታ።",
    "why.secure": "ደህንነቱ የተጠበቀ ክፍያ",
    "why.secureDesc": "SSL የተመሰጠረ ክፍያ ከተለዋዋጭ አማራጮች ጋር።",

    // Brand Banner
    "brand.aboutUs": "ስለ እኛ",
    "brand.title1": "ፕሪሚየም ",
    "brand.title2": "የቴክ መድረሻ",
    "brand.desc1": "TechStore የዓለምን ምርጥ የቴክኖሎጂ ብራንዶች በአንድ ጣሪያ ስር ያመጣል። ከኃይለኛ ላፕቶፖች እስከ ዘመናዊ ስማርትፎኖች ድረስ፣ ምርጥ ምርቶችን ብቻ እናቀርባለን።",
    "brand.desc2": "ጌመር፣ ፈጠራ ባለሙያ ወይም በቀላሉ ጋጄቶችን የሚወዱ ከሆኑ፣ ለእርስዎ የሚሆን ነገር አለን። በፈጣን ማድረስ፣ ቀላል ተመላሾች እና ቁርጠኛ ድጋፍ።",
    "brand.learnMore": "ተጨማሪ ይወቁ",
    "brand.happyCustomers": "ደስተኛ ደንበኞች",
    "brand.premiumBrands": "ፕሪሚየም ብራንዶች",
    "brand.expertSupport": "ባለሙያ ድጋፍ",
    "brand.countriesServed": "የሚገለገሉ ሀገሮች",

    // Testimonials
    "test.subtitle": "ምስክርነቶች",
    "test.title": "ደንበኞቻችን ምን ይላሉ",

    // CTA
    "cta.title": "ቴክዎን ለማሻሻል ዝግጁ ነዎት?",
    "cta.desc": "ለፕሪሚየም ቴክኖሎጂ TechStoreን የሚያምኑ ከ50,000 በላይ ደንበኞች ይቀላቀሉ።",
    "cta.shopNow": "አሁን ይግዙ",
    "cta.createAccount": "መለያ ይፍጠሩ",

    // Product Grid
    "grid.noProducts": "በዚህ ምድብ ምርቶች አልተገኙም።",
    "grid.add": "ጨምር",

    // Product Detail
    "detail.backToShop": "ወደ መደብር ተመለስ",
    "detail.reviews": "ግምገማዎች",
    "detail.inStock": "በመጋዘን አለ",
    "detail.outOfStock": "አልቋል",
    "detail.available": "ይገኛል",
    "detail.addToCart": "ወደ ጋሪ ጨምር",
    "detail.authenticProduct": "ኦሪጅናል ምርት",
    "detail.freeShipping": "ነጻ መላኪያ",
    "detail.returns": "የ30 ቀን ተመላሽ",
    "detail.notFound": "ምርቱ አልተገኘም",
    "detail.notFoundDesc": "የሚፈልጉት ምርት የለም።",
    "detail.goHome": "ወደ መነሻ ተመለስ",

    // Cart
    "cart.title": "የግዢ ጋሪ",
    "cart.empty": "ጋሪዎ ባዶ ነው",
    "cart.emptyDesc": "የፕሪሚየም ቴክ ስብስባችንን ያግኙ።",
    "cart.startShopping": "ግዢ ጀምር",
    "cart.continueShopping": "ግዢ ቀጥል",
    "cart.items": "ዕቃዎች",
    "cart.item": "ዕቃ",
    "cart.inYourCart": "በጋሪዎ ውስጥ",
    "cart.orderSummary": "የትዕዛዝ ማጠቃለያ",
    "cart.subtotal": "ንዑስ ድምር",
    "cart.shipping": "መላኪያ",
    "cart.free": "ነጻ",
    "cart.total": "ጠቅላላ",
    "cart.checkout": "ወደ ክፍያ ቀጥል",

    // Checkout
    "checkout.title": "ክፍያ",
    "checkout.backToCart": "ወደ ጋሪ ተመለስ",
    "checkout.shippingInfo": "የመላኪያ መረጃ",
    "checkout.fullName": "ሙሉ ስም",
    "checkout.phone": "ስልክ ቁጥር",
    "checkout.email": "ኢሜይል",
    "checkout.address": "የመላኪያ አድራሻ",
    "checkout.paymentMethod": "የክፍያ ዘዴ",
    "checkout.cod": "በዕቃ ደርሶ ክፈል",
    "checkout.codDesc": "ሲደርስዎ ይክፈሉ",
    "checkout.card": "ክሬዲት ካርድ",
    "checkout.cardDesc": "ቪዛ፣ ማስተርካርድ ወዘተ.",
    "checkout.placing": "ትዕዛዝ በመስጠት ላይ...",
    "checkout.pay": "ክፈል",
    "checkout.orderSummary": "የትዕዛዝ ማጠቃለያ",
    "checkout.qty": "ብዛት",

    // Login
    "login.welcome": "እንኳን ደህና መጡ",
    "login.desc": "ወደ መለያዎ ለመግባት ምስክርነቶችን ያስገቡ",
    "login.email": "ኢሜይል",
    "login.password": "የይለፍ ቃል",
    "login.signIn": "ይግቡ",
    "login.signingIn": "በመግባት ላይ...",
    "login.noAccount": "መለያ የለዎትም?",
    "login.signUp": "ይመዝገቡ",

    // Register
    "register.title": "መለያ ይፍጠሩ",
    "register.desc": "ግዢ ለመጀመር TechStore ይቀላቀሉ",
    "register.name": "ሙሉ ስም",
    "register.email": "ኢሜይል",
    "register.password": "የይለፍ ቃል",
    "register.confirmPassword": "የይለፍ ቃል ያረጋግጡ",
    "register.create": "መለያ ይፍጠሩ",
    "register.creating": "መለያ በመፍጠር ላይ...",
    "register.hasAccount": "ቀድሞ መለያ አለዎት?",
    "register.signIn": "ይግቡ",

    // Profile
    "profile.title": "የመገለጫ ቅንብሮች",
    "profile.personalInfo": "የግል መረጃ",
    "profile.personalInfoDesc": "ስምዎን እና ኢሜይልዎን ያዘምኑ",
    "profile.name": "ሙሉ ስም",
    "profile.email": "ኢሜይል",
    "profile.save": "ለውጦችን ያስቀምጡ",
    "profile.saving": "በማስቀመጥ ላይ...",
    "profile.changePassword": "የይለፍ ቃል ይቀይሩ",
    "profile.changePasswordDesc": "መለያዎን ደህንነት ለመጠበቅ የይለፍ ቃልዎን ያዘምኑ",
    "profile.currentPassword": "ያሁኑ የይለፍ ቃል",
    "profile.newPassword": "አዲስ የይለፍ ቃል",
    "profile.confirmNewPassword": "አዲስ የይለፍ ቃል ያረጋግጡ",
    "profile.updatePassword": "የይለፍ ቃል ያዘምኑ",
    "profile.updatingPassword": "በማዘመን ላይ...",
    "profile.signOut": "ይውጡ",
    "profile.signOutDesc": "ከዚህ መሣሪያ ይውጡ",
    "profile.loading": "በመጫን ላይ...",

    // About
    "about.ourStory": "ታሪካችን",
    "about.title1": "የወደፊቱን ",
    "about.title2": "የቴክ ግዢ እንገነባለን",
    "about.desc": "በ2020 የተመሰረተው TechStore ፕሪሚየም ቴክኖሎጂን ለሁሉም ተደራሽ ለማድረግ ተልዕኮ ላይ ነው።",
    "about.happyCustomers": "ደስተኛ ደንበኞች",
    "about.topBrands": "ምርጥ ብራንዶች",
    "about.countriesServed": "የሚገለገሉ ሀገሮች",
    "about.ordersDelivered": "የተላኩ ትዕዛዞች",
    "about.ourMission": "ተልዕኮአችን",
    "about.missionTitle1": "ቴክኖሎጂ ለ",
    "about.missionTitle2": "ሁሉም",
    "about.missionDesc1": "ሁሉም ሰው የቅርብ ጊዜ ቴክኖሎጂ ማግኘት ይገባዋል ብለን እናምናለን። ለዛም ከአምራቾች ጋር በቀጥታ እንሠራለን።",
    "about.missionDesc2": "በመደብራችን ውስጥ ያለ ሁሉም ምርት ጥብቅ የጥራት ምርመራ ያልፋል።",
    "about.theTeam": "ቡድናችን",
    "about.meetExperts": "ባለሙያዎቻችንን ይገናኙ",

    // Contact
    "contact.getInTouch": "ያግኙን",
    "contact.title": "ያግኙ",
    "contact.titleHighlight": "ን",
    "contact.desc": "ጥያቄ ወይም እርዳታ ይፈልጋሉ? ከእርስዎ መስማት እንወዳለን።",
    "contact.emailLabel": "ኢሜይል",
    "contact.phoneLabel": "ስልክ",
    "contact.addressLabel": "አድራሻ",
    "contact.hoursLabel": "ሰዓታት",
    "contact.name": "ሙሉ ስም",
    "contact.email": "ኢሜይል",
    "contact.subject": "ርዕሰ ጉዳይ",
    "contact.subjectPlaceholder": "እንዴት ልንረዳዎ እንችላለን?",
    "contact.message": "መልዕክት",
    "contact.messagePlaceholder": "ተጨማሪ ይንገሩን...",
    "contact.send": "መልዕክት ይላኩ",
    "contact.sending": "በመላክ ላይ...",
    "contact.sent": "መልዕክት ተልኳል!",
    "contact.sentDesc": "በ24 ሰዓት ውስጥ እንመልሳለን።",

    // FAQ
    "faq.helpCenter": "የእርዳታ ማዕከል",
    "faq.title1": "ተደጋጋሚ ",
    "faq.title2": "ጥያቄዎች",
    "faq.desc": "ስለ ትዕዛዞች፣ መላኪያ እና ሌሎች ተደጋጋሚ ጥያቄዎች መልሶችን ያግኙ።",
    "faq.ordersShipping": "ትዕዛዞች እና መላኪያ",
    "faq.returnsRefunds": "ተመላሾች እና ገንዘብ ተመላሽ",
    "faq.paymentSecurity": "ክፍያ እና ደህንነት",
    "faq.accountWarranty": "መለያ እና ዋስትና",
    "faq.q1": "መላኪያ ምን ያህል ጊዜ ይወስዳል?",
    "faq.a1": "መደበኛ መላኪያ 5-7 የሥራ ቀናት ይወስዳል። ፈጣን መላኪያ ለ2-3 የሥራ ቀናት ይገኛል።",
    "faq.q2": "ነጻ መላኪያ ይሰጣሉ?",
    "faq.a2": "አዎ! ከ$50 በላይ ባሉ ትዕዛዞች ነጻ መደበኛ መላኪያ እናቀርባለን።",
    "faq.q3": "ትዕዛዜን መከታተል እችላለሁ?",
    "faq.a3": "በእርግጥ! ትዕዛዝዎ ሲላክ የመከታተያ ቁጥር በኢሜይል ይደርስዎታል።",
    "faq.q4": "ወደ የትኞቹ ሀገሮች ይልካሉ?",
    "faq.a4": "በአሁኑ ጊዜ ወደ ከ30 በላይ ሀገሮች እንልካለን።",
    "faq.q5": "የተመላሽ ፖሊሲዎ ምንድ ነው?",
    "faq.a5": "በሁሉም ምርቶች ላይ 30 ቀን የተመላሽ ፖሊሲ አለን።",
    "faq.q6": "ገንዘብ ተመላሽ ምን ያህል ጊዜ ይወስዳል?",
    "faq.a6": "ገንዘብ ተመላሽ ዕቃውን ከተቀበልን በ5-7 የሥራ ቀናት ውስጥ ይከናወናል።",
    "faq.q7": "ምርት መቀያየር እችላለሁ?",
    "faq.a7": "አዎ፣ ግዢ ከተደረገ 30 ቀናት ውስጥ መቀያየር ይቻላል።",
    "faq.q8": "የትኞቹን የክፍያ ዘዴዎች ይቀበላሉ?",
    "faq.a8": "ቪዛ፣ ማስተርካርድ፣ አሜሪካን ኤክስፕረስ፣ PayPal እና Apple Pay እንቀበላለን።",
    "faq.q9": "የክፍያ መረጃዬ ደህንነቱ የተጠበቀ ነው?",
    "faq.a9": "አዎ። ደረጃውን የጠበቀ SSL ምሰጢር ይጠቀማለን።",
    "faq.q10": "በክፍያ ጊዜ ያቅዱ ክፍያ ይሰጣሉ?",
    "faq.a10": "አዎ! ከKlarna እና Afterpay ጋር በመተባበር ተለዋዋጭ ክፍያ እቅዶችን እናቀርባለን።",
    "faq.q11": "መለያ እንዴት እፈጥራለሁ?",
    "faq.a11": "በላይኛው ማሰሻ ላይ 'ይመዝገቡ' ቁልፍን ጠቅ ያድርጉ።",
    "faq.q12": "ምርቶች ምን ዋስትና ይይዛሉ?",
    "faq.a12": "ሁሉም ምርቶች ከአምራቹ መደበኛ ዋስትና ጋር ይመጣሉ።",

    // Track Order
    "track.subtitle": "የትዕዛዝ ሁኔታ",
    "track.title1": "ትዕዛዝዎን ",
    "track.title2": "ይከታተሉ",
    "track.desc": "የትዕዛዝ መለያ ቁጥርዎን ያስገቡ።",
    "track.orderId": "የትዕዛዝ መለያ",
    "track.track": "ይከታተሉ",
    "track.order": "ትዕዛዝ",
    "track.status": "ሁኔታ",
    "track.inTransit": "በመላኪያ ላይ",
    "track.orderPlaced": "ትዕዛዝ ተሰጥቷል",
    "track.processing": "በማዘጋጀት ላይ",
    "track.shipped": "ተልኳል",
    "track.delivered": "ደርሷል",

    // 404
    "notFound.title": "ገጹ አልተገኘም",
    "notFound.desc": "የሚፈልጉት ገጽ የለም ወይም ተዛውሯል።",
    "notFound.goBack": "ተመለስ",
    "notFound.home": "መነሻ ገጽ",

    // Footer
    "footer.desc": "ለዘመናዊ ቴክኖሎጂ እና ተጨማሪ መሣሪያዎች ፕሪሚየም መድረሻዎ።",
    "footer.shop": "መደብር",
    "footer.support": "ድጋፍ",
    "footer.company": "ኩባንያ",
    "footer.aboutUs": "ስለ እኛ",
    "footer.privacyPolicy": "የግላዊነት ፖሊሲ",
    "footer.terms": "የአገልግሎት ውሎች",
    "footer.newsletter": "ዜና ደብዳቤ",
    "footer.newsletterDesc": "የቅርብ ጊዜ ቅናሾችን እና ዝማኔዎችን ያግኙ።",
    "footer.go": "ላክ",
    "footer.rights": "ሁሉም መብቶች የተጠበቁ ናቸው።",
    "footer.contactUs": "ያግኙን",

    // Featured
    "featured.title": "ተመራጭ ምርቶች",
    "featured.subtitle": "ለእርስዎ የተመረጡ",
    "newArrivals.title": "አዲስ መጤዎች",
    "newArrivals.subtitle": "አሁን የደረሱ",
  },

  om: {
    // Navbar
    "nav.store": "Koorsii",
    "nav.categories": "Ramaddii",
    "nav.about": "Waa'ee Keenya",
    "nav.contact": "Nu Quunnamaa",
    "nav.faq": "Gaaffilee Yeroo Baay'ee Gaafataman",
    "nav.trackOrder": "Ajaja Hordofuu",
    "nav.searchProducts": "Oomishaalee barbaadaa...",
    "nav.signIn": "Seenaa",
    "nav.signOut": "Ba'aa",
    "nav.profileSettings": "Qindaa'ina Profaayilii",
    "nav.pages": "Fuulaalee",

    // Hero
    "hero.badge": "Gurgurtaa Bonaa Kallattiin",
    "hero.upTo": "Hanga ",
    "hero.discount": "50% Hir'isaa",
    "hero.premiumTech": "Teeknooloojii Olaanaa",
    "hero.desc": "Laaptooppii, bilbila ismaartii, fi meeshaalee biroo irratti waliigaltee filatamaa argataa.",
    "hero.shopNow": "Amma Bitadhaa",
    "hero.learnMore": "Dabalata Baraa",

    // Categories
    "cat.browse": "Sakatta'aa",
    "cat.title": "Ramaddiidhaan Bitadhaa",
    "cat.laptops": "Laaptooppii",
    "cat.phones": "Bilbilaalee",
    "cat.accessories": "Meeshaalee Dabalataa",
    "cat.components": "Kutaalee PC",

    // Why Choose Us
    "why.subtitle": "Maaliif TechStore",
    "why.title": "Jaallattoota Teeknooloojiif Kan Ijaarame",
    "why.desc": "Suuqii qofa miti — teeknooloojii sirrii argachuuf michuu amanamaa keessaniti.",
    "why.freeShipping": "Ergaa Bilisaa",
    "why.freeShippingDesc": "Ajaja $50 ol irratti — saffisaan balbala keessanitti ni geessa.",
    "why.authentic": "Oomishaalee Dhugaa",
    "why.authenticDesc": "100% oomishaalee dhugaa braandii irraa kallattiin argaman.",
    "why.support": "Deeggarsa 24/7",
    "why.supportDesc": "Gargaarsa ogeessaa yeroo barbaaddan.",
    "why.secure": "Kaffaltii Nageenya",
    "why.secureDesc": "Kaffaltii SSL tiin eegame filannoo jijjiiramaa waliin.",

    // Brand Banner
    "brand.aboutUs": "Waa'ee Keenya",
    "brand.title1": "Bakka Ga'umsaa ",
    "brand.title2": "Teeknooloojii Olaanaa",
    "brand.desc1": "TechStore braandoota teeknooloojii addunyaa guddaa tokko jalatti walitti fida. Laaptooppii cimaa hanga bilbila ismaartii haaraatti, oomishaalee filatamoo qofa dhiyeessina.",
    "brand.desc2": "Taphataa geemii, ogeessa kalaqaa, ykn salphaatti gaajeetii kan jaallattu yoo ta'e, wanti isiniif ta'u jira.",
    "brand.learnMore": "Dabalata Baraa",
    "brand.happyCustomers": "Maamiltoonni Gammadan",
    "brand.premiumBrands": "Braandoota Olaanaa",
    "brand.expertSupport": "Deeggarsa Ogeessaa",
    "brand.countriesServed": "Biyyoota Tajaajilamoo",

    // Testimonials
    "test.subtitle": "Ragaalee",
    "test.title": "Maamiltoonni Keenya Maal Jedhu",

    // CTA
    "cta.title": "Teeknooloojii Keessan Fooyyessuuf Qophii Dha?",
    "cta.desc": "Maamiltoonni 50,000 ol TechStore amanatan teeknooloojii olaanaa gatii gaariitiin argatu.",
    "cta.shopNow": "Amma Bitadhaa",
    "cta.createAccount": "Herrega Uumaa",

    // Product Grid
    "grid.noProducts": "Ramaddii kana keessatti oomishni hin argamne.",
    "grid.add": "Ida'i",

    // Product Detail
    "detail.backToShop": "Gara suuqaatti deebi'aa",
    "detail.reviews": "gamaaggama",
    "detail.inStock": "Kuusaa Keessa Jira",
    "detail.outOfStock": "Dhumera",
    "detail.available": "ni argama",
    "detail.addToCart": "Gara Kaartii Ida'i",
    "detail.authenticProduct": "Oomisha Dhugaa",
    "detail.freeShipping": "Ergaa Bilisaa",
    "detail.returns": "Deebii Guyyaa 30",
    "detail.notFound": "Oomishni hin argamne",
    "detail.notFoundDesc": "Oomishni barbaaddan hin jiru.",
    "detail.goHome": "Gara manaatti deebi'aa",

    // Cart
    "cart.title": "Kaartii Bitachaa",
    "cart.empty": "Kaartiin keessan duwwaa dha",
    "cart.emptyDesc": "Walitti qabama teeknooloojii olaanaa keenya argadhaa.",
    "cart.startShopping": "Bitachuu Jalqabaa",
    "cart.continueShopping": "Bitachuu Itti Fufaa",
    "cart.items": "meeshaalee",
    "cart.item": "meeshaa",
    "cart.inYourCart": "kaartii keessan keessa",
    "cart.orderSummary": "Cuunfaa Ajajaa",
    "cart.subtotal": "Ida'ama Xiqqaa",
    "cart.shipping": "Ergaa",
    "cart.free": "Bilisaa",
    "cart.total": "Waliigalaa",
    "cart.checkout": "Gara Kaffaltii Itti Fufaa",

    // Checkout
    "checkout.title": "Kaffaltii",
    "checkout.backToCart": "Gara Kaartii Deebi'aa",
    "checkout.shippingInfo": "Odeeffannoo Ergaa",
    "checkout.fullName": "Maqaa Guutuu",
    "checkout.phone": "Lakkoofsa Bilbilaa",
    "checkout.email": "Imeelii",
    "checkout.address": "Teessoo Ergaa",
    "checkout.paymentMethod": "Mala Kaffaltii",
    "checkout.cod": "Meeshaan Yoo Ga'e Kaffalaa",
    "checkout.codDesc": "Yoo isiniif ga'e kaffalaa",
    "checkout.card": "Kaardii Liqii",
    "checkout.cardDesc": "Visa, Mastercard, kkf.",
    "checkout.placing": "Ajaja Kennaa Jirra...",
    "checkout.pay": "Kaffalaa",
    "checkout.orderSummary": "Cuunfaa Ajajaa",
    "checkout.qty": "Bay'ina",

    // Login
    "login.welcome": "Baga Nagaan Dhuftan",
    "login.desc": "Herrega keessanitti seenuuf ragaalee keessan galchaa",
    "login.email": "Imeelii",
    "login.password": "Jecha Darbii",
    "login.signIn": "Seenaa",
    "login.signingIn": "Seenaa jira...",
    "login.noAccount": "Herrega hin qabduu?",
    "login.signUp": "Galmaa'aa",

    // Register
    "register.title": "Herrega Uumaa",
    "register.desc": "Bitachuu jalqabuuf TechStore makaa",
    "register.name": "Maqaa Guutuu",
    "register.email": "Imeelii",
    "register.password": "Jecha Darbii",
    "register.confirmPassword": "Jecha Darbii Mirkaneessaa",
    "register.create": "Herrega Uumaa",
    "register.creating": "Herrega uumaa jira...",
    "register.hasAccount": "Duraan herrega qabdaa?",
    "register.signIn": "Seenaa",

    // Profile
    "profile.title": "Qindaa'ina Profaayilii",
    "profile.personalInfo": "Odeeffannoo Dhuunfaa",
    "profile.personalInfoDesc": "Maqaa fi imeelii keessan haaromfadhaa",
    "profile.name": "Maqaa Guutuu",
    "profile.email": "Imeelii",
    "profile.save": "Jijjiirama Olkaa'aa",
    "profile.saving": "Olkaa'aa jira...",
    "profile.changePassword": "Jecha Darbii Jijjiiraa",
    "profile.changePasswordDesc": "Nageenya herrega keessaniif jecha darbii haaromfadhaa",
    "profile.currentPassword": "Jecha Darbii Ammaa",
    "profile.newPassword": "Jecha Darbii Haaraa",
    "profile.confirmNewPassword": "Jecha Darbii Haaraa Mirkaneessaa",
    "profile.updatePassword": "Jecha Darbii Haaromfadhaa",
    "profile.updatingPassword": "Haaromfachaa jira...",
    "profile.signOut": "Ba'aa",
    "profile.signOutDesc": "Meeshaa kana irraa ba'aa",
    "profile.loading": "Fe'aa jira...",

    // About
    "about.ourStory": "Seenaa Keenya",
    "about.title1": "Fuula Duraa ",
    "about.title2": "Bitachaa Teeknooloojii Ni Ijaarra",
    "about.desc": "Bara 2020 kan hundeeffame TechStore teeknooloojii olaanaa hundaaf dhaqqabamaa gochuuf ergama irra jira.",
    "about.happyCustomers": "Maamiltoonni Gammadan",
    "about.topBrands": "Braandoota Guddaa",
    "about.countriesServed": "Biyyoota Tajaajilamoo",
    "about.ordersDelivered": "Ajajaalee Ergaman",
    "about.ourMission": "Ergama Keenya",
    "about.missionTitle1": "Teeknooloojii ",
    "about.missionTitle2": "Hundaaf",
    "about.missionDesc1": "Namni hunduu teeknooloojii haaraa argachuu qaba jennee amanna. Kanaafis warshaalee waliin kallattiin hojjenna.",
    "about.missionDesc2": "Oomishni suuqa keenya keessa jiru hunduu sakatta'iinsa qulqullina cimaaf ni darba.",
    "about.theTeam": "Garee Keenya",
    "about.meetExperts": "Ogeessota Keenya Beekaa",

    // Contact
    "contact.getInTouch": "Nu Quunnamaa",
    "contact.title": "Nu ",
    "contact.titleHighlight": "Quunnamaa",
    "contact.desc": "Gaaffii qabduu? Isin irraa dhaga'uu jaalanna.",
    "contact.emailLabel": "Imeelii",
    "contact.phoneLabel": "Bilbilaa",
    "contact.addressLabel": "Teessoo",
    "contact.hoursLabel": "Sa'aatii",
    "contact.name": "Maqaa Guutuu",
    "contact.email": "Imeelii",
    "contact.subject": "Mata Duree",
    "contact.subjectPlaceholder": "Akkamiin isin gargaaruu dandeenya?",
    "contact.message": "Ergaa",
    "contact.messagePlaceholder": "Dabalata nutti himaa...",
    "contact.send": "Ergaa Ergaa",
    "contact.sending": "Ergaa jira...",
    "contact.sent": "Ergaan ergameera!",
    "contact.sentDesc": "Sa'aatii 24 keessatti deebii isiniif kennina.",

    // FAQ
    "faq.helpCenter": "Wiirtuu Gargaarsaa",
    "faq.title1": "Gaaffilee Yeroo ",
    "faq.title2": "Baay'ee Gaafataman",
    "faq.desc": "Waa'ee ajajaalee, ergaa fi kan biroo gaaffilee baay'ee gaafataman deebii argadhaa.",
    "faq.ordersShipping": "Ajajaalee fi Ergaa",
    "faq.returnsRefunds": "Deebii fi Deebii Maallaqaa",
    "faq.paymentSecurity": "Kaffaltii fi Nageenya",
    "faq.accountWarranty": "Herrega fi Waadaa",
    "faq.q1": "Ergaan hammam turaa?",
    "faq.a1": "Ergaan idilee guyyaa hojii 5-7 fudhata. Ergaan ariifataa guyyaa hojii 2-3f ni argama.",
    "faq.q2": "Ergaa bilisaa kennituu?",
    "faq.a2": "Eeyyen! Ajaja $50 ol irratti ergaa idilee bilisaa kennina.",
    "faq.q3": "Ajaja koo hordofuu nan danda'aa?",
    "faq.a3": "Ni dandeessa! Ajajni kee yoo ergame lakkoofsa hordoffii imeeliidhaan siif ergama.",
    "faq.q4": "Biyyoota kamiitti ergitu?",
    "faq.a4": "Yeroo ammaa biyyoota 30 ol keessatti ni ergina.",
    "faq.q5": "Imaammata deebii keessanii maali?",
    "faq.a5": "Oomishaalee hundaa irratti imaammata deebii guyyaa 30 qabna.",
    "faq.q6": "Deebiin maallaqaa hammam turaa?",
    "faq.a6": "Deebiin maallaqaa meeshaa erga fudhannee guyyaa hojii 5-7 keessatti raawwatama.",
    "faq.q7": "Oomisha jijjiiruu nan danda'aa?",
    "faq.a7": "Eeyyen, guyyaa 30 keessatti jijjiiruun ni danda'ama.",
    "faq.q8": "Mala kaffaltii kam fudhattuu?",
    "faq.a8": "Visa, Mastercard, American Express, PayPal fi Apple Pay fudhanna.",
    "faq.q9": "Odeeffannoon kaffaltii koo nageenya qabaa?",
    "faq.a9": "Eeyyen. Icciitii SSL sadarkaa industrii fayyadamna.",
    "faq.q10": "Kaffaltii qoodamee kennituu?",
    "faq.a10": "Eeyyen! Klarna fi Afterpay waliin ta'uun karoora kaffaltii jijjiiramaa kennina.",
    "faq.q11": "Herrega akkamiin uumaa?",
    "faq.a11": "Marsariitii irratti qabduu 'Galmaa'aa' cuqaasaa.",
    "faq.q12": "Oomishaaleen waadaa maalii qabuu?",
    "faq.a12": "Oomishaaleen hunduu waadaa idilee warshaalee waliin dhufu.",

    // Track Order
    "track.subtitle": "Haala Ajajaa",
    "track.title1": "Ajaja Keessan ",
    "track.title2": "Hordofaa",
    "track.desc": "Lakkoofsa ajajaa keessan galchaa.",
    "track.orderId": "Eenyummaa Ajajaa",
    "track.track": "Hordofaa",
    "track.order": "Ajaja",
    "track.status": "Haala",
    "track.inTransit": "Karaa Irra Jira",
    "track.orderPlaced": "Ajajni Kenname",
    "track.processing": "Qophaa'aa Jira",
    "track.shipped": "Ergameera",
    "track.delivered": "Ga'eera",

    // 404
    "notFound.title": "Fuulli Hin Argamne",
    "notFound.desc": "Fuulli barbaaddan hin jiru yookiin bakka biraatti jijjiirameera.",
    "notFound.goBack": "Duubatti Deebi'aa",
    "notFound.home": "Fuula Jalqabaa",

    // Footer
    "footer.desc": "Teeknooloojii fi meeshaalee dabalataa haaraadhaaf bakka ga'umsaa olaanaa keessan.",
    "footer.shop": "Suuqa",
    "footer.support": "Deeggarsa",
    "footer.company": "Dhaabbata",
    "footer.aboutUs": "Waa'ee Keenya",
    "footer.privacyPolicy": "Imaammata Iccitii",
    "footer.terms": "Haala Tajaajilaa",
    "footer.newsletter": "Beeksisa Oduu",
    "footer.newsletterDesc": "Hir'isaa fi haaromsa haaraa argadhaa.",
    "footer.go": "Ergaa",
    "footer.rights": "Mirgi hunduu eegameera.",
    "footer.contactUs": "Nu Quunnamaa",

    // Featured
    "featured.title": "Oomishaalee Filatamoo",
    "featured.subtitle": "Isiniif filataman",
    "newArrivals.title": "Dhufeenya Haaraa",
    "newArrivals.subtitle": "Dhiyeenya ga'an",
  },
};

export const languageNames: Record<Language, string> = {
  en: "English",
  am: "አማርኛ",
  om: "Afaan Oromoo",
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  const t = useCallback(
    (key: string) => translations[language][key] || translations.en[key] || key,
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
