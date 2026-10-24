/* Placeholder catalogue — swap names/prices/photos later.
   To use real photos: add  img: "images/your-photo.jpg"  to a product. */
(function () {
  var SZ = {
    men: ["S", "M", "L", "XL", "XXL"],
    menJeans: ["28", "30", "32", "34", "36"],
    women: ["XS", "S", "M", "L", "XL"],
    womenJeans: ["26", "28", "30", "32", "34"],
    kids: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
    free: ["Free Size"]
  };
  var COLORS = [
    ["#ff8fab", "#ffd6e0"], ["#ffd23f", "#fff1b8"], ["#8ecae6", "#d7efff"], ["#b8f2c9", "#e4fbea"],
    ["#c3a6ff", "#e8dcff"], ["#ffb27a", "#ffe0c8"], ["#9be7ff", "#d9f6ff"], ["#f6a6d8", "#fde0f2"]
  ];
  var E = { tee: "👕", shirt: "👔", jeans: "👖", jog: "🩳", hood: "🧥", short: "🩳", dress: "👗", kurti: "👚", co: "🎽", top: "👚", set: "🎽" };

  // [name, type, price, mrp, tag, emoji, sizeKey]
  var men = [
    ["Oversized Graphic Tee", "T-Shirts", 399, 699, "hot", E.tee, "men"],
    ["Boxy Street Tee", "T-Shirts", 349, 599, "new", E.tee, "men"],
    ["Printed Casual Shirt", "Shirts", 599, 999, "sale", E.shirt, "men"],
    ["Checked Flannel Shirt", "Shirts", 649, 1099, "", E.shirt, "men"],
    ["Baggy Fit Jeans", "Jeans", 899, 1499, "hot", E.jeans, "menJeans"],
    ["Slim Stretch Jeans", "Jeans", 799, 1299, "", E.jeans, "menJeans"],
    ["Cargo Joggers", "Joggers", 699, 1199, "new", E.jog, "men"],
    ["Everyday Track Pants", "Joggers", 549, 899, "", E.jog, "men"],
    ["Zip-Up Hoodie", "Hoodies", 999, 1699, "sale", E.hood, "men"],
    ["Pullover Hoodie", "Hoodies", 849, 1399, "", E.hood, "men"],
    ["Beach Shorts", "Shorts", 399, 649, "", E.short, "men"],
    ["Cargo Shorts", "Shorts", 499, 799, "new", E.short, "men"]
  ];
  var women = [
    ["Cropped Baby Tee", "Tops", 299, 499, "hot", E.top, "women"],
    ["Ribbed Tank Top", "Tops", 249, 399, "", E.top, "women"],
    ["Puff Sleeve Top", "Tops", 449, 749, "new", E.top, "women"],
    ["Floral Mini Dress", "Dresses", 799, 1299, "sale", E.dress, "women"],
    ["Wrap Midi Dress", "Dresses", 999, 1599, "", E.dress, "women"],
    ["Printed Straight Kurti", "Kurtis", 549, 899, "hot", E.kurti, "women"],
    ["Cotton Short Kurti", "Kurtis", 449, 749, "", E.kurti, "women"],
    ["Mom Fit Jeans", "Jeans", 899, 1499, "", E.jeans, "womenJeans"],
    ["Wide Leg Jeans", "Jeans", 949, 1549, "new", E.jeans, "womenJeans"],
    ["Street Co-ord Set", "Co-ords", 1199, 1899, "sale", E.co, "women"],
    ["Lounge Co-ord Set", "Co-ords", 899, 1399, "", E.co, "women"],
    ["Oversized Hoodie", "Hoodies", 899, 1499, "hot", E.hood, "women"]
  ];
  var kids = [
    ["Cartoon Print Tee", "T-Shirts", 249, 399, "hot", E.tee, "kids"],
    ["Dino Glow Tee", "T-Shirts", 249, 399, "new", E.tee, "kids"],
    ["Party Twirl Frock", "Frocks", 599, 999, "sale", E.dress, "kids"],
    ["Cotton Play Frock", "Frocks", 449, 749, "", E.dress, "kids"],
    ["Denim Shorts", "Shorts", 349, 599, "", E.short, "kids"],
    ["Comfy Joggers", "Bottoms", 399, 649, "", E.jog, "kids"],
    ["Mini Hoodie", "Hoodies", 549, 899, "new", E.hood, "kids"],
    ["Dungaree Set", "Sets", 649, 1099, "hot", E.set, "kids"],
    ["Pyjama Night Set", "Sets", 449, 699, "", E.set, "kids"],
    ["Stretch Jeans", "Bottoms", 499, 799, "sale", E.jeans, "kids"]
  ];

  var out = [], n = 0;
  function add(list, cat) {
    list.forEach(function (r) {
      var c = COLORS[n % COLORS.length];
      out.push({
        id: cat[0] + (++n), cat: cat, name: r[0], type: r[1], price: r[2], mrp: r[3],
        tag: r[4], emoji: r[5], sizes: SZ[r[6]], c1: c[0], c2: c[1], img: ""
      });
    });
  }
  add(men, "men"); add(women, "women"); add(kids, "kids");
  window.GK_PRODUCTS = out;

  window.GK_REVIEWS = [
    { n: "Rohit S.", t: "Sample review — replace with real customer feedback.", s: 5, p: "Baggy Fit Jeans" },
    { n: "Ananya K.", t: "Sample review — great fits at pocket-friendly prices.", s: 5, p: "Cropped Baby Tee" },
    { n: "Mohammed A.", t: "Sample review — ordered on WhatsApp, super quick reply.", s: 4, p: "Zip-Up Hoodie" },
    { n: "Priya R.", t: "Sample review — my kids love the tees. Will visit again!", s: 5, p: "Dino Glow Tee" },
    { n: "Karthik M.", t: "Sample review — trendy stuff without burning a hole in the pocket.", s: 5, p: "Cargo Joggers" },
    { n: "Sneha D.", t: "Sample review — loved the co-ord set, fits perfectly.", s: 4, p: "Street Co-ord Set" }
  ];
})();
