function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === 'grid'
            ? 'bg-[#8fbcbb] text-[#2e3440] dark:bg-[#88c0d0] dark:text-[#2e3440]'
            : 'text-[#4c566a] dark:text-[#81a1c1] hover:bg-[#d8dee9] dark:hover:bg-[#434c5e] hover:text-[#8fbcbb] dark:hover:text-[#88c0d0]'
        } hover:shadow-md active:scale-95`}
        title="Grid View"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === 'list'
            ? 'bg-[#8fbcbb] text-[#2e3440] dark:bg-[#88c0d0] dark:text-[#2e3440]'
            : 'text-[#4c566a] dark:text-[#81a1c1] hover:bg-[#d8dee9] dark:hover:bg-[#434c5e] hover:text-[#8fbcbb] dark:hover:text-[#88c0d0]'
        } hover:shadow-md active:scale-95`}
        title="List View"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h4M12 6h8M4 12h4M12 12h8M4 18h4M12 18h8"
          />
        </svg>
      </button>
    </div>
  );
}

export default ViewToggle;
