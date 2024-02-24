const buttons = document.querySelectorAll("[data-carousel-button]");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1;
    const slides = button.closest("[data-carousel]").querySelector("[data-slides]");
    const activeSlide = slides.querySelector("[data-active]");
    let newIndex = [...slides.children].indexOf(activeSlide) + offset;
    if (newIndex < 0) newIndex = slides.children.length - 1;
    if (newIndex >= slides.children.length) newIndex = 0;

    const nextSlide = slides.children[newIndex];
    const currentSlide = activeSlide;

    // Add classes to control animation
    currentSlide.classList.remove('current');
    nextSlide.classList.remove('next', 'prev');
    currentSlide.classList.add(offset === 1 ? 'prev' : 'next');
    nextSlide.classList.add('current');

    // Remove data-active from all slides
    slides.querySelectorAll('.slide').forEach(slide => {
      delete slide.dataset.active;
    });

    // Add data-active to the new slide
    nextSlide.dataset.active = true;
  });
});

// Function to move to the next slide automatically
function moveNext() {
  const nextButton = document.querySelector("[data-carousel-button='next']");
  nextButton.click();
}

// Set interval to move to the next slide every 3 seconds (adjust as needed)
setInterval(moveNext, 3000);
