import model_pic from "../../assets/model_pic.png";

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
  {
    name: 'The Johnsons',
    description: "Facing eviction, this family needs help to cover their rent and basic necessities.",
    progress: 20,
  },
  {
    name: 'The Garcia',
    description: "Unexpected medical bills have left this family struggling to make ends meet.",
    progress: 70,
  },
  {
    name: 'The Lee',
    description: "A family of four facing food insecurity after a job loss.",
    progress: 50,
  },
  {
    name: 'The Brown',
    description: "This family is working hard to rebuild after a natural disaster.",
    progress: 90,
  },
  {
    name: 'The Davis',
    description: "Struggling to provide for their children, this family needs support with educational expenses.",
    progress: 30,
  },
  {
    name: 'The Wilson',
    description: "This family is seeking assistance to overcome financial hardship and achieve stability.",
    progress: 10,
  },
];

export default function DonatePage() {
  return (
    <div id="DonatePage" className="py-10" style={{ backgroundColor: '#FEF9E1' }}>
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">DONATIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-xl shadow-md p-6 w-full max-w-md w-[400px] flex flex-col h-full"
              style={{ backgroundColor: '#C14600' }}
            >
              <div className="flex-grow">
                <img
                  src={model_pic}
                  alt={card.name}
                  className="w-48 h-48 mx-auto mb-4 rounded-xl"
                />
                <h3 className="text-xl font-semibold mb-2 text-white">{card.name}</h3>
                <p className="text-gray-200 mb-4">{card.description}</p>
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 rounded-full h-4 flex-grow mr-2">
                    <div
                      className="rounded-full h-4"
                      style={{ width: `${card.progress}%`, backgroundColor: '#FF9D23' }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">{card.progress}%</p>
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
          ))}
        </div>
      </div>
    </div>
  );
}