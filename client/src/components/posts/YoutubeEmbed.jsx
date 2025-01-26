import { memo } from "react";
import PropTypes from "prop-types";

const YouTubeEmbed = memo(({ videoUrl, title }) => {
  return (
    <iframe
      width="500"
      height="300"
      src={videoUrl}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
});

YouTubeEmbed.displayName = "YouTubeEmbed";

export default YouTubeEmbed;

YouTubeEmbed.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
