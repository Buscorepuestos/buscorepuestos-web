import Image from 'next/image';
import Star from '../svg/star';

interface ReviewProps {
    author_name: string;
    profile_photo_url: string;
    rating: number;
    text: string;
    relative_time_description: string;
}

export default function CardReview({ author_name, profile_photo_url, rating, text, relative_time_description }: ReviewProps) {
    return (
        <div className="w-[300px] md:w-[350px] h-[220px] bg-white p-6 rounded-3xl shadow-md flex flex-col justify-between mx-4 border border-gray-100">
            <div>
                <div className="flex items-center gap-4 mb-3">
                    <Image 
                        src={profile_photo_url} 
                        alt={author_name} 
                        width={40} 
                        height={40} 
                        className="rounded-full" 
                    />
                    <div>
                        <p className="font-bold text-dark-grey text-sm">{author_name}</p>
                        <p className="text-xs text-gray-400">{relative_time_description}</p>
                    </div>
                </div>
                <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} isFilled={i < rating} className="w-4 h-4" />
                    ))}
                </div>
                <p className="text-sm text-gray-600 line-clamp-4 font-tertiary-font">
                    {text}
                </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <Image src="/google-logo.png" alt="Google" width={15} height={15} />
                <span className="text-xs text-gray-500 font-semibold">Publicado en Google</span>
            </div>
        </div>
    );
}