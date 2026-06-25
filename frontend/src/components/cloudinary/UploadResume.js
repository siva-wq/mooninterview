import {CLOUDINARY_URL, UPLOAD_PRESET} from './URL';
const UploadResume = async (file, id) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  formData.append("folder", `resumes/${id}`);

  formData.append("public_id", "resume");

  

  const response = await fetch(
    CLOUDINARY_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  

  return data;
};

export default UploadResume;