export const htmlDecoding = (string: string) => {
  let tmp = "";
  if (string) {
    tmp = string
      .replace(/\\\\r|\\\\n|\\\\t|\\n|\\t|\\r/g, "")
      .replace(/(&)?lt;/g, "<")
      .replace(/(&)?gt;/g, ">")
      .replace(/(&)?quot;/g, '"')
      .replace(/(&)?amp;/g, "")
      .replace(/(&)?nbsp;/g, "&nbsp;")
      .replace(/(&)?#171;/g, "«")
      .replace(/(&)?#187;/g, "»")
      .replace(/(&)?mdash;/g, "–")
      .replace(/(&)?laquo;/g, "«")
      .replace(/(&)?raquo;/g, "»")
      .replace(/(&)?bull;/g, "•")
      .replace(/(&)?ndash;/g, "–");
  }
  return tmp;
};
