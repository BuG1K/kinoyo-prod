import { FunctionComponent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon, List } from "@/components";
import Premiere from "./Premiere";
import { useStore } from "@/store";
import { getClassName } from "@/resources";
import githubIcon from "@/images/github-icon.svg";
import adblockLogo from "@/images/adblock-logo.svg";
import styles from "./menu.module.scss";
import "@/styles/classes.scss";

interface Props {
  onClose?: VoidFunction
}

const Menu: FunctionComponent<Props> = ({ onClose }) => {
  const [{ user, bookmarks }] = useStore();
  const router = useRouter();

  const onClickItem = (index: number) => {
    router.push(`/film?knId=${bookmarks[index].knId}`);

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={styles.menu}>
      <div className={styles.menu__header}>
        <div className={getClassName(styles.menu__logo, "logo")}>
          Yo
        </div>

        <div className={styles.menu__user}>
          <div className={styles.menu__name}>{user.name}</div>

          <div className={styles.menu__links}>
            <Link href="/auth">Sing in</Link>
            <Link
              href="/auth"
              as="/auth"
              onClick={() => {
                document.cookie = "token=";
                window.location.reload();
              }}
            >
              Log out
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.menu__list}>
        {bookmarks.length !== 0 ? (
          <List
            items={bookmarks.map((bookmark) => ({
              value: bookmark.name,
              id: bookmark.knId,
              children: bookmark.premiere
                ? <Premiere premiere={bookmark.premiere} /> : undefined,
            }))}
            onClickItem={onClickItem}
          />
        ) : (
          <Icon
            className={styles.menu__voidBookmarks}
            name="bookmark"
            size={30}
          />
        )}
      </div>

      <div className={styles.menu__footer}>
        <a
          className={styles.menu__blankLink}
          href="https://github.com/BuG1K/kinoyo"
          target="_blank"
          rel="noreferrer"
        >
          <img src={githubIcon.src} alt="github" />
        </a>

        <a
          className={styles.menu__blankLink}
          href="https://getadblock.com"
          target="_blank"
          rel="noreferrer"
        >
          <img src={adblockLogo.src} alt="adblock" />
        </a>
      </div>
    </div>
  );
};

export default Menu;
