import { useIsFetching } from '@tanstack/react-query';

const TopNav = () => {
  const isFetching = useIsFetching();
  
  return (
    <header className="w-full top-0 sticky z-40 bg-surface shadow-sm h-16">
      {isFetching > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container overflow-hidden z-50">
          <div className="h-full bg-primary animate-[progress-bar_1.5s_infinite_linear]"></div>
        </div>
      )}
      <div className="flex justify-between items-center px-lg h-full w-full max-w-[1440px] mx-auto">
        <div className="flex-1" />
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-low px-sm py-1 rounded-full transition-colors">
            <span className="font-label-md text-label-md font-bold text-primary">Admin</span>
            <span className="material-symbols-outlined text-[32px] text-primary">account_circle</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
