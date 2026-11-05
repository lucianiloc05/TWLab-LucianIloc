const images: string[] = [
  "../MEDIA/img1.png",
  "../MEDIA/img2.png",
  "../MEDIA/img3.png"
];

const mainImage = document.getElementById("carousel-image") as HTMLImageElement;

if (!mainImage) throw new Error("Elementul carousel-image nu a fost gasit!");

let currentIndex = 0;

function showNextImage() {
  mainImage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).onfinish = () => {
    currentIndex = (currentIndex + 1) % images.length;
    mainImage.src = images[currentIndex]!;
    mainImage.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
  };
}

setInterval(showNextImage, 3000);