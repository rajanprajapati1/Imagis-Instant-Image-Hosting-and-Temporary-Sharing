export async function uploadImageToImgBB(imageFile , expiry = 86400) {
    const url = `https://api.imgbb.com/1/upload?expiration=${expiry}&key=${process.env.NEXT_PUBLIC_BB_API_KEY}`;
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }
  
      const result = await response.json();
      return result; 
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
  