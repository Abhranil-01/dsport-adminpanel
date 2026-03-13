import React, { useState } from "react";
import { useGenerateDescriptionMutation } from "../../Services/fetchDataFromApi";

function AIDescriptionModal({ isOpen, onClose, onUse }) {
const [prompt, setPrompt] = useState("");
const [generated, setGenerated] = useState("");

const [generateDescription, { isLoading }] =
useGenerateDescriptionMutation();

const handleGenerate = async () => {
if (!prompt) return;


try {
  const res = await generateDescription(prompt).unwrap();
  setGenerated(res.description);
} catch (err) {
  console.error(err);
}


};

const handleClear = () => {
setPrompt("");
setGenerated("");
};

if (!isOpen) return null;

return ( <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"> <div className="bg-gray-900 w-[650px] rounded-xl p-6 shadow-2xl flex flex-col gap-4 text-white border border-gray-700">


    <h2 className="text-xl font-bold text-white">
      ✨ Generate AI Description
    </h2>

    <textarea
      placeholder="Write prompt like:
Premium red football shoes for men. Lightweight, durable, for professional players..."
className="border border-gray-700 bg-gray-800 text-white p-3 rounded w-full h-28 focus:outline-none focus:ring-2 focus:ring-purple-600"
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
/>

    <div className="flex gap-3">

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        {isLoading ? "Generating..." : "Generate"}
      </button>

      <button
        onClick={handleClear}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Clear
      </button>

      <button
        onClick={onClose}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition ml-auto"
      >
        Close
      </button>

    </div>

    {generated && (
      <>
        <div className="border border-gray-700 rounded p-3 bg-gray-800 text-white max-h-40 overflow-y-auto">
          {generated}
        </div>

        <button
          onClick={() => onUse(generated)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Use This Description
        </button>
      </>
    )}
  </div>
</div>


);
}

export default AIDescriptionModal;
