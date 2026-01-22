import Image from "next/image";
import React from "react";

interface NovenaInfoCardProps {
  color: string;
  border: string;
  rounded: string;
  icon: string;
  title: string;
  description: string;
  celebration: string;
  experience: string;
  textColor: string;
  image?: string;
}

export const NovenaInfoCard: React.FC<NovenaInfoCardProps> = ({
  color,
  border,
  rounded,
  icon,
  title,
  description,
  celebration,
  experience,
  textColor,
  image,
}) => (
  <div className={`mb-4 p-4 ${color} ${border} ${rounded}`}>
    {image && (
      <div className="w-full flex justify-center mb-3">
        <Image
          src={image}
          alt={title}
          height={400}
          width={636}
          className="rounded-md object-cover max-h-[400px] w-full object-top"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
        />
      </div>
    )}
    <h3 className={`font-semibold mb-2 ${textColor}`}>{icon} {title}</h3>
    <p className={`${textColor} text-sm`}>
      {description}
    </p>
    <h2 className={`${textColor} m-2`}>{celebration}</h2>
    <p className={`${textColor} text-sm`}>
      {experience}
    </p>
  </div>
);
