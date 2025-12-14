"use client";

// Placeholder images - replace with actual Drive URLs later
const examplePortraits = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=500&fit=crop",
    style: "Renaissance Royal",
    petName: "Max",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=500&fit=crop",
    style: "NASA Astronaut",
    petName: "Luna",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=500&fit=crop",
    style: "Disney Pixar",
    petName: "Charlie",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=500&fit=crop",
    style: "Marvel Superhero",
    petName: "Bella",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=500&fit=crop",
    style: "Victorian Gentleman",
    petName: "Oliver",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=500&fit=crop",
    style: "Cyberpunk",
    petName: "Milo",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=500&fit=crop",
    style: "Cowboy",
    petName: "Daisy",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=500&fit=crop",
    style: "Pirate Captain",
    petName: "Rocky",
  },
];

export default function PortraitGallery() {
  return (
    <section id="examples" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See the Magic ✨
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real pets transformed into legendary portraits. Your pet could be
            next!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {examplePortraits.map((portrait) => (
            <div
              key={portrait.id}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="aspect-[3/4] relative bg-gray-200 overflow-hidden">
                <img
                  src={portrait.url}
                  alt={`${portrait.petName} as ${portrait.style}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if image fails
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23FFA500' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='24' font-family='Arial'%3E${encodeURIComponent(portrait.petName)}%3C/text%3E%3C/svg%3E`;
                    target.onerror = null; // Prevent infinite loop
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold text-sm">
                    {portrait.petName}
                  </p>
                  <p className="text-white/90 text-xs">{portrait.style}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            <strong>Note:</strong> These are placeholder images. Replace with
            actual AI-generated portraits from your Drive folder.
          </p>
          <a
            href="https://drive.google.com/drive/folders/1xZfKk5p8L9qW7vT2mN3bR5jH6gT8uY9c?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700 font-medium underline"
          >
            View Example Images on Google Drive →
          </a>
        </div>
      </div>
    </section>
  );
}

