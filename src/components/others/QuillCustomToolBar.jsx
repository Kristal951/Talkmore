const CustomToolbar = () => {
  return (
    <div id="custom-toolbar">
      <select className="ql-header">
        <option value="1" />
        <option value="2" />
        <option value="" />
      </select>

      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />

      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />

      <button className="ql-link" />

      {/* Custom emoji button */}
      <button className="ql-custom-emoji">
        😀
      </button>
    </div>
  );
};

export default CustomToolbar