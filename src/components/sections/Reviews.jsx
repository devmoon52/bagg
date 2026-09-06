import { Star } from "lucide-react";
import { reviews } from "../../data/listData";
import { getAvatarWord } from "../../utils/services";

const Reviews = () => {
  const sliceLength = Math.floor(reviews.length / 3);

  const firstOne = reviews.slice(0, sliceLength);
  const secondOne = reviews.slice(sliceLength, sliceLength * 2);
  const lastOne = reviews.slice(sliceLength * 2, reviews.length);

  return (
    <section className="md:px-3 px-1.5 bg-gray-200 py-8">
      {/* wrapper */}
      <div className="max-w-7xl mx-auto space-y-3">
        <div>
          <h2 className="sm:text-2xl text-xl font-semibold text-center">
            Customer Reviews
          </h2>
        </div>

        <div className="space-y-3 overflow-hidden relative reviews-container">
          {/* first row */}
          <div className="overflow-hidden">
            <ul className="flex w-max animate-review-left">
              {[...firstOne, ...firstOne].map((review, i) => (
                <li
                  key={i}
                  className="border bg-white mr-3 md:basis-80 basis-65 shrink-0 px-3 py-2.5 rounded-md border-gray-300 space-y-1 hover:border-peach-dark hover:shadow-[2px_2px_20px_0px_#f8795f77]"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rate) => (
                      <Star
                        key={rate}
                        aria-hidden="true"
                        color="#f8785f"
                        fill={rate <= review.rating ? "#f8785f" : "none"}
                        size={18}
                        strokeWidth={1.6}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {review.reviewMessage}
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="h-10 w-10 rounded-full flex justify-center items-center font-bold bg-linear-90 from-peach-ultra to-peach-soft">
                      {getAvatarWord(review.user)}
                    </div>
                    <h3 className="font-medium">{review.user}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* second row */}
          <div className="overflow-hidden">
            <ul className="flex w-max animate-review-right">
              {[...secondOne, ...secondOne].map((review, i) => (
                <li
                  key={i}
                  className="border bg-white mr-3 md:basis-80 basis-65 shrink-0 px-3 py-2.5 rounded-md border-gray-300 space-y-1 hover:border-peach-dark hover:shadow-[2px_2px_20px_0px_#f8795f77]"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rate) => (
                      <Star
                        key={rate}
                        aria-hidden="true"
                        color="#f8785f"
                        fill={rate <= review.rating ? "#f8785f" : "none"}
                        size={18}
                        strokeWidth={1.6}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {review.reviewMessage}
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="h-10 w-10 rounded-full flex justify-center items-center font-bold bg-linear-90 from-peach-ultra to-peach-soft">
                      {getAvatarWord(review.user)}
                    </div>
                    <h3 className="font-medium">{review.user}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* last row */}
          <div className="overflow-hidden">
            <ul className="flex w-max animate-review-left">
              {[...lastOne, ...lastOne].map((review, i) => (
                <li
                  key={i}
                  className="border bg-white mr-3 md:basis-80 basis-65 shrink-0 px-3 py-2.5 rounded-md border-gray-300 space-y-1 hover:border-peach-dark hover:shadow-[2px_2px_20px_0px_#f8795f77]"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rate) => (
                      <Star
                        key={rate}
                        aria-hidden="true"
                        color="#f8785f"
                        fill={rate <= review.rating ? "#f8785f" : "none"}
                        size={18}
                        strokeWidth={1.6}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {review.reviewMessage}
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="h-10 w-10 rounded-full flex justify-center items-center font-bold bg-linear-90 from-peach-ultra to-peach-soft">
                      {getAvatarWord(review.user)}
                    </div>
                    <h3 className="font-medium">{review.user}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
