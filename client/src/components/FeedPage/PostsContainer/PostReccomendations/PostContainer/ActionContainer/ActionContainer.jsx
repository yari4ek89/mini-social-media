export default function ActionContainer(props) {
  return (
    <div className={"action-container" + (props._class || "")}>
      <img
        src={props.actionIcon}
        alt="action-icon"
        id="_action-img"
        onClick={props.onClick}
        style={props.buttonStyle}
      />
      <p id="_count-text">({props.count})</p>
    </div>
  );
}
