/* ==========================================================
   GK VOGUE — SITE SETTINGS  (edit this file only)
   ========================================================== */
window.GK = {
  brand: "GK Vogue",
  tagline: "Wear your vibe.",

  // WhatsApp number with country code, digits only (91 = India). e.g. "919876543210"
  whatsapp: "910000000000",
  phone: "+91 00000 00000",
  email: "hello@gkvogue.example",

  // PLACEHOLDER — replace when the shop location is final
  address: "Shop No. __, Main Road, Your Area, Your City – 000000",
  hours: "Mon–Sun · 10:30 AM – 9:30 PM",

  // Instagram handle without @
  instagram: "gkvogue",

  // Google Maps: open your shop on Google Maps > Share > Embed a map > copy ONLY the src="..." URL here.
  // Leave empty to show the "location coming soon" placeholder.
  mapEmbed: "",

  // Contact form: paste a Formspree (or similar) endpoint, e.g. "https://formspree.io/f/xxxxxx".
  // Leave empty and the form opens the visitor's email app instead.
  formEndpoint: "",

  currency: "₹",

  // Colour options: "pop" | "sunset" | "mint" | "citrus"  (visitors can also switch with the dots in the header)
  defaultTheme: "pop"
};

/* Apply saved / default theme immediately (prevents colour flash) */
(function () {
  var t = window.GK.defaultTheme;
  try { t = localStorage.getItem("gk_theme") || t; } catch (e) {}
  document.documentElement.setAttribute("data-theme", t);
})();
