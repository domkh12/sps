function AvartarCustom({ placeholderInitials, bgColor, textColor }) {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="h-10 w-10 rounded-full flex justify-center items-center"
    >
      <span style={{ color: textColor }} className="font-bold">
        {placeholderInitials}
      </span>
    </div>
  );
}

export default AvartarCustom;
