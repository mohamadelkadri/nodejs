// to truncate the text in the post if it is long

const truncatePost = (post) => {
  if (post.length > 100) {
    return post.substring(0, 20) + "...";
  } else {
    return post;
  }
};

module.exports = truncatePost;
