import { useSelector } from "react-redux";

function LogoComponent() {
  const isCollapsed = useSelector((state) => state.action.isCollapsed);
  return (
    <div className="flex items-center gap-2 mb-5 pl-[24px] pt-[20px]">
      <div className="overflow-hidden w-10 h-10">
        <img src="/images/logo.png" alt="logo_sps" className="object-cover" />
      </div>

      <div
        className={`flex flex-col text-nowrap transition-all duration-500 ${
          isCollapsed ? "opacity-0 pointer-events-none w-0" : "opacity-100"
        }`}
      >
        <span className="text-[16px] xs:text-xl tracking-wide">
          ប្រព័ន្ធចតរថយន្តឆ្លាតវៃ
        </span>
        <span className="text-[12px] xs:text-sm text-opacity-70 text-black tracking-wide">
          Smart Parking System
        </span>
      </div>
    </div>
  );
}

export default LogoComponent;
