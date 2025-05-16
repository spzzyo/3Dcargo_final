"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ResultData {
  [key: string]: any;
}

export default function ResultsPage() {
 

  return (
    <div className="flex-1">
          <iframe
            // src={`/unityy/index.html?v=${Date.now()}`} 
            src="untiycheckkk/index.html" 
            className="w-full h-full border-none rounded-2xl"
            title="Unity WebGL Game"
          />
        </div>
  );
}
