import { ClipLoader, PuffLoader } from "react-spinners";

// Whole page loading spinner
const PageLoadingSpinner = ({ isFullPage }: { isFullPage?: boolean }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-10 h-screen ${
        !isFullPage ? "md:left-[16rem]" : ""
      } `}
    >
      <PuffLoader color="#ffffff" size={60} />
    </div>
  );
};

// Small loading spinner
const LoadingSpinner = ({ size, color }: { size?: number; color?: string }) => {
  return (
    <ClipLoader
      size={size || 25}
      color={color || "#ffffff"}
      cssOverride={{ borderWidth: "0.2rem" }}
    />
  );
};

export { PageLoadingSpinner, LoadingSpinner };
