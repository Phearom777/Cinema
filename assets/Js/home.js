import { carouselData } from "./data.js";
import { cards } from "./data.js";

// carousel
const carouselInner = document.querySelector(".carousel-inner");
carouselData.forEach((item, index) => {
  const isActive = index === 0 ? "active" : "";
  const carouselItem = `
    <div class="carousel-item ${isActive}">
      <img src="${item.img}" class="d-block w-100" alt="Image ${index + 1}" />
      <div class="content">
        <div class="title">
           <h1>${item.title}</h1>
        </div>
        <div class="button-group d-flex">
          <button class="btn"><i class="bi bi-play-fill"></i>${
            item.buttons[0]
          }</button>
          <button class="btn"><i class="bi bi-info-lg"></i>${
            item.buttons[1]
          }</button>
        </div>
      </div>
    </div>
  `;
  carouselInner.innerHTML += carouselItem;
});



// card auto scroll
document.addEventListener("DOMContentLoaded", () => {
  // Function to create card items
  function createCardItems(items, container) {
    if (!container) return; // Check if container is null
    items.forEach((item) => {
      const cardItems = `
        <div class="scroll-wrapper" data-aos="zoom-in" data-aos-duration="800">
         <div class="card"style="cursor: pointer;" data-title="${item.title}" data-video="${item.video || ''}">
           <img src="${item.img}"  />
           <div class="content" data-title="${item.title}" data-video="${item.video || ''}">
               <i class="bi bi-play-circle"></i>
           </div>
         </div>
         <div class="title">${item.title}</div>
       </div>
      `;
      container.innerHTML += cardItems;
    });

    // Add event listeners to cards and icons
    const cards = container.querySelectorAll('.card, .icon');
    cards.forEach(card => {
      card.addEventListener('click', (event) => {
        const title = event.currentTarget.getAttribute('data-title');
        const video = event.currentTarget.getAttribute('data-video');
        showModal(title, video);
      });
    });
  }
  // Function to create card items new release
  function createCardItem(items, container) {
    if (!container) return; // Check if container is null
    items.forEach((item) => {
      const cardItems = `
        <div class="col-6 col-md-4 col-lg-3 col-xl-3" data-aos="zoom-in" data-aos-duration="800">
          <div class="card" style="cursor: pointer;" data-title="${item.title}" data-video="${item.video || ''}">
            <img src="${item.img}" alt="" />
              <div class="content" data-title="${item.title}" data-video="${item.video || ''}">
                <i class="bi bi-play-circle"></i>
              </div>
          </div>
          <div class="title">${item.title}</div>
        </div>
      `;
      container.innerHTML += cardItems;
    });

    // Add event listeners to cards and icons
    const cards = container.querySelectorAll('.card, .icon');
    cards.forEach(card => {
      card.addEventListener('click', (event) => {
        const title = event.currentTarget.getAttribute('data-title');
        const video = event.currentTarget.getAttribute('data-video');
        showModal(title, video);
      });
    });
  }

  // Function to show modal
  let videoPiP = false; // Global variable to track PiP status

  function showModal(title, video) {
    const modalElement = document.getElementById('movieModal');
    if (!modalElement) return; // Ensure modal exists

    const modal = new bootstrap.Modal(modalElement);
    const modalTitle = modalElement.querySelector('.modal-title');
    const modalVideoContainer = modalElement.querySelector('.modal-video-container');
    const modalMessage = modalElement.querySelector('.modal-message');
    const closeButton = modalElement.querySelector('.btn-close');

    if (modalTitle) modalTitle.textContent = title;

    // Clear previous video content
    modalVideoContainer.innerHTML = '';

    let videoEmbed;
    if (video) {
      let videoSource;
      if (video.includes('youtube.com') || video.includes('youtu.be')) {
        // Convert YouTube URL to embeddable format
        const videoId = getYouTubeVideoId(video);
        if (videoId) {
          videoSource = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`; // Set autoplay to 1
          videoEmbed = `
            <iframe width="100%" height="400" src="${videoSource}" 
              frameborder="0" allowfullscreen allow="autoplay; encrypted-media">
            </iframe>`;
        }
      } else {
        // Local video player
        videoSource = video;
        videoEmbed = `
          <video controls class="w-100" autoplay>
            <source src="${video}" type="video/mp4">
            Your browser does not support the video tag.
          </video>`;
      }

      modalVideoContainer.innerHTML = videoEmbed;
      modalMessage.style.display = 'none';
    } else {
      modalVideoContainer.innerHTML = '';
      modalMessage.textContent = 'Coming Soon';
      modalMessage.style.display = 'block';
    }

    modal.show();

    // Function to close modal
    function closeModal() {
      // Check if video is in PiP mode
      if (!document.pictureInPictureElement) {
        modalVideoContainer.innerHTML = ''; // Clear the video
      }
      modal.hide();
    }

    closeButton.removeEventListener('click', closeModal);
    closeButton.addEventListener('click', closeModal);

    modalElement.removeEventListener('hidden.bs.modal', closeModal);
    modalElement.addEventListener('hidden.bs.modal', closeModal);

    // Detect when user enters PiP mode
    const videoElement = modalVideoContainer.querySelector('video, iframe');
    if (videoElement) {
      videoElement.addEventListener('enterpictureinpicture', () => {
        videoPiP = true; // Set PiP status to true when entering PiP
      });

      // Detect when user leaves PiP mode
      videoElement.addEventListener('leavepictureinpicture', () => {
        videoPiP = false; // Set PiP status to false when exiting PiP
        setTimeout(() => modal.show(), 100); // Ensure modal reopens after PiP is closed
      });
    }

    // When modal is opened again, check if videoPiP is true and keep the video active
    if (videoPiP) {
      // If video was in PiP, do not clear it
      modalVideoContainer.innerHTML = videoEmbed;
    }
  }

  // Function to extract YouTube Video ID
  function getYouTubeVideoId(url) {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  // Generate cards for each genre
  // new recently
  const newrecently = document.querySelector("#new");
  const newrecentlyMovie = cards.filter((item) => item.head.includes("Recently Released"));
  createCardItem(newrecentlyMovie, newrecently);

  const topRate = document.querySelector("#rate");
  const topRated = cards.filter((item) => item.head.includes("Top_rate")).slice(0, 10);
  createCardItems(topRated, topRate);

  const action = document.querySelector("#action");
  const actionMovie = cards.filter((item) => item.head.includes("action")).slice(0, 10);
  createCardItems(actionMovie, action);

  const crime = document.querySelector("#crime");
  const crimeMovies = cards.filter((item) => item.head.includes("crime")).slice(0, 10);
  createCardItems(crimeMovies, crime);

  const horror = document.querySelector("#horror");
  const horrorMovies = cards.filter((item) => item.head.includes("horror")).slice(0, 10);
  createCardItems(horrorMovies, horror);

  const scifi = document.querySelector("#scifi");
  const scifiMovies = cards.filter((item) => item.head.includes("scifi")).slice(0, 10);
  createCardItems(scifiMovies, scifi);

  const romantic = document.querySelector("#romantic");
  const romanticMovies = cards.filter((item) => item.head.includes("romantic")).slice(0, 10);
  createCardItems(romanticMovies, romantic);

  const comedy = document.querySelector("#comedy");
  const comedyMovies = cards.filter((item) => item.head.includes("comedy")).slice(0, 10);
  createCardItems(comedyMovies, comedy);

  const animation = document.querySelector("#animation");
  const animationMovies = cards.filter((item) => item.head.includes("animation")).slice(0, 10);
  createCardItems(animationMovies, animation);

  // Reusable auto-scroll function
  function setupAutoScroll(sectionId) {
    const section = document.querySelector(`#${sectionId}`);
    const cardWidth = section.querySelector(".scroll-wrapper")?.offsetWidth;

    if (!cardWidth) return; // Exit if no cards are found

    let autoScrollInterval;

    function autoScroll() {
      section.scrollLeft += cardWidth;
      if (section.scrollLeft >= section.scrollWidth - section.clientWidth) {
        section.scrollLeft = 0;
      }
    }

    function startAutoScroll() {
      autoScrollInterval = setInterval(autoScroll, 2000);
    }

    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
    }

    section.addEventListener("mouseenter", stopAutoScroll);
    section.addEventListener("mouseleave", startAutoScroll);

    startAutoScroll();
  }

  // Call the setupAutoScroll function for each section
  setupAutoScroll("rate");
  setupAutoScroll("action");
  setupAutoScroll("crime");
  setupAutoScroll("horror");
  setupAutoScroll("scifi");
  setupAutoScroll("romantic");
  setupAutoScroll("comedy");
  setupAutoScroll("animation");
});

  
