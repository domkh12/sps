function LogoComponent() {
    return (
        <div className="flex items-center gap-2 mb-5 pl-[28px] pt-[20px]">
            <img src="/images/logo.png" alt="logo" className="w-7 h-auto"/>
            <div className="flex flex-col">
                <span className="text-xl tracking-wide">ប្រព័ន្ធចតរថយន្តឆ្លាតវៃ</span>
                <span className="text-sm text-opacity-70 text-black tracking-wide">Smart Parking System</span>
            </div>
        </div>
    )

}

export default LogoComponent;