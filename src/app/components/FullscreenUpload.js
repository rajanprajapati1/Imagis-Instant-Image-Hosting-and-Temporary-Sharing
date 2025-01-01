'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, Check ,ServerCrash ,LoaderCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';
import { uploadImageToImgBB } from '../libs/BBimage'
import { TransformApiRes } from '../utils/TransformApiRes'
import UserInfoDisplay from './UserInfo';

export default function FullscreenUpload() {
  const [files, setFiles] = useState([])
  const timeoutRef = useRef(null)
    const [userInfo, setUserInfo] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [ToggleMenu,setToggleMenu] = useState(false)
 
  useEffect(() => {
    const initializeUser = async () => {
      try {
        let userId = new URLSearchParams(window.location.search).get("userId");

        // Generate a new userId if not present
        if (!userId) {
          userId = uuidv4();
          const newUrl = `${window.location.origin}?userId=${userId}`;
          window.history.replaceState(null, "", newUrl);

          // Save new user with empty images array
          const response = await fetch(`/api/imagis`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, images: [] }),
          });

          if (!response.ok) {
            setError(`Error saving user to Redis: ${response.status}`);
            setLoading(false);
            return;
          }
        }

        // Fetch user information and images
        FetchUserImages();
      } catch (err) {
        console.error("Error during initialization:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

 
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'idle' ,
      }))
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    noClick: true,
  })

  // const handleUpload = async (index) => {
  //   const fileToUpload = files[index]
  //   if (fileToUpload.status === 'uploading') return

  //   setFiles(prevFiles => 
  //     prevFiles.map((f, i) => i === index ? { ...f, status: 'uploading' } : f)
  //   )

  //   const formData = new FormData()
  //   formData.append('file', fileToUpload.file)

  //   try {
  //     const result = await uploadImage(formData)
  //     if (result.success) {
  //       setFiles(prevFiles => 
  //         prevFiles.map((f, i) => i === index ? { ...f, status: 'success' } : f)
  //       )
  //     } else {
  //       throw new Error('Upload failed')
  //     }
  //   } catch (error) {
  //     setFiles(prevFiles => 
  //       prevFiles.map((f, i) => i === index ? { ...f, status: 'error' } : f)
  //     )
  //   }
  // }


  const handleUpload = async (index) => {
    const fileToUpload = files[index];
    if (fileToUpload.status === "uploading") return;
  
    setFiles((prevFiles) =>
      prevFiles.map((f, i) => (i === index ? { ...f, status: "uploading" } : f))
    );
  
    const formData = new FormData();
    const userId = new URLSearchParams(window.location.search).get("userId");
    formData.append("userId", userId);
    formData.append("file", fileToUpload.file);
  
    try {
      const { data, status, success } = await uploadImageToImgBB(formData.get("file"));
      const res = TransformApiRes(data);
      
      // Check if the transformation is successful before sending
      if (res && res.imageUrl) {
        const result = await fetch("/api/imagis/upload", {
          method: "POST",
          body: JSON.stringify({
            userId,
            imageUrl: res?.imageUrl,
            key : res?.key
          }),
        });
  
        if (result.ok) {
          const response = await result.json();
          FetchUserImages()
          setFiles((prevFiles) =>
            prevFiles.map((f, i) =>
              i === index ? { ...f, status: "success", uploadedUrl: response.updatedImages } : f
            )
          );
        } else {
          throw new Error("Upload failed");
        }
      }
    } catch (error) {
      setFiles((prevFiles) =>
        prevFiles.map((f, i) => (i === index ? { ...f, status: "error" } : f))
      );
    }
  };
  
  
  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  } 
  
  const FetchUserImages = async()=>{
    let userId = new URLSearchParams(window.location.search).get("userId");
    try {
      const userResponse = await fetch(`/api/imagis?userId=${userId}`);
      if (!userResponse.ok) {
        setError(`Error fetching user data: ${userResponse.status}`);
        setLoading(false);
        return;
      }
      const userData = await userResponse.json();
      setUserInfo(userData);
    } catch (error) {
      return error ;
    }
  }

  const ToggleFun = ()=> {
    setToggleMenu(!ToggleMenu)
  }
  return (
    <div 
      {...getRootProps()} 
      className="fixed inset-0 bg-gray-100 overflow-auto p-4"
    >
      <UserInfoDisplay userInfo={userInfo} isOpen={ToggleMenu} onClose={ToggleFun}/>
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
          <p className="text-white text-2xl font-bold">Drop the files here ...</p>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2" onClick={ToggleFun}><ServerCrash className='text-teal-500' /> Imagis</h1>
        <p className="text-center mb-8">Drag and drop images anywhere on this page, or click the button below to select files</p>
        <button
          onClick={() => document.querySelector('input')?.click()}
          className="block mx-auto mb-8 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Select Files
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={file.preview} className="relative group border border-gray-200 rounded-lg">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <img
                  src={file?.preview}
                  alt="Preview"
                  className='rounded-lg'
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {file.status === 'idle' && (
                  <button
                    onClick={() => handleUpload(index)}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <Upload size={24} />
                  </button>
                )}
                {file.status === 'uploading' && (
                  <div className="animate-spin rounded-full text-white">
                    <LoaderCircle size={36} />
                  </div>
                )}
                {file.status === 'success' && (
                  <div className="p-2 bg-green-500 text-white rounded-full">
                    <Check size={24} />
                  </div>
                )}
                {file.status === 'error' && (
                  <p className="text-red-500 font-bold">Upload failed</p>
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

