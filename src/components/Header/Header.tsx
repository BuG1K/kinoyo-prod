import {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon, Menu, Modal } from "@/components";
import { onCheckUserNotifications } from "@/actions";
import {
  getClassName,
  getClassWithlBool,
  onCheckDiffDateDays,
} from "@/resources";
import { useStore } from "@/store";
import { useResize } from "@/hooks";
import styles from "./header.module.scss";
import "@/styles/classes.scss";

const Header: FunctionComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [{ user, bookmarks }] = useStore();
  const resize = useResize();
  const [isRenderMenu, setIsRenderMenu] = useState(false);
  const [isOpneMenu, setIsOpenMenu] = useState<boolean | null>(null);
  const [isNotificationsNotVoid, setIsNotificationsNotVoid] = useState(false);
  const [isRenderNotifications, setIsRenderNotifications] = useState(false);
  const refNotification = useRef<HTMLDivElement>();
  const today = new Date(new Date().toISOString());
  const isLgScreen = resize.type === "screen-lg";

  useEffect(() => {
    if (isOpneMenu !== null && !isLgScreen) {
      setIsOpenMenu(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (isOpneMenu === null) {
      return () => null;
    } if (!isOpneMenu) {
      const timeout = setTimeout(() => {
        setIsRenderMenu(!isRenderMenu);
      }, 400);

      return () => {
        clearTimeout(timeout);
      };
    }

    setIsRenderMenu(!isRenderMenu);

    return () => null;
  }, [isOpneMenu]);

  const notifications = useMemo(() => {
    const items: { name: string, date: string }[] = [];

    bookmarks.forEach((bookmark) => {
      if (
        bookmark.premiere?.lastUpdated
        && user?.lastCheckNotifications
      ) {
        const daysLag = onCheckDiffDateDays(
          bookmark.premiere.lastUpdated,
          user.lastCheckNotifications,
        );
        const date = bookmark.premiere.type === "film"
          ? bookmark.premiere.premier : bookmark.premiere.episodesLastDate;

        if (daysLag >= 1) {
          setIsNotificationsNotVoid(true);
        } if (date) {
          items.push({ name: bookmark.name, date });
        }
      }
    });

    return items.sort((notification1, notification2) => {
      const dateA = new Date(notification1.date).getTime();
      const dateB = new Date(notification2.date).getTime();

      return dateB - dateA;
    });
  }, [user, bookmarks]);

  const onCheckNotifications = () => {
    setIsRenderNotifications(!isRenderNotifications);

    if (isNotificationsNotVoid) {
      onCheckUserNotifications().then(({ error }) => {
        if (!error) {
          setIsNotificationsNotVoid(false);
        }
      });
    }
  };

  if (pathname === "/auth") {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.header__side}>
        <button
          className={getClassName(
            "outlinedButton",
            "clickEffectButton",
            styles.header__button,
          )}
          type="button"
          aria-label="menu"
          onClick={() => setIsOpenMenu(true)}
        >
          <Icon name="menu" size={16} color="rgb(0, 127, 255)" />
        </button>

        <div className="logo">Yo</div>
      </div>

      <div className={styles.header__side}>
        <div
          className={styles.header__notificationContainer}
          ref={(ref) => {
            if (ref) {
              refNotification.current = ref;
            }
          }}
        >
          <button
            className={getClassName(
              "outlinedButton",
              "clickEffectButton",
              styles.header__button,
            )}
            type="button"
            aria-label="notifications"
            onClick={onCheckNotifications}
          >
            <Icon
              size={16}
              name={isNotificationsNotVoid
                ? "notificationsUnread" : "notifications"}
              color={isNotificationsNotVoid
                ? "rgb(255, 85, 0)" : "rgb(102, 178, 255)"}
            />
          </button>
        </div>

        <button
          className={getClassName(
            "outlinedButton",
            "clickEffectButton",
            styles.header__button,
          )}
          type="button"
          aria-label="search"
          onClick={() => router.push("/")}
        >
          <Icon name="search" size={16} color="rgb(102, 178, 255)" />
        </button>
      </div>

      <Modal
        isOpen={isRenderMenu || isLgScreen}
        onClose={() => (isLgScreen ? null : setIsOpenMenu(false))}
      >
        {(ref) => (
          <>
            {!isLgScreen && (
              <style>
                {`
                  body {
                    overflow: hidden;
                  }
                `}
              </style>
            )}

            <div
              className={getClassName(
                styles.modalMenu,
                getClassWithlBool(
                  styles.openModalMenu,
                  !isLgScreen,
                ),
                getClassWithlBool(
                  styles.desktopMenu,
                  isLgScreen,
                ),
                getClassWithlBool(
                  styles.closeModalMenu,
                  !isOpneMenu && !isLgScreen,
                ),
              )}
            >
              <div className={styles.modalMenu__container} ref={ref}>
                <Menu
                  onClose={isLgScreen ? undefined : () => setIsOpenMenu(false)}
                />
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={isRenderNotifications}
        onClose={() => setIsRenderNotifications(false)}
        anchor={refNotification.current}
      >
        {(ref) => (
          <div className={styles.notifications} ref={ref}>
            {notifications.length ? (
              <div>
                {notifications.map(({ name, date }) => (
                  <div
                    className={styles.notifications__notification}
                    key={name}
                  >
                    <div className={styles.notifications__name}>{name}</div>
                    <div
                      className={getClassName(
                        styles.notifications__date,
                        getClassWithlBool(
                          styles.notifications__date_active,
                          onCheckDiffDateDays(today, new Date(date)) <= 1,
                        ),
                      )}
                    >
                      {date.slice(5).split("-").reverse().join(".")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.notifications__void}>
                <Icon name="bookmark" color="rgb(176, 184, 196)" />
              </div>
            )}
          </div>
        )}
      </Modal>
    </header>
  );
};

export default Header;
