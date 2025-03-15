import { useState } from 'react';
import model_pic from "../../assets/model_pic.png";
import { Link } from 'react-router-dom';

export default function Fund() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handlePrev = () => {
    setCurrentCardIndex((prevIndex) => {
      let newIndex = prevIndex - 1;
      if (newIndex < 0) newIndex = cards.length - 1;
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => {
      let newIndex = prevIndex + 1;
      if (newIndex >= cards.length) newIndex = 0;
      return newIndex;
    });
  };

  const cards = [
    {
      name: 'The Ahmeds',
      description: "A struggling family of five. Father lost his job. Mother's income isn't enough.",
      progress: 40,
    },
    {
      name: 'The Adams',
      description: 'A middle-class family drowning in debt after a medical emergency, now struggling to keep their home.',
      progress: 60,
    },
    {
      name: 'The Hachimi',
      description: 'A single mother of three, barely affording rent and food.',
      progress: 80,
    },
  ];

  const getCardIndex = (offset: number) => {
    let newIndex = currentCardIndex + offset;
    if (newIndex < 0) newIndex = cards.length - 1;
    if (newIndex >= cards.length) newIndex = 0;
    return newIndex;
  };

  return (
    <div id="Donate" className="py-10" style={{ backgroundColor: '#FEF9E1' }}>
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">FUND RAISING</h2>
        <div className="flex justify-center items-center gap-8 relative">
          <button
            className="absolute left-0 bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-2"
            onClick={handlePrev}
            style={{ left: '-50px' }}
          >
            &larr;
          </button>
          {[getCardIndex(-1), currentCardIndex, getCardIndex(1)].map((index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md p-6 w-full max-w-md w-[400px] transition-transform duration-300 ${
                index === currentCardIndex
                  ? 'scale-100 z-10'
                  : 'scale-95 md:scale-100 z-0'
              }`}
              style={{
                backgroundColor: '#C14600',
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <img
                    src={model_pic}
                    alt={cards[index].name}
                    className="w-48 h-48 mx-auto mb-4 rounded-xl"
                  />
                  <h3 className="text-xl font-semibold mb-2 text-white">{cards[index].name}</h3>
                  <p className="text-gray-200 mb-4">{cards[index].description}</p>
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-200 rounded-full h-4 flex-grow mr-2">
                      <div
                        className="rounded-full h-4"
                        style={{ width: `${cards[index].progress}%`, backgroundColor: '#FF9D23' }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400">{cards[index].progress}%</p>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    className="bg-[#FF9D23] hover:bg-[#E08A1F] text-white font-bold py-2 px-4 rounded"
                  >
                    Donate
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            className="absolute right-0 bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-2"
            onClick={handleNext}
            style={{ right: '-50px' }}
          >
            &rarr;
          </button>
        </div>
        <div className="mt-8">
          <Link to="/Fund" className="text-black hover:underline">See more</Link>
        </div>
      </div>
    </div>
  );
}