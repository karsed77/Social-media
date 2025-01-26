import propTypes from "prop-types";
import { useDispatch } from "react-redux";
import { deletePost } from "../../actions/post.action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteCard = (props) => {
  const dispatch = useDispatch();

  // Fonction pour supprimer une publication
  const deleteQuote = () => {
    dispatch(deletePost(props.id));
  };
  
  return (
    <div
      onClick={() => {
        if (
          window.confirm("Voulez-vous vraiment supprimer cette publication ?")
        ) {
          deleteQuote();
          toast.success("Votre publication a bien été supprimé ! 🗑️", {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "custom-toast_success",
            progressClassName: "custom-progress-bar",
          });
        }
      }}
    >
      <img src="./img/icons/trash.svg" alt="trash" />
    </div>
  );
};

export default DeleteCard;

DeleteCard.propTypes = {
  id: propTypes.string.isRequired,
};
