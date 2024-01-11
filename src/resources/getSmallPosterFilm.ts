import voidPoster from "@/images/voidPosterFilm.svg";

const getPosterFilm = (url: string | null, size?: "small") => {
  if (!url) {
    return voidPoster.src as string;
  }

  if (url && size) {
    const split = url.split("/");
    const indexSize = 6;
    const sizeProps = split[indexSize];
    const smallSize = "80x120";

    if (sizeProps) {
      split[indexSize] = smallSize;

      return split.join("/");
    }
  }

  return url;
};

export default getPosterFilm;
