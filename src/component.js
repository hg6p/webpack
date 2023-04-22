export default (text = "FANTASY") => {
  const element = document.createElement("div");
  element.innerHTML = text;
  return element;
};
