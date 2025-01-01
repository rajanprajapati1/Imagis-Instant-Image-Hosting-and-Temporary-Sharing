export const TransformApiRes = (data) => {
  console.log(data , "data api")
    try {
      const ImagesObject = {
        key: data.title, // Extract title as 'key'
        imageUrl: {
          medium: data.medium ? data.medium.url : null, // Ensure medium exists
          thumb: data.thumb ? data.thumb.url : null, // Ensure thumb exists
          display: data.display_url, // Display URL should always exist
        }
      };
  
      return ImagesObject; // Return the transformed object
    } catch (error) {
      // Log the error and return a response indicating the failure
      console.error('Error transforming API response:', error);
      return { error: 'Internal Server Error' }; // Return a generic error response
    }
  };
  