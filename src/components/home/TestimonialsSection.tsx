
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "ScoutAI completely transformed our recruitment process. We found three talented players who perfectly match our team's playing style and culture.",
    name: "Marco Silva",
    role: "Technical Director, FC Barcelona Academy",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "As a young player trying to break into professional football, ScoutAI gave me visibility to clubs that I never would have connected with otherwise.",
    name: "Sophia Rodriguez",
    role: "Professional Player, Women's Super League",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "The AI matching technology is incredibly accurate. It recommended players who not only had the right skills but also fit our team's philosophy and culture.",
    name: "Thomas Weber",
    role: "Head Scout, Bayern Munich",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600">
            Hear from players, clubs, and scouts who have found success with our platform.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
            <div className="absolute top-6 left-6 md:top-10 md:left-10">
              <Quote className="h-12 w-12 text-primary/10" />
            </div>
            
            <div className="pt-12 pb-4 px-4">
              <p className="text-xl md:text-2xl text-gray-800 italic relative z-10">
                "{testimonials[currentIndex].quote}"
              </p>
              
              <div className="mt-8 flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="absolute bottom-6 right-6 flex space-x-2">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
