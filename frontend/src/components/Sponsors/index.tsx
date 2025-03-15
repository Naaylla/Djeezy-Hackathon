import React from 'react';
import sponsorAImage from '../../assets/Logo_Djezzy.png';
import sponsorBImage from '../../assets/Logo_Djezzy.png';
import sponsorCImage from '../../assets/Logo_Djezzy.png';
import sponsorDImage from '../../assets/Logo_Djezzy.png';
import sponsorEImage from '../../assets/Logo_Djezzy.png';

interface Sponsor {
  name: string;
  imageUrl: string;
}

interface SponsorCarouselProps {
  sponsors: Sponsor[];
}

const SponsorCarousel: React.FC<SponsorCarouselProps> = ({ sponsors }) => {
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="p-4 md:p-12 relative overflow-hidden w-full">
      <div
        className="flex animate-scroll-left"
        style={{
          '--number-of-items': duplicatedSponsors.length,
        } as React.CSSProperties}
      >
        {duplicatedSponsors.map((sponsor, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-24 md:w-40 p-2 md:p-4 mx-1 md:mx-2 flex flex-col items-center"
          >
            <div className="rounded-full overflow-hidden w-20 h-20 md:w-32 md:h-32 mb-1 md:mb-2">
              <img
                src={sponsor.imageUrl}
                alt={`${sponsor.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm md:text-lg font-semibold text-center">
              {sponsor.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Sponsors() {
  const sponsors: Sponsor[] = [
    { name: 'Sponsor A', imageUrl: sponsorAImage },
    { name: 'Sponsor B', imageUrl: sponsorBImage },
    { name: 'Sponsor C', imageUrl: sponsorCImage },
    { name: 'Sponsor D', imageUrl: sponsorDImage },
    { name: 'Sponsor E', imageUrl: sponsorEImage },
  ];

  return (
    <div className="container mx-auto py-12 md:py-24">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">
        OUR SPONSORS
      </h1>
      <SponsorCarousel sponsors={sponsors} />
    </div>
  );
}