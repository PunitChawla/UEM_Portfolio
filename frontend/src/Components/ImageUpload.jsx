import React, { useState } from "react";
import axios from "axios";

const ImageUpload = ({ setProfilePicture }) => {
    const [imgUrl, setImage] = useState(null);
    const [url, setUrl] = useState("");

    const uploadImage = async () => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "uem29032005arya");
        formData.append("cloud_name", "dfua9bj2q");

        try {
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dfua9bj2q/image/upload",
                formData
            );

            const imgUrl = res.data.url;
            console.log(imageUrl);
            setUrl(imgUrl);
            setProfilePicture(imageUrl); // Update profile picture in form data
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={uploadImage}>Upload</button>
            {url && <img src={url} alt="Uploaded" width="100" />}
        </div>
    );
};

export default ImageUpload;
