const Staff = () => {
  const staff = [
    {
      name: "Bob Wilson",
      role: "Owner & Lead Mechanic",
      bio: "With over 25 years of experience, Bob has been the heart and soul of Bob's Garage since founding it in 1998. His expertise in European and domestic vehicles has earned him a reputation for excellence in the community.",
      image: "/staff/bob.jpg"
    },
    {
      name: "Mike Thompson",
      role: "Senior Mechanic",
      bio: "Mike specializes in engine diagnostics and complex repairs. His 15 years of experience and certification in advanced automotive technology make him an invaluable member of our team.",
      image: "/staff/mechanic1.jpg"
    },
    {
      name: "David Chen",
      role: "Mechanic",
      bio: "David joined us 5 years ago and has quickly become known for his expertise in hybrid and electric vehicles. His attention to detail ensures every vehicle gets the care it deserves.",
      image: "/staff/mechanic2.jpg"
    },
    {
      name: "Sarah Johnson",
      role: "Office Manager",
      bio: "Sarah keeps our garage running smoothly, handling scheduling, customer service, and administrative tasks. Her friendly demeanor and organizational skills make every customer feel welcomed.",
      image: "/staff/admin.jpg"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-4 transition-colors duration-200">
          Meet Our Team
        </h1>
        <p className="text-lg text-[#4c566a] dark:text-[#81a1c1] transition-colors duration-200">
          The skilled professionals behind Bob's Garage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {staff.map((member) => (
          <div 
            key={member.name} 
            className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-lg overflow-hidden 
                     hover:shadow-xl transform transition-all duration-200 hover:scale-102"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover hover:opacity-90 transition-opacity duration-200"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x300?text=Team+Member';
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-2 transition-colors duration-200">
                {member.name}
              </h3>
              <p className="text-[#8fbcbb] dark:text-[#88c0d0] mb-4 transition-colors duration-200">
                {member.role}
              </p>
              <p className="text-[#4c566a] dark:text-[#81a1c1] transition-colors duration-200">
                {member.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staff;
