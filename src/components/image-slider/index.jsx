import { useEffect, useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "./styles.css";

// Main component for the image slider
export default function ImageSlider({ url, limit = 5, page = 1 }) {
  // State variables to manage images, current slide, error messages, and loading state
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Async function to fetch images from the given URL
  async function fetchImages(getUrl) {
    try {
      setLoading(true); // Start loading

      // Fetch images with pagination parameters
      const response = await fetch(`${getUrl}?page=${page}&limit=${limit}`);
      const data = await response.json(); // Parse the response to JSON

      if (data) {
        setImages(data); // Set images if fetched successfully
        setLoading(false); // Stop loading
      }
    } catch (e) {
      setErrorMsg(e.message); // Set error message if an error occurs
      setLoading(false); // Stop loading
    }
  }

  // Function to go to the previous slide
  function handlePrevious() {
    setCurrentSlide(currentSlide === 0 ? images.length - 1 : currentSlide - 1);
  }

  // Function to go to the next slide
  function handleNext() {
    setCurrentSlide(currentSlide === images.length - 1 ? 0 : currentSlide + 1);
  }

  // Function to set the current slide directly
  function handleCurrentSlide(getCurrentIndex) {
    setCurrentSlide(getCurrentIndex);
  }

  // useEffect to fetch images when the URL changes
  useEffect(() => {
    if (url !== "") fetchImages(url);
  }, [url]);

  console.log(images); // Log images to console for debugging

  // Show loading message if data is being fetched
  if (loading) {
    return <div>Loading data ! Please wait</div>;
  }

  // Show error message if there's an error
  if (errorMsg !== null) {
    return <div>Error occured ! {errorMsg}</div>;
  }

  // Render the image slider
  return (
    <div className="container">
      {/* Previous slide button */}
      <BsArrowLeftCircleFill
        onClick={handlePrevious}
        className="arrow arrow-left"
      />
      {/* Display images */}
      {images && images.length
        ? images.map((imageItem, index) => (
            <img
              key={imageItem.id}
              alt={imageItem.download_url}
              src={imageItem.download_url}
              className={
                currentSlide === index
                  ? "current-image"
                  : "current-image hide-current-image"
              }
            />
          ))
        : null}
      {/* Next slide button */}
      <BsArrowRightCircleFill
        onClick={handleNext}
        className="arrow arrow-right"
      />
      {/* Circle indicators for each slide */}
      <span className="circle-indicators">
        {images && images.length
          ? images.map((_, index) => (
              <button
                key={index}
                className={
                  currentSlide === index
                    ? "current-indicator"
                    : "current-indicator inactive-indicator"
                }
                onClick={() => handleCurrentSlide(index)}
              ></button>
            ))
          : null}
      </span>
    </div>
  );
}
