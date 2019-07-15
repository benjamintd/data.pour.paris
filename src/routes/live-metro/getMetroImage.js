import * as d3 from "d3";

const metroSvg = color => `
<svg width="10px" height="25px" viewBox="0 0 10 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M-6.5,8.5 L-6.5,16.5 C1.15505911,16.5 1.37573766,16.5 6.875,16.5 C9.19270833,16.5 9.19270833,16.5 10.78125,16.5 C12.0052083,16.5 12.0052083,16.5 12.5,16.5 C14.3234053,16.5 16.5,14.2197579 16.5,12.5 C16.5,10.7802421 14.3234053,8.5 12.5,8.5 C12.0052083,8.5 12.0052083,8.5 10.78125,8.5 C9.19270833,8.5 9.19270833,8.5 6.875,8.5 C1.37573766,8.5 1.15505911,8.5 -6.49999909,8.5 Z" id="Path-4-Copy" stroke="#fff" stroke-width="2" fill="${color}" transform="translate(5.000000, 12.500000) rotate(-90.000000) translate(-5.000000, -12.500000) "></path>
    </g>
</svg>
`;

function getImageData(img) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("failed to create canvas 2d context");
  }
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0, img.width, img.height);
  console.log(context.drawImage(img, 0, 0, img.width, img.height));
  return context.getImageData(0, 0, img.width, img.height);
}

export default color => {
  const darker = d3.color(color).darker(1.5);
  return new Promise(resolve => {
    const img = new Image(10, 25);
    img.src = "data:image/svg+xml;base64," + btoa(metroSvg(darker));
    console.log(img);
    img.onload = () => {
      resolve(getImageData(img));
    };
  });
};
