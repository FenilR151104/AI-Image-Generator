import React from 'react'
import './ImageGenerator.css'
import images from '../Assets/images.jpg'  
import { useState, useRef } from 'react' 

const ImageGenerator = () => {

    const [image_url, setImage_url] = useState("/");
    let inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const imageGenerator = async () => {
        if(inputRef.current.value === "") return;

        setLoading(true);
        try{
            const response = await fetch("https://api.openai.com/v1/images/generations", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    "User-Agent": "Chrome", 
                },
                body: JSON.stringify({
                    prompt: inputRef.current.value,
                    n:1,
                    size: "512x512",
                }),
            }
        );
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        if(!data.data || !data.data[0]?.url){
            throw new Error("Invalid response fromat");
        }
        setImage_url(data.data[0].url);
        } catch (error) {
            console.error("Generation failed:", error);
            setImage_url("/error-image.jpg"); 
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className='ai-image-generator'>
      <div className="header">AI image <span>generator</span></div>
      <div className="img-loading">
        <div className="image"><img src={image_url==="/"?images:image_url} alt="" /></div>
        <div className="loading">
            <div className={loading?"loading-bar-full":"loading-bar"}></div>
            <div className={loading?"loading-text":"display-none"}>Loading....</div>
        </div>
      </div>
      <div className="search-box">
        <input type="text" ref={inputRef} className='search-input' placeholder='Search the image that brings you to next generationn!'/>
        <div className="generate-btn" onClick={()=>{imageGenerator()}}>Generate</div>
      </div>
    </div>
  )
}

export default ImageGenerator
