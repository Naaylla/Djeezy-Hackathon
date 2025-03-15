import { useState } from 'react';
import model_pic from "../../assets/model_pic.png";

export default function Donation() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handlePrev = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1));
  };

  const cards = [
    {
      name: 'The Ahmeds',
      description: "A struggling family of five. Father lost his job. Mother's income isn't enough.",
    },
    {
      name: 'The Adams',
      description: 'A middle-class family drowning in debt after a medical emergency, now struggling to keep their home.',
    },
    {
      name: 'The Hachimi',
      description: 'A single mother of three, barely affording rent and food.',
    },
  ];

  return (
    <div id="Donate" className=" py-10" style={{backgroundColor:'#FEF9E1'}}>
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">DONATIONS</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md p-6 w-full max-w-sm h-[450px] w-[350px] ${
                index === currentCardIndex ? 'block' : 'hidden md:block'
              }`} style={{backgroundColor : "C14600"}}
            >
              <img
                src={model_pic}
                alt={card.name}
                className="w-24 h-24 mx-auto mb-4 rounded-xl"
              />
              <h3 className="text-xl font-semibold mb-2">{card.name}</h3>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Donate
              </button>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-2"
            onClick={handlePrev}
          >
            &larr;
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-2"
            onClick={handleNext}
          >
            &rarr;
          </button>
        </div>

        <div className="mt-8">
          <button className="text-blue-500 hover:underline">See more</button>
        </div>
      </div>
    </div>
  );
}