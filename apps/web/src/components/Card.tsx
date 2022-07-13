import React, { FC } from 'react';
import Image from 'next/image';

interface CardProps {
  children: JSX.Element;
  imageSrc?: string;
  imageAlt?: string;
  isImageAtTop?: boolean;
}

const Card: FC<CardProps> = ({
  children,
  imageSrc,
  imageAlt,
  isImageAtTop,
}) => {
  return (
    <div
      className={`bg-gray-300 ${
        isImageAtTop ? 'm-10' : 'p-10 m-10'
      } rounded-3xl shadow-2xl`}
    >
      {isImageAtTop && imageSrc && (
        <>
          <div className="relative overflow-hidden h-56 bg-gray-700 rounded-tr-3xl rounded-tl-3xl shadow-2xl mb-7">
            <Image
              className="object-fill"
              src={imageSrc}
              alt={imageAlt || 'alt'}
              layout="fill"
            />
          </div>
          <div className="p-2">{children}</div>
        </>
      )}
      {!isImageAtTop && children}
    </div>
  );
};

export default Card;
