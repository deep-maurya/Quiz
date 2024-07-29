import React, { useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import * as tf from '@tensorflow/tfjs';

const Question = ({ question, onAnswerSelect, onAlert }) => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const webcamRef = useRef(null);
  
  useEffect(() => {
    const loadModel = async () => {
      const URL = "https://teachablemachine.withgoogle.com/models/wqNHDVGbv/";
      const modelURL = `${URL}model.json`;
      const metadataURL = `${URL}metadata.json`;

      // Load the model and metadata
      modelRef.current = await tmImage.load(modelURL, metadataURL);

      // Set up the webcam
      const webcam = new tmImage.Webcam(224, 224, true); // Width, height, and flip
      await webcam.setup(); // Request access to the webcam
      webcamRef.current = webcam;

      // Check if the video element is available
      if (videoRef.current) {
        videoRef.current.srcObject = webcam.webcam.stream;
      }

      // Start the webcam
      await webcam.play();
      predictGaze(); // Start gaze prediction
    };

    const predictGaze = async () => {
      if (!modelRef.current || !webcamRef.current) return;

      // Get the image tensor from the webcam
      const imageTensor = tf.browser.fromPixels(webcamRef.current.canvas);
      const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]); // Resize to model input size

      // Normalize the image data
      const normalizedImage = resizedImage.div(255.0).expandDims(0); // Scale to [0, 1] and add batch dimension

      // Perform prediction using the normalized tensor
      const prediction = await modelRef.current.predict(normalizedImage);

      // Ensure that predictions return valid data
      if (!prediction || prediction.length === 0) {
        console.error("No predictions made.");
        return;
      }

      // Check the predictions for looking away
      const lookingAway = prediction.some(p => p.className === "looking away" && p.probability > 0.5);

      if (lookingAway) {
        onAlert();
      }

      // Clean up the tensors to avoid memory leaks
      tf.dispose([imageTensor, resizedImage, normalizedImage]);

      requestAnimationFrame(predictGaze); // Continuously predict gaze
    };

    loadModel();

    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop(); // Stop webcam on cleanup
      }
    };
  }, [onAlert]);

  return (
    <div>
      <h3>{question.question}</h3>
      {question.options.map((option, index) => (
        <button key={index} onClick={() => onAnswerSelect(index)}>
          {option}
        </button>
      ))}
      <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline />
    </div>
  );
};

export default Question;
