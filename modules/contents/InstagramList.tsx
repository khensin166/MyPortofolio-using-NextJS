"use client";

import InstagramCard from "./InstagramCard";

interface InstagramListProps {
  posts: any[];
}

const InstagramList = ({ posts }: InstagramListProps) => {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid">
          <InstagramCard {...post} />
        </div>
      ))}
    </div>
  );
};

export default InstagramList;
