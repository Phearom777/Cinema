import { cards } from './data.js';

document.addEventListener("DOMContentLoaded", () => {
  // Function to create card items
  function createCardItems(items, container) {
    if (!container) return; // Check if container is null
    items.forEach((item) => {
      const cardItems = `
        <div class="col-6 col-md-4 col-lg-3 col-xl-3" data-aos="zoom-in" data-aos-duration="800">
          <div class="card" style="cursor: pointer;" data-title="${item.title}" data-video="${item.video || ''}">
            <img src="${item.img}" alt="" />
            <div class="content">
              <div class="icon" data-title="${item.title}" data-video="${item.video || ''}">
                <i class="bi bi-play-circle"></i>
              </div>
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
// function showModal(title, video) {
//   const modalElement = document.getElementById('movieModal');
//   if (!modalElement) return; // Ensure modal exists

//   const modal = new bootstrap.Modal(modalElement);
//   const modalTitle = modalElement.querySelector('.modal-title');
//   const modalVideo = modalElement.querySelector('video');
//   const modalMessage = modalElement.querySelector('.modal-message');
//   const closeButton = modalElement.querySelector('.btn-close');

//   if (modalTitle) modalTitle.textContent = title;

//   if (modalVideo) {
//       if (modalVideo.src !== video) {
//           modalVideo.src = video || '';
//           modalVideo.load();
//       }

//       if (video) {
//           modalVideo.style.display = 'block';
//           if (modalMessage) modalMessage.style.display = 'none';

//           modalVideo.onloadeddata = () => {
//               modalVideo.play().catch(error => console.warn('Video play error:', error));
//           };
//       } else {
//           modalVideo.style.display = 'none';
//           if (modalMessage) {
//               modalMessage.textContent = 'Video will be uploaded soon.';
//               modalMessage.style.display = 'block';
//           }
//       }
//   }

//   modal.show();

//   // Function to close the modal properly without affecting PiP
//   function closeModal() {
//       if (modalVideo) {
//           // Do NOT pause video if it's in PiP mode
//           if (!document.pictureInPictureElement) {
//               modalVideo.pause();
//               modalVideo.currentTime = 0;
//           }
//       }
//       modal.hide(); // Only hide the modal
//   }

//   // Ensure event listener is added only once
//   closeButton.removeEventListener('click', closeModal);
//   closeButton.addEventListener('click', closeModal);

//   // Stop video when modal is hidden, unless in PiP mode
//   modalElement.removeEventListener('hidden.bs.modal', closeModal);
//   modalElement.addEventListener('hidden.bs.modal', closeModal);

//   // Detect when user exits PiP mode and bring back the modal
//   modalVideo.removeEventListener('leavepictureinpicture', () => {});
//   modalVideo.addEventListener('leavepictureinpicture', () => {
//       console.log('Exited Picture-in-Picture mode');
//       setTimeout(() => modal.show(), 100);
//   });
// }

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
    modalMessage.textContent = 'Coming soon.';
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


  // action & adventure
  const action = document.querySelector("#action");
  const adventure = cards.filter((item) => item.head.includes("action"));
  createCardItems(adventure, action);

  // Crime
  const crime = document.querySelector("#crime");
  const crimeItems = cards.filter((item) => item.head.includes("crime"));
  createCardItems(crimeItems, crime);

  // Sci-fi
  const scifi = document.querySelector("#scifi");
  const sciFiItems = cards.filter((item) => item.head.includes("scifi"));
  createCardItems(sciFiItems, scifi);

  // Horror
  const horror = document.querySelector("#horror");
  const horrorItems = cards.filter((item) => item.head.includes("horror"));
  createCardItems(horrorItems, horror);

  // Romantic
  const romantic = document.querySelector("#romantic");
  const romanticItems = cards.filter((item) => item.head.includes("romantic"));
  createCardItems(romanticItems, romantic);

  // Comedy
  const comedy = document.querySelector("#comedy");
  const comedyItems = cards.filter((item) => item.head.includes("comedy"));
  createCardItems(comedyItems, comedy);

  // Animation
  const animation = document.querySelector("#animation");
  const animationItems = cards.filter((item) => item.head.includes("animation"));
  createCardItems(animationItems, animation);
});