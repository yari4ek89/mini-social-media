export default function ModalMore(props) {
  const setEdit = () => {
    if (props.action === "edit") {
      props.saveComment(props.commentId, props.editText);
      props.setAction("none");
    } else if (props.action === "none") props.setAction("edit");
  };

  const setDelete = () => {
    props.deleteComment(props.commentId);
    props.setAction("none");
  };

  return (
    <div className="modal-more">
      <button onClick={() => setEdit()}>Edit</button>
      <button onClick={() => setDelete()}>Delete</button>
    </div>
  );
}
