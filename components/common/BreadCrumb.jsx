import React from "react";
import { useRouter } from "next/router";

export default function BreadCrumb() {
  const router = useRouter();
  const pathname = router.asPath;

  // Function to convert pathname to an array of segments
  const convertPathnameToArray = (pathname) => {
    return pathname
      .split("/")
      .filter((param) => param.trim() !== "") // Remove empty segments
      .map((param) => param); // Map segments to an array
  };

  // Handle breadcrumb clicks
  const handleClick = (index) => {
    if (index === -1) {
      router.push("/"); // Navigate to the homepage
      return;
    }
    const targetPath = `/${convertPathnameToArray(pathname)
      .slice(0, index + 1)
      .join("/")}`;
    if (targetPath === "/product") return;
    router.push(targetPath);
  };

  const pathSegments = convertPathnameToArray(pathname); // Get an array of path segments

  return (
    <div className="flex bg-white text-gray-600 text-xs py-2">
      {/* Home breadcrumb */}
      <div onClick={() => handleClick(-1)} className="mx-2 cursor-pointer">
        HOME
      </div>
      {/* Dynamic breadcrumbs */}
      {pathSegments.map((param, index) => (
        <React.Fragment key={index}>
          <div>/</div>
          <div
            onClick={() => handleClick(index)}
            className="mx-2 cursor-pointer"
          >
            {param.toUpperCase().replace(/-/g, " ")}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
