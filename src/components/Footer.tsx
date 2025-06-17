export const Footer = () => {
  return (
    <footer className="py-6 border-t border-gray-800">
      <div className="container mx-auto text-center text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} My Game TODO. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
