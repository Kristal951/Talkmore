import React from 'react';

const SearchResultCard = ({ post }) => {
  return (
    <div className="w-full h-[130px] hover:shadow-lg border border-gray-300 rounded-lg p-2 cursor-pointer transition-all duration-200 ease-in-out transform hover:-translate-y-1 bg-white">
      {/* Creator/Owner Section */}
      <div className="flex items-center gap-3 mb-3">
      <div className="flex">
          {/* <span>.</span> */}
          <h2>Creator : </h2>
        </div>
        <img
          src={post.creator?.imgURL || 'https://via.placeholder.com/40'}
          alt={`${post.creator?.name}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="text-sm font-medium text-gray-800">{post.creator?.name || 'Unknown'}</h3>
          <p className="text-xs text-gray-500">{post.creator?.tag || '@unknown'}</p>
        </div>
        
      </div>

      {/* Post Title */}
      <h2 className="text-lg font-semibold text-gray-800 truncate">{post.caption}</h2>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        {post.tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Optional: Additional Info */}
      <p className="text-sm text-gray-500 mt-3">
        {post.description?.slice(0, 100)} {post.description?.length > 100 ? '...' : ''}
      </p>
    </div>
  );
};

export default SearchResultCard;
